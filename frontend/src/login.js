import './login_styles.css';
import { loginUser } from "./api_requests.js";
import { logoutUser } from "./api_requests.js";
document.addEventListener("DOMContentLoaded", () => {
     const loginForm = document.getElementById("login-form");
     const registerLink = document.getElementById("register-link");

     loginForm.addEventListener("submit", async (e) => {
         e.preventDefault();
         const username = document.getElementById("username").value;
         const password = document.getElementById("password").value;
         try {
                await loginUser(username, password);
             window.location.href = "index.html";
         } catch (error) {
             console.error("Error logging in user", error);
             alert("Error logging in user");
         }
     });

     registerLink.addEventListener("click", (e) => {
        e.preventDefault();
         window.location.href = "register.html";
     });
});
