import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DetailView.css"; // reuse movie detail styles

const TvDetail = () => {
  const { id } = useParams();
  const [tv, setTv] = useState(null);
  const [videos, setVideos] = useState([]);
  const [watchProviders, setWatchProviders] = useState({});
  const [selectedPlayer, setSelectedPlayer] = useState("vidsrcTo");

  useEffect(() => {
    const fetchTV = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}&append_to_response=videos`
      );
      const data = await res.json();
      setTv(data);
      setVideos(data.videos?.results || []);
    };

    const fetchProviders = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${import.meta.env.VITE_TMDB_KEY}`
      );
      const data = await res.json();
      setWatchProviders(data.results?.US || {}); // Assuming US region
    };

    fetchTV();
    fetchProviders();
  }, [id]);

  if (!tv) return <div className="detail-view">Loading...</div>;

  // Helper to open a link in a new tab
  const openLink = (url) => window.open(url, "_blank");

  return (
    <div className="detail-view">
      <div className="info-container">
        <h2>{tv.name}</h2>

        {/* Streaming Providers */}
        {(watchProviders.flatrate || watchProviders.buy) && (
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <h3>Stream on:</h3>
            <div
              style={{
                display: "inline-flex",
                gap: "10px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {watchProviders.flatrate?.map((provider) => (
                <button
                  key={provider.provider_id}
                  onClick={() =>
                    openLink(`https://www.themoviedb.org/tv/${id}/watch`)
                  }
                  title={provider.provider_name}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                    alt={provider.provider_name}
                    style={{ width: "50px", height: "50px", borderRadius: "8px" }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Buy Digitally */}
        {watchProviders.buy && watchProviders.buy.length > 0 && (
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
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
                <button
                  key={provider.provider_id}
                  onClick={() =>
                    openLink(`https://www.themoviedb.org/tv/${id}/watch`)
                  }
                  title={provider.provider_name}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                    alt={provider.provider_name}
                    style={{ width: "50px", height: "50px", borderRadius: "8px" }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Buy Physically */}
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h4>Buy Physically:</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <a
                href={`https://www.amazon.com/s?k=${encodeURIComponent(tv.name + " DVD")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Amazon (DVD)
              </a>
            </li>
            <li>
              <a
                href={`https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(tv.name + " Blu-ray")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Best Buy (Blu-ray)
              </a>
            </li>
            <li>
              <a
                href={`https://www.walmart.com/search?q=${encodeURIComponent(tv.name + " Blu-ray")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Walmart (Blu-ray)
              </a>
            </li>
            <li>
              <a
                href={`https://www.blu-ray.com/search/?quicksearch=${encodeURIComponent(tv.name)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Blu-ray.com
              </a>
            </li>
          </ul>
        </div>

        {/* Additional details */}
        <div className="additional-details" style={{ marginBottom: "20px" }}>
          <p>
            <strong>Spoken Languages:</strong>{" "}
            {tv.spoken_languages && tv.spoken_languages.length > 0
              ? tv.spoken_languages.map((lang) => lang.english_name || lang.name).join(", ")
              : "N/A"}
          </p>
          <p>
            <strong>First Air Date:</strong> {tv.first_air_date || "N/A"}
          </p>
          <p>
            <strong>Popularity:</strong> {tv.popularity?.toFixed(1) || "N/A"}
          </p>
          <p>
            <strong>Vote Average:</strong> {tv.vote_average?.toFixed(1) || "N/A"}
          </p>
          <p>
            <strong>Vote Count:</strong> {tv.vote_count || "N/A"}
          </p>
        </div>

        <p>{tv.overview}</p>

        <h3>Trailers</h3>
        {videos
          .filter((v) => v.site === "YouTube")
          .map((video) => (
            <iframe
              key={video.id}
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${video.key}`}
              title={video.name}
              allowFullScreen
            />
          ))}

        <h3>Watch Series</h3>
        {selectedPlayer === "vidsrcTo" ? (
          <iframe
            src={`https://vidsrc.to/embed/tv/${id}`}
            width="100%"
            height="500"
            allowFullScreen
            title="TV Player Vidsrc.to"
          />
        ) : selectedPlayer === "vidsrcCc" ? (
          <iframe
            src={`https://vidsrc.cc/v2/embed/tv/${id}`}
            width="100%"
            height="500"
            allowFullScreen
            title="TV Player Vidsrc.cc"
          />
        ) : (
          <iframe
            src={`https://embed.su/embed/tv/${id}/1/1`}
            width="100%"
            height="500"
            allowFullScreen
            title="TV Player Embed.su"
          />
        )}

        <div className="player-toggle-buttons" style={{ marginTop: "12px" }}>
          <button onClick={() => setSelectedPlayer("vidsrcTo")}>Vidsrc.to</button>
          <button onClick={() => setSelectedPlayer("vidsrcCc")}>Vidsrc.cc</button>
          <button onClick={() => setSelectedPlayer("embedSu")}>Embed.su</button>
        </div>
      </div>
    </div>
  );
};

export default TvDetail;
