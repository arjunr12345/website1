import { useState, useEffect } from "react";
import axios from "axios"
import { useParams } from "react-router-dom";
import "./GenreView.css"

const GenreView = () => {
    const [movieData, setMovieData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [done, setDone] = useState(false);
    const params = useParams();

    const getMovies = async () => {
        const movies = await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${params.genre_id}&api_key=${import.meta.env.VITE_TMDB_KEY}`);
        setMovieData(movies.data.results);
        setTotalPages(movies.data.total_pages);
        // tmdb maxes out at 500 pages
        if (totalPages >= 500) {
            setTotalPages(500);
        }
        setDone(true);
    }

    const movePage = (x) => {
        setDone(false);
        if (page + x >= totalPages) {
            setPage(totalPages);
        } else if (page + x <= 1) {
            setPage(1);
        } else {
            setPage(page + x);
        }
        getMovies();
    }

    const setCurrentPage = (x) => {
        setDone(false);
        if (x >= totalPages) {
            setPage(totalPages);
        } else {
            setPage(x);
        }
        getMovies();
    }

    useEffect(() => {
        getMovies();
    }, [done]);

    return (
        <div className="genre-view">
            {movieData.map((movie) => (
                <a key={movie.id} href={`/movies/details/${movie.id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" />
                </a>
            ))}
            <div>
                <button type="submit" onClick={() => setCurrentPage(1)}>1</button>
                <button type="submit" onClick={() => movePage(-1)}>{"<"}</button>
                <span>{page}</span>
                <button type="submit" onClick={() => movePage(1)}>{">"}</button>
                <button type="submit" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
            </div>
        </div>
    )
}

export default GenreView;