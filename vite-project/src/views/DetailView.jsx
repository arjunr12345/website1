// DetailView.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./DetailView.css";

const DetailView = () => {
  const [movieData, setMovieData] = useState({});
  const [videos, setVideos] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [watchProviders, setWatchProviders] = useState({});
  const [server, setServer] = useState("vidsrc.to");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const params = useParams();

  const countries = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "IN", name: "India" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" },
    { code: "BR", name: "Brazil" },
    { code: "MX", name: "Mexico" },
    { code: "JP", name: "Japan" },
    { code: "KR", name: "South Korea" },
    { code: "CN", name: "China" },
    { code: "RU", name: "Russia" },
    { code: "ZA", name: "South Africa" },
    { code: "SE", name: "Sweden" },
    { code: "FI", name: "Finland" },
    { code: "NO", name: "Norway" },
    { code: "DK", name: "Denmark" },
    { code: "PL", name: "Poland" },
    { code: "BE", name: "Belgium" },
    { code: "NL", name: "Netherlands" },
    { code: "AR", name: "Argentina" },
    { code: "CH", name: "Switzerland" },
    { code: "AT", name: "Austria" },
    { code: "PT", name: "Portugal" },
    { code: "GR", name: "Greece" },
    { code: "HU", name: "Hungary" },
    { code: "CZ", name: "Czech Republic" },
    { code: "UA", name: "Ukraine" },
    { code: "EE", name: "Estonia" },
    { code: "LV", name: "Latvia" },
    { code: "LT", name: "Lithuania" },
    { code: "RO", name: "Romania" },
    { code: "BG", name: "Bulgaria" },
  ];

  const getMovieData = async () => {
    try {
      const movieDetails = await axios.get(
        `https://api.themoviedb.org/3/movie/${params.id}?language=en-US&api_key=${import.meta.env.VITE_TMDB_KEY}`
      );
      const trailerData = await axios.get(
        `https://api.themoviedb.org/3/movie/${params.id}/videos?language=en-US&api_key=${import.meta.env.VITE_TMDB_KEY}`
      );
      const providersData = await axios.get(
        `https://api.themoviedb.org/3/movie/${params.id}/watch/providers?api_key=${import.meta.env.VITE_TMDB_KEY}`
      );

      setMovieData(movieDetails.data);
      setVideos(trailerData.data.results);
      setWatchProviders(
        providersData.data.results?.[selectedCountry] || {}
      );
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  };

  useEffect(() => {
    getMovieData();
  }, [params.id, selectedCountry]);

  useEffect(() => {
    const trailerList = videos.filter((video) => video.type === "Trailer");
    setTrailers(trailerList);
  }, [videos]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <div className="detail-view">
      <h2>{movieData.title}</h2>

      {/* Country Selection Dropdown */}
      <div>
        <label htmlFor="country-select">Select Country:</label>
        <select
          id="country-select"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Watch and Buy Section */}
      <div>
        {(watchProviders.flatrate?.length > 0 ||
          watchProviders.buy?.length > 0) && <h3>Stream</h3>}

        {/* Streaming Services */}
        {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                gap: "10px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {watchProviders.flatrate.map((provider) => (
                <a
                  key={provider.provider_id}
                  href={`https://www.themoviedb.org/movie/${params.id}/watch`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={provider.provider_name}
                  style={{ display: "inline-block", padding: 0 }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                    alt={provider.provider_name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Buy Digitally */}
        {watchProviders.buy && watchProviders.buy.length > 0 && (
          <div style={{ textAlign: "center" }}>
            <h4>Buy Digitally:</h4>
            <div
              style={{
                display: "inline-flex",
                gap: "10px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {watchProviders.buy.map((provider) => (
                <a
                  key={provider.provider_id}
                  href={`https://www.themoviedb.org/movie/${params.id}/watch`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={provider.provider_name}
                  style={{ display: "inline-block", padding: 0 }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                    alt={provider.provider_name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Buy Physically */}
        <div style={{ marginBottom: "1rem" }}>
          <h4>Buy Physically:</h4>
          <div
            style={{
              display: "inline-flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <a
              href={`https://www.amazon.com/s?k=${encodeURIComponent(
                movieData.title + " DVD"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Amazon (DVD/Blu-ray)"
              style={{ display: "inline-block", padding: 0 }}
            >
              <img
                src="https://image.tmdb.org/t/p/original/seGSXajazLMCKGB5hnRCidtjay1.jpg"
                alt="Amazon DVD/Blu-ray"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  objectFit: "contain",
                  backgroundColor: "white",
                }}
              />
            </a>

            <a
              href={`https://www.walmart.com/search/?query=${encodeURIComponent(
                movieData.title + " DVD"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Walmart"
              style={{ display: "inline-block", padding: 0 }}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz1Y86WWaVlA-qPIKjhDrxpIf_gPnP4Btw1A&s"
                alt="Walmart"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  objectFit: "contain",
                  backgroundColor: "white",
                }}
              />
            </a>

            <a
              href={`https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(
                movieData.title + " DVD"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Best Buy"
              style={{ display: "inline-block", padding: 0 }}
            >
              <img
                src="https://partners.bestbuy.com/image/image_gallery?uuid=7e4efc4e-432f-f497-fe99-ec311c640241&groupId=20126"
                alt="Best Buy"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  objectFit: "contain",
                  backgroundColor: "white",
                }}
              />
            </a>


            <a
              href={`https://www.blu-ray.com/search/?quicksearch=1&quicksearch_country=US&quicksearch_keyword=${encodeURIComponent(
                movieData.title
              )}&section=bluraymovies`}
              target="_blank"
              rel="noopener noreferrer"
              title="Blu-ray.com"
              style={{ display: "inline-block", padding: 0 }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/81/81046.png"
                alt="Blu-ray.com"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  objectFit: "contain",
                  backgroundColor: "white",
                }}
              />
            </a>
          </div>
        </div>
      </div>

      {/* Movie Info */}
      <div>
        <h3>Original Title:</h3>
        <p>{movieData.original_title}</p>
      </div>

      <div>
        <h3>Spoken Languages:</h3>
        {movieData.spoken_languages?.map((lang) => (
          <p key={lang.name}>{lang.name}</p>
        ))}
      </div>

      <div>
        <h3>Release Date:</h3>
        <p>{movieData.release_date}</p>
      </div>

      <div>
        <h3>Popularity:</h3>
        <p>{movieData.popularity}</p>
      </div>

      <div>
        <h3>Vote Average:</h3>
        <p>{movieData.vote_average}</p>
      </div>

      <div>
        <h3>Vote Count:</h3>
        <p>{movieData.vote_count}</p>
      </div>

      <div>
        <h3>Overview:</h3>
        <p>{movieData.overview}</p>
      </div>

      {/* Trailers */}
      <div>
        <h3>Trailers:</h3>
        {trailers.map((video) => (
          <iframe
            key={video.id}
            width="640"
            height="360"
            src={`https://youtube.com/embed/${video.key}`}
            title={video.name}
            allowFullScreen
            frameBorder="0"
          ></iframe>
        ))}
      </div>

      {/* Stream Player */}
      <div>
        <h3>Watch Movie:</h3>

        <div style={{ marginBottom: "1rem" }}>
          <strong>Server:</strong>{" "}
          <button
            onClick={() => setServer("vidsrc.to")}
            disabled={server === "vidsrc.to"}
          >
            VidSrc.to
          </button>
          <button
            onClick={() => setServer("vidsrc.cc")}
            disabled={server === "vidsrc.cc"}
          >
            VidSrc.cc
          </button>
        </div>

        <iframe
          src={
            server === "vidsrc.to"
              ? `https://vidsrc.to/embed/movie/${params.id}`
              : `https://vidsrc.cc/v2/embed/movie/${params.id}`
          }
          width="100%"
          height="500"
          allowFullScreen
          frameBorder="0"
          title="Movie Stream Player"
        ></iframe>
      </div>
    </div>
  );
};

export default DetailView;
