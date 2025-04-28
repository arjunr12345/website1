import { useState } from "react"
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx"
import Footer from "../components/Footer.jsx"

const RegisterView = () => {
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");
    const navigate = useNavigate();

    const checkPass = (e) => {
        e.preventDefault();
        if (pass1 == pass2) {
            navigate("/");
        } else {
            alert("Passwords don't match!");
        }
    }

    return (
        <div>
            <Header />
            <div className="form-container">
                <form onSubmit={(e) => checkPass(e)}>
                    <label>First Name:</label>
                    <input type="text" required />
                    <label>Last Name:</label>
                    <input type="text" required />
                    <label>Email:</label>
                    <input type="email" required />
                    <label>Password:</label>
                    <input type="password" value={pass1} onChange={(event) => { setPass1(event.target.value) }} required />
                    <label>Re-enter Password:</label>
                    <input type="password" value={pass2} onChange={(event) => { setPass2(event.target.value) }} required />
                    <input type="submit" value={"Sign Up"} required />
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default RegisterView;