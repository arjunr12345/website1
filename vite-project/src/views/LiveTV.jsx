import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./LiveTV.css";

const playlists = [
  {
    name: "Playlist 1 (IPTV-org)",
    url: "https://iptv-org.github.io/iptv/index.m3u",
  },
  {
    name: "Playlist 2 (TVPass)",
    url: "https://tvpass.org/playlist/m3u",
  },
];

const LiveTV = () => {
  const [channels, setChannels] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0].url);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef();

  useEffect(() => {
    if (!selectedPlaylist) return;

    setChannels([]);
    setSelectedChannel(null);
    setError(null);

    fetch(selectedPlaylist)
      .then((res) => res.text())
      .then((data) => {
        const parsedChannels = parseM3U(data);
        if (parsedChannels.length === 0) {
          setError("No valid channels found.");
        } else {
          setChannels(parsedChannels);
          setSelectedChannel(parsedChannels[0].url);
        }
      })
      .catch((err) => {
        console.error("Error loading playlist:", err);
        setError("Failed to load playlist.");
      });
  }, [selectedPlaylist]);

  useEffect(() => {
    if (!selectedChannel || !videoRef.current) return;

    const streamUrl = selectedChannel;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);
      return () => hls.destroy();
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = streamUrl;
    } else {
      setError("Your browser doesn't support HLS.");
    }
  }, [selectedChannel]);

  const parseM3U = (data) => {
    const lines = data.split("\n");
    const parsed = [];

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("#EXTINF")) {
        const title = lines[i].split(",")[1]?.trim() || `Channel ${i}`;
        const url = lines[i + 1]?.trim();
        if (url?.startsWith("http")) {
          parsed.push({ title, url });
        }
      }
    }

    return parsed;
  };

  return (
    <div className="livetv-container">
      <Header />
      <h2>Live TV</h2>

      {error && <p className="error">{error}</p>}

      <div className="playlist-selector">
        <label>Select Playlist:</label>
        <select
          onChange={(e) => setSelectedPlaylist(e.target.value)}
          value={selectedPlaylist}
        >
          {playlists.map((p, index) => (
            <option key={index} value={p.url}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {channels.length > 0 && (
        <div className="channel-selector">
          <label>Select Channel:</label>
          <select
            onChange={(e) => setSelectedChannel(e.target.value)}
            value={selectedChannel || ""}
          >
            {channels.map((channel, index) => (
              <option key={index} value={channel.url}>
                {channel.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="video-player">
        <video
          ref={videoRef}
          controls
          autoPlay
          width="100%"
          height="auto"
          style={{ backgroundColor: "#111" }}
        />
      </div>

      <Footer />
    </div>
  );
};

export default LiveTV;
