export function login() {
    const logEmail = document.getElementById("email");
    const logPass = document.getElementById("password");
    const loginBtn = document.getElementById("loginBtn");
    const emailError = document.getElementById("emailValid");
    const passwordError = document.getElementById("passValid");

    if (loginBtn) {
        loginBtn.addEventListener("click", function (event) {
            event.preventDefault();

            const email = logEmail.value;
            const password = logPass.value;
            let isValid = true;

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!email || !emailRegex.test(email)) {
                emailError.textContent = "Please enter a valid email address";
                emailError.classList.remove("d-none");
                isValid = false;
            } else {
                emailError.classList.add("d-none");
            }

            if (!password || password.length < 8) {
                passwordError.textContent = "Password should be at least 8 characters long";
                passwordError.classList.remove("d-none");
                isValid = false;
            } else {
                passwordError.classList.add("d-none");
            }

            if (isValid) {
                const users = JSON.parse(localStorage.getItem("users")) || [];
                const user = users.find(user => user.email === email && user.password === password);

                if (user) {
                    localStorage.setItem("loginData", JSON.stringify(user));
                    window.location.href = "../pages/index.html";
                } else {
                    alert("Invalid email or password");
                }
            }
        });
    }
}
export function signUp() {
    const signUpBtn = document.getElementById("signUpBtn");
    const signUpEmail = document.getElementById("signUpEmail");
    const signUpPassword = document.getElementById("signUpPassword");
    const signUpConfirmPassword = document.getElementById("signUpConfirmPassword");
    const signUpName = document.getElementById("username");

    const emailError = document.getElementById("signUpEmailError");
    const nameError = document.getElementById("signUpNameError");
    const passwordError = document.getElementById("signUpPasswordError");
    const confirmPasswordError = document.getElementById("signUpConfirmPasswordError");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (signUpBtn) {
        signUpBtn.addEventListener("click", function (event) {
            event.preventDefault();
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const email = signUpEmail.value;
            const password = signUpPassword.value;
            const confirmPassword = signUpConfirmPassword.value;
            const name = signUpName.value;
            let isValid = true;

            if (!email || !emailRegex.test(email)) {
                emailError.textContent = "Please enter a valid email";
                emailError.classList.remove("d-none");
                isValid = false;
            } else if (users.some(user => user.email === email)) {
                emailError.textContent = "This email is already registered";
                emailError.classList.remove("d-none");
                isValid = false;
            } else {
                emailError.classList.add("d-none");
            }

            if (!name || name.length < 3) {
                nameError.textContent = "Name must be at least 3 characters";
                nameError.classList.remove("d-none");
                isValid = false;
            } else {
                nameError.classList.add("d-none");
            }

            if (!password || password.length < 8) {
                passwordError.textContent = "Password must be at least 8 characters";
                passwordError.classList.remove("d-none");
                isValid = false;
            } else {
                passwordError.classList.add("d-none");
            }

            if (password !== confirmPassword) {
                confirmPasswordError.textContent = "Passwords do not match";
                confirmPasswordError.classList.remove("d-none");
                isValid = false;
            } else {
                confirmPasswordError.classList.add("d-none");
            }

            if (isValid) {
                const newUser = { id: users.length + 1, email, password, name }; // Add unique ID
                users.push(newUser);
                localStorage.setItem("users", JSON.stringify(users));
                window.location.href = "../pages/login.html";
            }
        });
    }
}

export function logout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem("loginData");
            window.location.href = "../pages/login.html";
        });
    }
}

function updateProfileName() {
    const loginData = JSON.parse(localStorage.getItem("loginData"));
    const profileLink = document.getElementById("profileLink");
    if (loginData && profileLink) {
        profileLink.textContent = loginData.name;
        profileLink.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "../pages/profile_with_photos_and_posts.html";
        });
    }
}

export function initAuth() {
    login();
    signUp();
    logout();
    updateProfileName();
}

document.addEventListener("DOMContentLoaded", initAuth);