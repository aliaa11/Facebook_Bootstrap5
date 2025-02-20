///////////////////////////////Fetch User Data//////////////////////////
async function fetchUserData(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const user = await response.json();
        return user;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

function displayUserData(user) {
    const profileName = document.getElementById("profileName");
    const profilePicture = document.querySelector(".profile-picture");
    const loginData = JSON.parse(localStorage.getItem("loginData"));
    const loggedInUserName = loginData ? loginData.name : "Unknown User";
    if (profileName) profileName.textContent = loggedInUserName;
    if (profilePicture) profilePicture.src = `https://i.pravatar.cc/250?u=${user.id}`; // Random avatar for profile picture
}

///////////////////////////////Fetch Posts/////////////////////////////
async function fetchPosts(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch posts");

        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

function displayPosts(posts) {
    const postsContainer = document.getElementById("posts-container");
    if (!postsContainer) return;

    const loginData = JSON.parse(localStorage.getItem("loginData"));
    const loggedInUserName = loginData ? loginData.name : "Unknown User";

    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('card', 'p-3', 'mt-3');
        postElement.innerHTML = `
            <div class="d-flex mb-3 justify-content-start">
                <img src="https://i.pravatar.cc/50?u=${post.userId}" alt="User Avatar" class="rounded-circle flex-1 me-3" width="50px" height="50px">
                <h6 class="flex-1 ">${loggedInUserName}</h6> 
            </div>
            <p>${post.title}</p>
            <p>${post.body}</p>
            <img src="https://picsum.photos/600/300?random=${Math.random()}" class="img-fluid rounded mb-2" alt="Post Image" onerror="this.onerror=null;this.src='https://via.placeholder.com/600';">
            <div class="d-flex position-relative">
                <button class="btn text-secondary me-2 like-btn" data-post-id="${post.id}">
                    <i class="fas fa-thumbs-up"></i> Like
                </button>
                <div class="reactions-container" id="reactions-${post.id}">
                    <span class="reaction" data-reaction="👍">👍</span>
                    <span class="reaction" data-reaction="❤️">❤️</span>
                    <span class="reaction" data-reaction="😂">😂</span>
                    <span class="reaction" data-reaction="😢">😢</span>
                    <span class="reaction" data-reaction="😡">😡</span>
                </div>
                <button class="btn text-secondary comment-btn" data-post-id="${post.id}"><i class="fas fa-comment"></i> Comment</button>
                <button class="btn text-secondary"><i class="bi bi-reply-fill"></i> Share</button>
            </div>
            <div class="comments-container mt-2" id="comments-${post.id}" style="display: none;"></div>
        `;
        postsContainer.appendChild(postElement);
    });
}
///////////////////////////////Fetch Photos/////////////////////////////
async function fetchRandomPhotos() {
    try {
        const response = await fetch(`https://picsum.photos/v2/list?page=1&limit=6`);
        if (!response.ok) throw new Error("Failed to fetch photos");

        const photos = await response.json();
        return photos;
    } catch (error) {
        console.error("Error fetching photos:", error);
        return [];
    }
}

function displayPhotos(photos) {
    const photosContainer = document.getElementById("photosContainer");
    if (!photosContainer) return;

    photosContainer.innerHTML = '';
    photos.forEach(photo => {
        const photoElement = document.createElement('div');
        photoElement.classList.add('col-md-4', 'mb-3');
        photoElement.innerHTML = `
            <img src="${photo.download_url}" alt="Random Photo" class="img-fluid rounded">
        `;
        photosContainer.appendChild(photoElement);
    });
}

///////////////////////////////Update Profile Stats/////////////////////////////
function updateProfileStats(posts) {
    const postCount = document.getElementById("postCount");
    const followerCount = document.getElementById("followerCount");
    const followingCount = document.getElementById("followingCount");

    if (postCount) postCount.textContent = posts.length;
    if (followerCount) followerCount.textContent = Math.floor(Math.random() * 1000); // Random followers
    if (followingCount) followingCount.textContent = Math.floor(Math.random() * 500); // Random following
}

///////////////////////////////Initialize Profile/////////////////////////////
async function initProfile() {
    const loginData = JSON.parse(localStorage.getItem("loginData"));
    if (loginData && loginData.id) {
        const user = await fetchUserData(loginData.id);
        if (user) {
            displayUserData(user);
            const posts = await fetchPosts(loginData.id);
            displayPosts(posts);
            updateProfileStats(posts);

            const photos = await fetchRandomPhotos();
            displayPhotos(photos);
        }
    } else {
        console.error("No login data or user ID found in localStorage");
        window.location.href = "login.html";
    }
}
document.addEventListener("DOMContentLoaded", initProfile);
/////////////////////Fetch Notifications,Messenger/////////////////////
async function fetchData(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch data");
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

export async function init() {
    const notifications = await fetchData("https://jsonplaceholder.typicode.com/users?_limit=5");
    const messages = await fetchData("https://jsonplaceholder.typicode.com/users?_limit=5");

    const notificationsList = document.getElementById("notificationsList");
    const messagesList = document.getElementById("messagesList");

    function displayNotifications(notifications) {
        notificationsList.innerHTML = ""; 

        if (notifications.length === 0) {
            notificationsList.innerHTML = "<li class='dropdown-item'>No notifications</li>";
            return;
        }

        notifications.forEach(notification => {
            const listItem = document.createElement("li");
            listItem.classList.add("dropdown-item");
            listItem.innerHTML = `
            <a href='#' class="text-decoration-none">
            <div class="d-flex align-items-center">
                    <img src="https://i.pravatar.cc/50?u=${notification.id}" alt="User Avatar" class="rounded-circle me-2" width="40" height="40">
                    <h6 class="fw-bold">${notification.name}</h6> </br>
            </div>
            <p class="text-muted">(${notification.company.catchPhrase})</p></a>
            `;
            notificationsList.appendChild(listItem);
        });
    }

    function displayMessages(messages) {
        messagesList.innerHTML = ""; 

        if (messages.length === 0) {
            messagesList.innerHTML = "<li class='dropdown-item'>No messages</li>";
            return;
        }

        messages.forEach(msg => {
            const listItem = document.createElement("li");
            listItem.classList.add("dropdown-item");
            listItem.innerHTML = `
            <a href='#' class="text-decoration-none">
                <div class="d-flex align-items-center">
                    <img src="https://i.pravatar.cc/50?u=${msg.id}" alt="User Avatar" class="rounded-circle me-2" width="40" height="40">
                    <strong>${msg.name}</strong> <span class="text-muted">(${msg.email})</span>
                </div>
                </a>
            `;
            messagesList.appendChild(listItem);
        });
    }

    displayNotifications(notifications);
    displayMessages(messages);
}

document.addEventListener("DOMContentLoaded", () => {
    init();
});
// ///////////////////////Fetch Left Side ////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
    const friendsContainer = document.getElementById("friends-suggest");
    const groupsContainer = document.getElementById("groups");
    const activeFriendsContainer = document.getElementById("active-friends");

    fetch("https://jsonplaceholder.typicode.com/users?_limit=3")
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                friendsContainer.innerHTML += `
                    <div class="card mb-2">
                        <div class="card-body">
                            <div class="content d-flex align-items-center">
                                <img src="https://i.pravatar.cc/50?img=${user.id}" alt="..." class="rounded-circle" width="50px" height="50px">
                                <h6 class="ms-3">${user.name}</h6>
                            </div>
                            <button class="btn btn-primary my-3">Visit Profile</button>
                        </div>
                    </div>`;
            });
        });

    fetch("https://jsonplaceholder.typicode.com/users?_limit=2")
        .then(response => response.json())
        .then(groups => {
            groups.forEach(group => {
                groupsContainer.innerHTML += `
                    <div class="card mb-2">
                        <div class="card-body">
                            <div class="content d-flex align-items-center">
                                <img src="https://i.pravatar.cc/50?img=${group.id}" alt="..." class="rounded-circle" width="50px" height="50px">
                                <h6 class="ms-3">${group.company.name}</h6>
                            </div>
                            <button class="btn btn-primary my-3">Join</button>
                        </div>
                    </div>`;
            });
        });

    fetch("https://jsonplaceholder.typicode.com/users?_limit=3")
        .then(response => response.json())
        .then(activeUsers => {
            activeUsers.forEach(user => {
                activeFriendsContainer.innerHTML += `
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <img src="https://i.pravatar.cc/50?img=${user.id}" alt="Friend" class="rounded-circle me-3">
                                <div>
                                    <h6 class="mb-0">${user.name}</h6>
                                    <small class="text-success">Active Now</small>
                                </div>
                            </div>
                        </div>
                    </div>`;
            });
        });
});
