
import { initAuth } from './auth.js';
import { init } from './posts.js';

document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn || isLoggedIn !== "true") {
        window.location.href = "login.html";
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
const basePath = window.location.pathname.includes("repository-name") 
    ? "/Facebook_Bootstrap5/" 
    : "/";
document.querySelectorAll("a").forEach(link => {
    if (link.getAttribute("href") && !link.getAttribute("href").startsWith("http")) {
        link.href = basePath + link.getAttribute("href");
    }
});
