import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx"
import Footer from "../components/Footer.jsx"
import Genres from "../components/Genres.jsx"
import "./MoviesView.css"

const MoviesView = () => {
    const genresList = [
        {
            genre: "Action",
            id: 28
        },
        {
            genre: "Family",
            id: 10751
        },
        {
            genre: "Science Fiction",
            id: 878
        },
        {
            genre: "Adventure",
            id: 12
        },
        {
            genre: "Fantasy",
            id: 14
        },
        {
            genre: "War",
            id: 10752
        },
        {
            genre: "Animation",
            id: 16
        },
        {
            genre: "History",
            id: 36
        },
        {
            genre: "Thriller",
            id: 53
        },
        {
            genre: "Comedy",
            id: 35
        }
    ]

    return (
        <div>
            <Header />
            <div className="movies-view">
                <Genres genresList={genresList}/>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default MoviesView;