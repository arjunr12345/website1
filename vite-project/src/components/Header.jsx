import "./Header.css"

const Header = () => {
    return (
        <div className="header">
            <a href="/">Dolor™ Stream</a>
            <div className="navbar-container">
                <a href="/login">Log In</a>
                <a href="/register">Register</a>
            </div>
        </div>
    );
}

export default Header;