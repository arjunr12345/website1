import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DetailView.css";

const AnimeDetail = () => {
  const { anime_id } = useParams();
  const [anime, setAnime] = useState(null);
  const [episode, setEpisode] = useState(1);
  const [language, setLanguage] = useState("sub");
  const [server, setServer] = useState("vidsrc");
  const [streamUrl, setStreamUrl] = useState("");
  const [loadingStream, setLoadingStream] = useState(false);

  // Fetch AniList data (anime details)
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

  // Generate the stream URL when server or episode changes
  useEffect(() => {
    if (!anime) return;

    // Check the selected server and generate appropriate URLs
    if (server === "vidsrc") {
      setStreamUrl(`https://vidsrc.cc/v2/embed/anime/ani${anime.id}/${episode}/${language}`);
    } else if (server === "vidsrc.icu") {
      const langCode = language === "dub" ? 1 : 0;
      setStreamUrl(`https://vidsrc.icu/embed/anime/${anime.id}/${episode}/${langCode}`);
    } else if (server === "hianimez") {
      // Set the stream URL to the Hianime homepage when the server is Hianimez
      setStreamUrl("https://hianimez.to"); // This will load the homepage of Hianime
    }
  }, [anime, episode, language, server]);

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

      {/* Episode Controls */}
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

        {/* Language & Server Switch */}
        <div style={{ marginTop: "1rem" }}>
          <strong>Language:</strong>{" "}
          <button onClick={() => setLanguage("sub")} disabled={language === "sub"}>Sub</button>
          <button onClick={() => setLanguage("dub")} disabled={language === "dub"}>Dub</button>

          <br /><br />

          <strong>Server:</strong>{" "}
          <button onClick={() => setServer("vidsrc")} disabled={server === "vidsrc"}>Vidsrc</button>
          <button onClick={() => setServer("vidsrc.icu")} disabled={server === "vidsrc.icu"}>Vidsrc.ICU</button>
          <button onClick={() => setServer("hianimez")} disabled={server === "hianimez"}>Hianimez</button>
        </div>
      </div>

      {/* Stream Player */}
      {streamUrl ? (
        <iframe
          src={streamUrl}
          title={`Episode ${episode}`}
          allowFullScreen
          className="video-frame"
          width="100%"
          height="500px"
        ></iframe>
      ) : (
        <p>Error loading stream. Please try a different server.</p>
      )}
    </div>
  );
};

export default AnimeDetail;
