import logo from "../assets/321.png";
import "./Header.css"

const Header = () => {
    return (
        <div className="header">
            <a href="/">
                <img src={logo} alt="321 Movies Logo" />
            </a>
            <div className="navbar-container">
                <a href="/login">Log In</a>
                <a href="/register">Sign Up</a>
            </div>
        </div>
    );
}

export default Header;