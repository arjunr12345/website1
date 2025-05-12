import { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import debounce from "lodash.debounce";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

const SearchView = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");

  const [results, setResults] = useState([]);
  const [moviePage, setMoviePage] = useState(1);
  const [tvPage, setTvPage] = useState(1);
  const [animePage, setAnimePage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchResults = async (search, movieP = 1, tvP = 1, animeP = 1) => {
    try {
      const [movieRes, tvRes, animeRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(search)}&page=${movieP}&api_key=${API_KEY}`).then(res => res.json()),
        fetch(`https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(search)}&page=${tvP}&api_key=${API_KEY}`).then(res => res.json()),
        fetch(`https://graphql.anilist.co`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query ($search: String, $page: Int) {
                Page(page: $page, perPage: 10) {
                  media(search: $search, type: ANIME) {
                    id
                    title {
                      romaji
                      english
                    }
                    description(asHtml: false)
                    coverImage {
                      large
                    }
                  }
                }
              }
            `,
            variables: { search, page: animeP }
          })
        }).then(res => res.json())
      ]);

      const movies = movieRes.results || [];
      const tvShows = tvRes.results || [];
      const anime = animeRes.data?.Page?.media || [];

      const mergedResults = [
        ...movies.map(item => ({
          type: "movie",
          id: item.id,
          title: item.title,
          overview: item.overview,
          poster: item.poster_path
            ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
            : "https://via.placeholder.com/120x180?text=No+Image"
        })),
        ...tvShows.map(item => ({
          type: "tv",
          id: item.id,
          title: item.name,
          overview: item.overview,
          poster: item.poster_path
            ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
            : "https://via.placeholder.com/120x180?text=No+Image"
        })),
        ...anime.map(item => ({
          type: "anime",
          id: item.id,
          title: item.title?.english || item.title?.romaji,
          overview: item.description,
          poster: item.coverImage?.large || "https://via.placeholder.com/120x180?text=No+Image"
        }))
      ];

      if (movieP === 1 && tvP === 1 && animeP === 1) {
        setResults(mergedResults);
      } else {
        setResults(prev => [...prev, ...mergedResults]);
      }

      const moreMovies = movieRes.page < movieRes.total_pages;
      const moreTV = tvRes.page < tvRes.total_pages;
      const moreAnime = anime.length === 10;

      setHasMore(moreMovies || moreTV || moreAnime);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const debouncedFetch = useCallback(
    debounce((q, m, t, a) => fetchResults(q, m, t, a), 300),
    []
  );

  useEffect(() => {
    if (searchQuery) {
      setMoviePage(1);
      setTvPage(1);
      setAnimePage(1);
      debouncedFetch(searchQuery, 1, 1, 1);
    }
  }, [searchQuery]);

  const loadMore = () => {
    const newMoviePage = moviePage + 1;
    const newTvPage = tvPage + 1;
    const newAnimePage = animePage + 1;

    setMoviePage(newMoviePage);
    setTvPage(newTvPage);
    setAnimePage(newAnimePage);

    fetchResults(searchQuery, newMoviePage, newTvPage, newAnimePage);
  };

  return (
    <div>
      <Header />

      <div className="search-container" style={{ padding: "20px", textAlign: "center" }}>
        <h2>Search results for: "{searchQuery}"</h2>
        <div className="movie-results" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          {results.map((item, index) => (
            <div
              key={`${item.type}-${item.id}-${index}`}
              className="movie-card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                margin: "12px 0",
                width: "80%",
                borderBottom: "1px solid #ccc"
              }}
            >
              <div style={{ flex: 1, textAlign: "left" }}>
                <h3 style={{ marginBottom: "8px" }}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      marginRight: "8px",
                      fontWeight: "bold",
                      fontSize: "14px",
                      color:
                        item.type === "anime" ? "black" : "white",
                      backgroundColor:
                        item.type === "movie"
                          ? "red"
                          : item.type === "tv"
                          ? "black"
                          : "white",
                      border: item.type === "anime" ? "1px solid black" : "none"
                    }}
                  >
                    {item.type === "movie"
                      ? "Movie"
                      : item.type === "tv"
                      ? "TV Show"
                      : "Anime"}
                  </span>
                  <Link
                    to={
                      item.type === "movie"
                        ? `/movies/details/${item.id}`
                        : item.type === "tv"
                        ? `/tv/${item.id}`
                        : `/anime/details/${item.id}`
                    }
                    style={{
                      textDecoration: "none",
                      color: "hotpink",
                      fontWeight: "bold"
                    }}
                    onMouseEnter={(e) => e.target.style.color = "red"}
                    onMouseLeave={(e) => e.target.style.color = "hotpink"}
                  >
                    {item.title}
                  </Link>
                </h3>
                <p style={{ margin: 0 }}>{item.overview}</p>
              </div>
              {item.poster && (
                <img
                  src={item.poster}
                  alt={item.title}
                  style={{ width: "120px", height: "180px", objectFit: "cover", marginLeft: "20px", borderRadius: "4px" }}
                />
              )}
            </div>
          ))}
        </div>
        {hasMore && (
          <button
            onClick={loadMore}
            style={{
              marginTop: "20px"
            }}
          >
            Load More
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchView;
