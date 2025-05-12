import HomeView from "./views/HomeView.jsx";
import LoginView from "./views/LoginView.jsx";
import RegisterView from "./views/RegisterView.jsx";
import MoviesView from "./views/MoviesView.jsx";
import GenreView from "./views/GenreView.jsx";
import DetailView from "./views/DetailView.jsx";
import TvList from "./views/TvList.jsx";
import TvDetail from "./views/TvDetail.jsx";
import TvGenreView from "./views/tvgenreview.jsx";
import AnimeView from "./views/AnimeView.jsx";
import AnimeGenreView from "./views/AnimeGenreView.jsx";
import AnimeDetail from "./views/AnimeDetail.jsx";
import ErrorView from "./views/ErrorView.jsx";
import SearchView from "./views/SearchView.jsx";  // Import SearchView
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />

        {/* Movies section */}
        <Route path="/movies" element={<MoviesView />}>
          <Route path="genre/:genre_id" element={<GenreView />} />
          <Route path="details/:id" element={<DetailView />} />
        </Route>

        {/* TV section */}
        <Route path="/tv" element={<TvList />}>
          <Route path="genre/:genre_id" element={<TvGenreView />} />
          <Route path=":id" element={<TvDetail />} />
        </Route>

        {/* Anime section */}
        <Route path="/anime" element={<AnimeView />}>
          <Route path="genre/:genre" element={<AnimeGenreView />} />
          <Route path="details/:anime_id" element={<AnimeDetail />} />
        </Route>

        {/* Search section */}
        <Route path="/search" element={<SearchView />} /> {/* Add route for SearchView */}

        {/* Catch-all error page */}
        <Route path="*" element={<ErrorView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
