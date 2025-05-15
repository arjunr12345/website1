import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import GenresTV from "../components/GenresTV";
import Footer from "../components/Footer";
import "./MoviesView.css";

const tvGenresList = [
  { genre: "Action & Adventure", id: 10759 },
  { genre: "Animation", id: 16 },
  { genre: "Comedy", id: 35 },
  { genre: "Crime", id: 80 },
  { genre: "Documentary", id: 99 },
  { genre: "Drama", id: 18 },
  { genre: "Family", id: 10751 },
  { genre: "Kids", id: 10762 },
  { genre: "Mystery", id: 9648 },
  { genre: "News", id: 10763 },
  { genre: "Reality", id: 10764 },
  { genre: "Sci-Fi & Fantasy", id: 10765 },
  { genre: "Soap", id: 10766 },
  { genre: "Talk", id: 10767 },
  { genre: "War & Politics", id: 10768 },
  { genre: "Western", id: 37 }
];

export default function TvList() {
  return (
    <>
      <Header />
      <div className="movies-view">
        <GenresTV genresList={tvGenresList} />
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
