import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./GenreView.css";

const providers = [
  { id: 8, name: "Netflix", color: "#e50914" },
  { id: 337, name: "Disney+", color: "#113ccf" },
  { id: 9, name: "Amazon Prime", color: "#00a8e1" },
  { id: 387, name: "HBO Max", color: "#6e00f5" },
  { id: 15, name: "Hulu", color: "#1ce783" },
  { id: 350, name: "Apple TV+", color: "#999999" },
  { id: 386, name: "Peacock", color: "#1f5fe4" },
  { id: 531, name: "Paramount+", color: "#004b91" },
  { id: 2552, name: "Starz", color: "#ec691f" },
];

const TvGenreView = () => {
  const [tvData, setTvData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [done, setDone] = useState(false);
  const [provider, setProvider] = useState(null);
  const [country, setCountry] = useState("US"); // default to US
  const [countries, setCountries] = useState([]);
  const { genre_id } = useParams();

  // Fetch the list of countries from TMDb API
  const fetchCountries = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/configuration/countries?api_key=${import.meta.env.VITE_TMDB_KEY}`
      );
      setCountries(res.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const getTvShows = async () => {
    let url = `https://api.themoviedb.org/3/discover/tv?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${genre_id}&include_null_first_air_dates=false`;

    if (provider) {
      url += `&with_watch_providers=${provider}&watch_region=${country}`;
    }

    try {
      const res = await axios.get(url);
      setTvData(res.data.results);
      setTotalPages(res.data.total_pages > 500 ? 500 : res.data.total_pages);
      setDone(true);
    } catch (error) {
      console.error("Error fetching TV shows:", error);
      setTvData([]);
      setTotalPages(0);
      setDone(true);
    }
  };

  const movePage = (delta) => {
    const next = page + delta;
    if (next >= 1 && next <= totalPages) {
      setPage(next);
      setDone(false);
    }
  };

  const setCurrentPage = (n) => {
    const target = Math.max(1, Math.min(n, totalPages));
    setPage(target);
    setDone(false);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    getTvShows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, page, provider, genre_id, country]);

  return (
    <div className="genre-view">
      {/* Country Dropdown */}
      <div className="country-dropdown" style={{ marginBottom: "10px" }}>
        <label htmlFor="country">Choose a country: </label>
        <select
          id="country"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setPage(1);
            setDone(false);
          }}
        >
          {countries.map((c) => (
            <option key={c.iso_3166_1} value={c.iso_3166_1}>
              {c.english_name}
            </option>
          ))}
        </select>
      </div>

      {/* Provider Buttons */}
      <div className="provider-buttons">
        {providers.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setProvider(p.id);
              setPage(1);
              setDone(false);
            }}
            style={{
              backgroundColor: provider === p.id ? p.color : "#eee",
              color: provider === p.id ? "white" : "black",
              border: "none",
              margin: "5px",
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s ease",
            }}
          >
            {p.name}
          </button>
        ))}
        {provider && (
          <button
            onClick={() => {
              setProvider(null);
              setPage(1);
              setDone(false);
            }}
            style={{
              backgroundColor: "#888",
              color: "white",
              border: "none",
              margin: "5px",
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s ease",
            }}
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* TV Show Grid */}
      <div className="movie-grid">
        {tvData.length > 0 ? (
          tvData.map((show) => (
            <a key={show.id} href={`/tv/${show.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
              />
            </a>
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>
            No TV shows found for this filter.
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={page === 1}>
          1
        </button>
        <button onClick={() => movePage(-1)} disabled={page === 1}>
          {"<"}
        </button>
        <span>{page}</span>
        <button onClick={() => movePage(1)} disabled={page === totalPages}>
          {">"}
        </button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={page === totalPages}>
          {totalPages}
        </button>
      </div>
    </div>
  );
};

export default TvGenreView;
