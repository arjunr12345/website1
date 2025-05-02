import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./GenreView.css";

const TvGenreView = () => {
  const [tvData, setTvData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [done, setDone] = useState(false);
  const { genre_id } = useParams();

  const getTvShows = async () => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/discover/tv`,
      {
        params: {
          api_key: import.meta.env.VITE_TMDB_KEY,
          language: "en-US",
          page,
          sort_by: "popularity.desc",
          with_genres: genre_id,
          include_null_first_air_dates: false,
        },
      }
    );
    setTvData(res.data.results);
    // TMDb caps at 500 pages
    setTotalPages(res.data.total_pages > 500 ? 500 : res.data.total_pages);
    setDone(true);
  };

  const movePage = (delta) => {
    setDone(false);
    setPage((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > totalPages) return totalPages;
      return next;
    });
    getTvShows();
  };

  const setCurrentPage = (n) => {
    setDone(false);
    setPage(n > totalPages ? totalPages : n < 1 ? 1 : n);
    getTvShows();
  };

  useEffect(() => {
    getTvShows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <div className="genre-view">
      {tvData.map((show) => (
        <a key={show.id} href={`/tv/${show.id}`}>
          <img
            src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
            alt={show.name}
          />
        </a>
      ))}
      <div className="pagination-controls">
        <button onClick={() => setCurrentPage(1)}>1</button>
        <button onClick={() => movePage(-1)} disabled={page === 1}>
          {"<"}
        </button>
        <span>{page}</span>
        <button
          onClick={() => movePage(1)}
          disabled={page === totalPages}
        >
          {">"}
        </button>
        <button onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </button>
      </div>
    </div>
  );
};

export default TvGenreView;
