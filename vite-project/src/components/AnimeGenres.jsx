import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Genres.css";

const AnimeGenres = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  useEffect(() => {
    fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query { GenreCollection }`,
      }),
    })
      .then(res => res.json())
      .then(data => {
        const genreList = data?.data?.GenreCollection || [];
        const filtered = genreList.filter(g => typeof g === "string" && g.toLowerCase() !== "hentai");
        setGenres(filtered);
      })
      .catch((err) => console.error("Failed to fetch genres:", err));
  }, []);

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
