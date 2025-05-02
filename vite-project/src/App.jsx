import HomeView from "./views/HomeView.jsx";
import LoginView from "./views/LoginView.jsx";
import RegisterView from "./views/RegisterView.jsx";
import MoviesView from "./views/MoviesView.jsx";
import GenreView from "./views/GenreView.jsx";
import DetailView from "./views/DetailView.jsx";
import TvList from "./views/TvList.jsx";
import TvDetail from "./views/TvDetail.jsx";
import TvGenreView from "./views/tvgenreview";
import ErrorView from "./views/ErrorView.jsx";
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />

        <Route path="/movies" element={<MoviesView />}>
          <Route path="genre/:genre_id" element={<GenreView />} />
          <Route path="details/:id" element={<DetailView />} />
        </Route>

        {/* Wrap all /tv routes under TvList layout */}
        <Route path="/tv" element={<TvList />}>
          <Route path="genre/:genre_id" element={<TvGenreView />} />
          <Route path=":id" element={<TvDetail />} />
        </Route>

        <Route path="*" element={<ErrorView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
