import { useNavigate } from "react-router-dom";
import "./Genres.css";

const GenresTV = (props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="genres">
      {props.genresList.map((genre) => (
        <a key={genre.id} href={`/tv/genre/${genre.id}`}>
          {genre.genre}
        </a>
      ))}
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default GenresTV;
