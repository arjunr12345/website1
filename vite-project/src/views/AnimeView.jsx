import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AnimeGenres from "../components/AnimeGenres.jsx"; // or views if needed
import "./MoviesView.css";

const AnimeView = () => {
  return (
    <div>
      <Header />
      <div className="movies-view">
        <AnimeGenres />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default AnimeView;
