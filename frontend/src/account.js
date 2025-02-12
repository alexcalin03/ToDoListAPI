import './account_styles.css'; 
import { updatePassword } from './api_requests';
const API_BASE = "http://127.0.0.1:8000";


document.addEventListener("DOMContentLoaded", () => {
    const backToHome = document.getElementById("back-to-home");
    backToHome.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "index.html";
    });

    const changePasswordForm = document.getElementById("change-password-form");
    const changePasswordButton = document.getElementById("change-password-button");
    const changePasswordPopup = document.getElementById("change-password-popup");
    const changePasswordClose = document.getElementById("change-password-close");
    const popupContent = document.getElementById("popup-content");
    const username = document.getElementById("username");


    changePasswordButton.addEventListener("click", (e) => {
        e.preventDefault();
        changePasswordPopup.classList.remove("hidden");
    });

    changePasswordClose.addEventListener("click", (e) => {
        e.preventDefault();
        changePasswordPopup.classList.add("hidden");
    });

    changePasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const password = document.getElementById("old-password").value;
        const newPassword = document.getElementById("new-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (newPassword !== confirmPassword) {
            popupContent.innerText = "Passwords do not match";
            return;
        }

        const response = await updatePassword(API_BASE, password, newPassword);
        changePasswordPopup.classList.add("hidden");

    });

});