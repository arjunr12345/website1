import { useNavigate } from "react-router-dom";
import "./Genres.css";

const Genres = (props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="genres">
      {props.genresList.map((genre) => (
        <a key={genre.id} href={`/movies/genre/${genre.id}`}>
          {genre.genre}
        </a>
      ))}
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Genres;
