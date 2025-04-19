import "./Genres.css"

const Genres = (props) => {
    return (
        <div className="genres">
            {props.genresList.map((genre) => (
                <a key={genre.id} href={`/movies/genre/${genre.id}`}>{genre.genre}</a>
            ))}
            <a href="/">Log Out</a>
        </div>
    )
}

export default Genres;