import React from "react";
import { useParams } from "react-router-dom";

const PlayerView = () => {
    const { videoId, tmdb, season, episode } = useParams();

    // Construct the player URL
    const baseUrl = "https://localhost:5173/se_player.php";
    const params = new URLSearchParams();
    params.append("video_id", videoId);

    if (tmdb) {
        params.append("tmdb", "1");
    }
    if (season && episode) {
        params.append("s", season);
        params.append("e", episode);
    }

    const playerUrl = `${baseUrl}?${params.toString()}`;

    return (
        <div className="player-container">
            <iframe
                src={playerUrl}
                title="Video Player"
                width="100%"
                height="600px"
                frameBorder="0"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default PlayerView;