import { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import debounce from "lodash.debounce";
import Header from "../components/Header"; // Correct import path
import Footer from "../components/Footer"; // Correct import path

const API_KEY = import.meta.env.VITE_TMDB_KEY;

const SearchView = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchResults = async (search, pageNum = 1) => {
    try {
      const [movieRes, tvRes, animeRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(search)}&page=${pageNum}&api_key=${API_KEY}`).then(res => res.json()),
        fetch(`https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(search)}&page=${pageNum}&api_key=${API_KEY}`).then(res => res.json()),
        fetch(`https://graphql.anilist.co`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query ($search: String) {
                Page(perPage: 10) {
                  media(search: $search, type: ANIME) {
                    id
                    title {
                      romaji
                      english
                    }
                    description(asHtml: false)
                  }
                }
              }
            `,
            variables: { search }
          })
        }).then(res => res.json())
      ]);

      const movies = movieRes.results || [];
      const tvShows = tvRes.results || [];
      const anime = animeRes.data?.Page?.media || [];

      const mergedResults = [
        ...movies.map(item => ({ type: "movie", ...item })),
        ...tvShows.map(item => ({ type: "tv", ...item })),
        ...anime.map(item => ({
          type: "anime",
          id: item.id,
          title: item.title?.english || item.title?.romaji,
          overview: item.description
        }))
      ];

      if (pageNum === 1) {
        setResults(mergedResults);
      } else {
        setResults(prev => [...prev, ...mergedResults]);
      }

      setHasMore(movieRes.page < movieRes.total_pages || tvRes.page < tvRes.total_pages);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const debouncedFetch = useCallback(
    debounce((q, p) => fetchResults(q, p), 300),
    []
  );

  useEffect(() => {
    if (searchQuery) {
      setPage(1);
      debouncedFetch(searchQuery, 1);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (page > 1 && searchQuery) {
      fetchResults(searchQuery, page);
    }
  }, [page]);

  const loadMore = () => {
    if (hasMore) setPage(prev => prev + 1);
  };

  return (
    <div>
      {/* Render Header */}
      <Header />
      
      <div className="search-container">
        <h2>Search results for: "{searchQuery}"</h2>
        <div className="movie-results">
          {results.map((item, index) => (
            <div key={`${item.type}-${item.id}-${index}`} className="movie-card">
              <h3>
                {item.type === "movie" && (
                  <>
                    <span>Movie: </span>
                    <Link to={`/movies/details/${item.id}`}>{item.title}</Link>
                  </>
                )}
                {item.type === "tv" && (
                  <>
                    <span>TV Show: </span>
                    <Link to={`/tv/${item.id}`}>{item.name}</Link>
                  </>
                )}
                {item.type === "anime" && (
                  <>
                    <span>Anime: </span>
                    <Link to={`/anime/details/${item.id}`}>{item.title}</Link> {/* Using Link to open in the same tab */}
                  </>
                )}
              </h3>
              <p>{item.overview || item.description}</p>
            </div>
          ))}
        </div>
        {hasMore && <button onClick={loadMore}>Load More</button>}
      </div>

      {/* Render Footer */}
      <Footer />
    </div>
  );
};

export default SearchView;
