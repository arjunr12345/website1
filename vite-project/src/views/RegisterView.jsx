import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Header from "../components/Header.jsx"
import Footer from "../components/Footer.jsx"

const RegisterView = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName]   = useState("")
    const [email, setEmail]         = useState("")
    const [pass1, setPass1]         = useState("")
    const [pass2, setPass2]         = useState("")
    const navigate                  = useNavigate()

    const checkPass = (e) => {
        e.preventDefault()
        if (pass1 !== pass2) {
            alert("Passwords don't match!")
            return
        }
        const users = JSON.parse(localStorage.getItem("users") || "{}")
        if (users[email]) {
            alert("That email is already registered!")
            return
        }
        users[email] = { firstName, lastName, password: pass1 }
        localStorage.setItem("users", JSON.stringify(users))
        alert("Registration successful! Please log in.")
        navigate("/login")
    }

    return (
        <div>
            <Header />
            <div className="form-container">
                <form onSubmit={(e) => checkPass(e)}>
                    <label>First Name:</label>
                    <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <label>Last Name:</label>
                    <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <label>Email:</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Password:</label>
                    <input
                        type="password"
                        value={pass1}
                        onChange={(e) => setPass1(e.target.value)}
                        required
                    />
                    <label>Re-enter Password:</label>
                    <input
                        type="password"
                        value={pass2}
                        onChange={(e) => setPass2(e.target.value)}
                        required
                    />
                    <input type="submit" value={"Sign Up"} required />
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default RegisterView
