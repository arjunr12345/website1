import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DetailView.css";

const AnimeDetail = () => {
  const { anime_id } = useParams();
  const [anime, setAnime] = useState(null);
  const [episode, setEpisode] = useState(1);

  useEffect(() => {
    fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query ($id: Int) {
            Media(id: $id, type: ANIME) {
              id
              title {
                romaji
                english
              }
              description(asHtml: false)
              genres
              coverImage {
                large
              }
              trailer {
                id
                site
              }
            }
          }
        `,
        variables: { id: parseInt(anime_id) },
      }),
    })
      .then(res => res.json())
      .then(data => setAnime(data.data.Media));
  }, [anime_id]);

  if (!anime) return <div>Loading...</div>;

  const title = anime.title.english || anime.title.romaji;
  const trailer = anime.trailer?.site === "youtube" ? anime.trailer.id : null;

  const handleNext = () => setEpisode(prev => prev + 1);
  const handlePrevious = () => setEpisode(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="detail-view">
      <h1>{title}</h1>
      <img src={anime.coverImage.large} alt={title} />
      <p>{anime.description}</p>
      <p><strong>Genres:</strong> {anime.genres.join(", ")}</p>

      {trailer && (
        <>
          <h3>Official Trailer</h3>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${trailer}`}
            title="Anime Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </>
      )}

      {/* Manual Episode Input with Prev/Next */}
      <div className="selector">
        <h3>Episode Navigation</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button onClick={handlePrevious}>Previous</button>
          <input
            type="number"
            min="1"
            value={episode}
            onChange={e => setEpisode(Math.max(1, Number(e.target.value)))}
            style={{ width: "4rem", textAlign: "center" }}
          />
          <button onClick={handleNext}>Next</button>
        </div>
      </div>

      <iframe
        src={`https://vidsrc.cc/v2/embed/anime/ani${anime.id}/${episode}/sub`}
        title={`Anime Episode ${episode}`}
        allowFullScreen
        className="video-frame"
        width="100%"
        height="500px"
      ></iframe>
    </div>
  );
};

export default AnimeDetail;
