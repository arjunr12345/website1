import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const current = localStorage.getItem("currentUser");
    if (current) {
      try {
        const parsed = JSON.parse(current);
        setUser(parsed);
      } catch (e) {
        setUser({ firstName: current });
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput("");
    }
  };

  return (
    <header className="header">
      <NavLink to="/" className="logo-text">Dolor™ Stream</NavLink>

      <nav className="nav-toggle">
        <NavLink to={user ? "/movies" : "/login"} className={({ isActive }) => isActive && user ? "tab active" : "tab"}>Movies</NavLink>
        <NavLink to={user ? "/tv" : "/login"} className={({ isActive }) => isActive && user ? "tab active" : "tab"}>TV Shows</NavLink>
        <NavLink to={user ? "/anime" : "/login"} className={({ isActive }) => isActive && user ? "tab active" : "tab"}>Anime</NavLink>
      </nav>

      {user && (
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search movies, TV or anime"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      )}

      <div className="navbar-container">
        {user ? (
          <>
            <span className="welcome">{user.firstName}</span>
            <button onClick={logout} className="logout-button">Log Out</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="auth-link">Log In</NavLink>
            <NavLink to="/register" className="auth-link">Register</NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
