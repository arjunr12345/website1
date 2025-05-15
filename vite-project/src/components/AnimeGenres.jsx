import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Genres.css";

const AnimeGenres = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  useEffect(() => {
    const cached = localStorage.getItem("animeGenres");
    if (cached) {
      setGenres(JSON.parse(cached));
      setLoading(false);
    } else {
      fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `query { GenreCollection }`,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          const genreList = data?.data?.GenreCollection || [];
          const filtered = genreList.filter(
            (g) => typeof g === "string" && g.toLowerCase() !== "hentai"
          );
          setGenres(filtered);
          localStorage.setItem("animeGenres", JSON.stringify(filtered));
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch genres:", err);
          setLoading(false);
        });
    }
  }, []);

  if (loading) return <p>Loading genres...</p>;

  return (
    <div className="genres">
      {genres.map((genre) => (
        <a key={genre} href={`/anime/genre/${genre}`}>
          {genre}
        </a>
      ))}
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default AnimeGenres;
