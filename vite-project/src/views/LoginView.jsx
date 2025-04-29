import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const LoginView = () => {
   const [email, setEmail] = useState("");
   const [pass, setPass] = useState("");
   const navigate = useNavigate();

   const login = (e) => {
      e.preventDefault();

      const users = JSON.parse(localStorage.getItem("users") || "{}");
      const savedPass = users[email];

      if (savedPass && savedPass === pass) {
         localStorage.setItem("currentUser", email);
         navigate("/movies");
      } else {
         alert("Invalid email or password!");
      }
   };

   return (
      <div>
         <Header />
         <div className="form-container">
            <h2>Log In</h2>
            <form onSubmit={login}>
               <label htmlFor="email">Email:</label>
               <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
               />

               <label htmlFor="password">Password:</label>
               <input
                  type="password"
                  name="password"
                  required
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
               />

               <input type="submit" value="Log In" />
            </form>
         </div>
         <Footer />
      </div>
   );
};

export default LoginView;
