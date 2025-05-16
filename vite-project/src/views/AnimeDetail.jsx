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
              episodes
              averageScore
              popularity
              startDate {
                year
                month
                day
              }
              externalLinks {
                site
                url
              }
            }
          }
        `,
        variables: { id: parseInt(anime_id) },
      }),
    })
      .then((res) => res.json())
      .then((data) => setAnime(data.data.Media));
  }, [anime_id]);

  useEffect(() => {
    if (!anime) return;

    if (server === "vidsrc") {
      setStreamUrl(
        `https://vidsrc.cc/v2/embed/anime/ani${anime.id}/${episode}/${language}`
      );
    } else if (server === "vidsrc.icu") {
      const langCode = language === "dub" ? 1 : 0;
      setStreamUrl(
        `https://vidsrc.icu/embed/anime/${anime.id}/${episode}/${langCode}`
      );
    } else if (server === "hianimez") {
      const searchTitle = anime.title.english || anime.title.romaji;
      const encodedTitle = encodeURIComponent(searchTitle);
      setStreamUrl(`https://hianimez.to/search?keyword=${encodedTitle}`);
    }
  }, [anime, episode, language, server]);

  if (!anime) return <div>Loading...</div>;

  const title = anime.title.english || anime.title.romaji;
  const trailer = anime.trailer?.site === "youtube" ? anime.trailer.id : null;

  const startDate = anime.startDate
    ? `${anime.startDate.year || "?"}-${anime.startDate.month
        ?.toString()
        .padStart(2, "0") || "??"}-${anime.startDate.day
        ?.toString()
        .padStart(2, "0") || "??"}`
    : "N/A";

  const crunchyrollLink = anime.externalLinks?.find(
    (link) => link.site === "Crunchyroll"
  );

  const handleNext = () => setEpisode((prev) => prev + 1);
  const handlePrevious = () =>
    setEpisode((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="detail-view">
      <h1>{title}</h1>

      {/* Stream Providers */}
      <div style={{ marginBottom: "1rem" }}>
        <h3>Stream:</h3>
        <div style={{ display: "inline-flex", gap: "10px", flexWrap: "wrap" }}>
          {crunchyrollLink && (
            <a
              href={crunchyrollLink.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Crunchyroll"
              style={{ display: "inline-block", padding: 0 }}
            >
              <img
                src="https://media.themoviedb.org/t/p/original/fzN5Jok5Ig1eJ7gyNGoMhnLSCfh.jpg"
                alt="Crunchyroll"
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
          )}
        </div>
      </div>

      {/* Buy Digitally */}
      <div style={{ marginBottom: "1rem" }}>
        <h3>Buy Digitally:</h3>
        <div style={{ display: "inline-flex", gap: "10px", flexWrap: "wrap" }}>
          <a
            href={`https://www.amazon.com/gp/video/search?phrase=${encodeURIComponent(
              title
            )}&k=${encodeURIComponent(title)}&ref=atv_rs_redirect`}
            target="_blank"
            rel="noopener noreferrer"
            title="Amazon Digital"
            style={{ display: "inline-block", padding: 0 }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
              alt="Amazon Digital"
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
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
              title
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube"
            style={{ display: "inline-block", padding: 0 }}
          >
            <img
              src="https://image.tmdb.org/t/p/original/pTnn5JwWr4p3pG8H6VrpiQo7Vs0.jpg"
              alt="YouTube"
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

      {/* Buy Physically */}
      <div style={{ marginBottom: "1rem" }}>
        <h3>Buy Physically:</h3>
        <div style={{ display: "inline-flex", gap: "10px", flexWrap: "wrap" }}>
          <a
            href={`https://www.amazon.com/s?k=${encodeURIComponent(
              title
            )}+anime+dvd`}
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
              title
            )}+anime`}
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
              title
            )}+anime`}
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
            href={`https://store.crunchyroll.com/search?q=${encodeURIComponent(
              title
            )}&prefn1=departments&prefv1=Home%20Entertainment%20%26%20Books`}
            target="_blank"
            rel="noopener noreferrer"
            title="Crunchyroll Store"
            style={{ display: "inline-block", padding: 0 }}
          >
            <img
              src="https://a.storyblok.com/f/178900/400x400/c440e1ad67/squarelogos_crlogo_store_lockup_orange_400x400.png"
              alt="Crunchyroll Store"
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
              title
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

      {/* Additional details */}
      <div className="additional-details" style={{ marginBottom: "20px" }}>
        <p>
          <strong>Start Date:</strong> {startDate}
        </p>
        <p>
          <strong>Episodes:</strong> {anime.episodes || "N/A"}
        </p>
        <p>
          <strong>Average Score:</strong>{" "}
          {anime.averageScore ? `${anime.averageScore}/100` : "N/A"}
        </p>
        <p>
          <strong>Popularity:</strong> {anime.popularity || "N/A"}
        </p>
      </div>

      <img src={anime.coverImage.large} alt={title} />
      <p>{anime.description}</p>
      <p>
        <strong>Genres:</strong> {anime.genres.join(", ")}
      </p>

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
            onChange={(e) =>
              setEpisode(Math.max(1, Number(e.target.value)))
            }
            style={{ width: "4rem", textAlign: "center" }}
          />
          <button onClick={handleNext}>Next</button>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <strong>Language:</strong>{" "}
          <button onClick={() => setLanguage("sub")} disabled={language === "sub"}>
            Sub
          </button>
          <button onClick={() => setLanguage("dub")} disabled={language === "dub"}>
            Dub
          </button>

          <br />
          <br />

          <strong>Server:</strong>{" "}
          <button onClick={() => setServer("vidsrc")} disabled={server === "vidsrc"}>
            Vidsrc
          </button>
          <button
            onClick={() => setServer("vidsrc.icu")}
            disabled={server === "vidsrc.icu"}
          >
            Vidsrc.ICU
          </button>
          <button
            onClick={() => setServer("hianimez")}
            disabled={server === "hianimez"}
          >
            Hianimez
          </button>
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
