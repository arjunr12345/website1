import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DetailView.css"; // reuse movie detail styles

const TvDetail = () => {
  const { id } = useParams();
  const [tv, setTv] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState("vidsrcTo"); // State to track the selected video player

  useEffect(() => {
    const fetchTV = async () => {
      const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}&append_to_response=videos`);
      const data = await res.json();
      setTv(data);
      setVideos(data.videos?.results || []);
    };
    fetchTV();
  }, [id]);

  if (!tv) return <div className="detail-view">Loading...</div>;

  return (
    <div className="detail-view">
      <div className="info-container">
        <h2>{tv.name}</h2>
        <p>{tv.overview}</p>

        <h3>Trailers</h3>
        {videos.filter(v => v.site === "YouTube").map(video => (
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
          // Render Vidsrc.to player if selected
          <iframe
            src={`https://vidsrc.to/embed/tv/${id}`}
            width="100%"
            height="500"
            allowFullScreen
            title="TV Player Vidsrc.to"
          />
        ) : selectedPlayer === "vidsrcCc" ? (
          // Render Vidsrc.cc player if selected
          <iframe
            src={`https://vidsrc.cc/v2/embed/tv/${id}`}
            width="100%"
            height="500"
            allowFullScreen
            title="TV Player Vidsrc.cc"
          />
        ) : (
          // Render Embed.su player if selected
          <iframe
            src={`https://embed.su/embed/tv/${id}/1/1`}
            width="100%"
            height="500"
            allowFullScreen
            title="TV Player Embed.su"
          />
        )}

        {/* Buttons for switching players moved under "Watch Series" */}
        <div className="player-toggle-buttons">
          <button onClick={() => setSelectedPlayer("vidsrcTo")}>Vidsrc.to</button>
          <button onClick={() => setSelectedPlayer("vidsrcCc")}>Vidsrc.cc</button>
          <button onClick={() => setSelectedPlayer("embedSu")}>Embed.su</button>
        </div>
      </div>
    </div>
  );
};

export default TvDetail;
