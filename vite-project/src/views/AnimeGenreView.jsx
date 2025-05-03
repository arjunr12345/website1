import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./GenreView.css";

const AnimeGenreView = () => {
  const [animeData, setAnimeData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(500);
  const [done, setDone] = useState(false);
  const { genre } = useParams();

  const fetchAnime = async () => {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query ($genre: String, $page: Int) {
            Page(page: $page, perPage: 20) {
              pageInfo {
                total
                currentPage
                lastPage
              }
              media(genre: $genre, type: ANIME, sort: POPULARITY_DESC) {
                id
                coverImage { large }
                title {
                  romaji
                  english
                }
              }
            }
          }
        `,
        variables: { genre, page },
      }),
    });

    const data = await response.json();
    setAnimeData(data.data.Page.media);
    const lastPage = data.data.Page.pageInfo.lastPage;
    setTotalPages(Math.min(500, lastPage));
    setDone(true);
  };

  const movePage = (x) => {
    const newPage = Math.max(1, Math.min(page + x, totalPages));
    setPage(newPage);
    setDone(false);
  };

  const setCurrentPage = (x) => {
    const newPage = Math.max(1, Math.min(x, totalPages));
    setPage(newPage);
    setDone(false);
  };

  useEffect(() => {
    fetchAnime();
  }, [done]);

  return (
    <div className="genre-view">
      {animeData.map((anime) => {
        const title = anime.title.english || anime.title.romaji;
        return (
          <a
            key={anime.id}
            href={`/anime/details/${anime.id}`}
            style={{ position: "relative", display: "inline-block", margin: "10px" }}
          >
            <img
              src={anime.coverImage.large}
              alt={title}
              style={{ display: "block", width: "200px", height: "300px", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                textAlign: "center",
                padding: "5px",
                fontSize: "14px",
              }}
            >
              {title}
            </div>
          </a>
        );
      })}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setCurrentPage(1)}>1</button>
        <button onClick={() => movePage(-1)}>{"<"}</button>
        <span>{page}</span>
        <button onClick={() => movePage(1)}>{">"}</button>
        <button onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
      </div>
    </div>
  );
};

export default AnimeGenreView;
