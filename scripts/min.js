
import { initAuth } from './auth.js';
import { init } from './posts.js';

document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn || isLoggedIn !== "true") {
        window.location.href = "../login.html";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const icons = document.querySelectorAll(".nav-item-icon");

    icons.forEach(icon => {
        icon.addEventListener("click", function () {
            icons.forEach(i => i.classList.remove("active"));

            this.classList.add("active");
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    initAuth();
    init();

});
