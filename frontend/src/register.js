import './register_styles.css';
import { registerUser } from "./api_requests.js";
document.addEventListener("DOMContentLoaded", () => {
     const registerForm = document.getElementById("register-form");
        const loginLink = document.getElementById("login-link");

     registerForm.addEventListener("submit", async (e) => {
         e.preventDefault();
         const username = document.getElementById("username").value;
         const password = document.getElementById("password").value;
         const email = document.getElementById("email").value;
         try {
             await registerUser(username, password, email);
             window.location.href = "login.html";
         } catch (error) {
             console.error("Error registering user", error);
             alert("Error registering user");
         }
     });

     loginLink.addEventListener("click", (e) => {
         e.preventDefault();
         window.location.href = "login.html";
     });
});