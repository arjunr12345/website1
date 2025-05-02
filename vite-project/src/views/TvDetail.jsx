import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DetailView.css"; // reuse movie detail styles

const TvDetail = () => {
  const { id } = useParams();
  const [tv, setTv] = useState(null);
  const [videos, setVideos] = useState([]);

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
        <iframe
          src={`https://vidsrc.to/embed/tv/${id}`}
          width="100%"
          height="500"
          allowFullScreen
          title="TV Player"
        />
      </div>
    </div>
  );
};

export default TvDetail;
