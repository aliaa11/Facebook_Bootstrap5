///////////////////////////////Fetch Stories//////////////////////////
document.addEventListener("DOMContentLoaded", async () => {
    const storyContainer = document.querySelector(".carousel-inner");

    if (!storyContainer) {
        console.error(" Story container not found!");
        return;
    }

    const randomImage = () => `https://picsum.photos/200/300?random=${Math.random()}`;

    async function fetchStories() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users");
            if (!response.ok) throw new Error("Failed to fetch stories");

            const users = await response.json();
            return users.map(user => ({
                id: user.id,
                name: user.name,
                imageUrl: randomImage()
            }));
        } catch (error) {
            console.error(" Error fetching stories:", error);
            return [];
        }
    }

    function displayStories(stories) {
        const storyContainer = document.querySelector(".carousel-inner");
        if (!storyContainer) {
            console.error("Element .carousel-inner not found!");
            return;
        }
    
        storyContainer.innerHTML = ''; 
    
        const SizeStory = 5; 
        for (let i = 0; i < stories.length; i += SizeStory) {
            const StoryLength = stories.slice(i, i + SizeStory);
            const storySlide = document.createElement("div");
            storySlide.classList.add("carousel-item"); 
            if (i === 0) {
                storySlide.classList.add("active"); 
            }
            storySlide.innerHTML = `
                <div class="d-flex flex-nowrap ">
                    ${StoryLength.map(story => `
                        <div class="card me-1 story-card">
                            <img src="${story.imageUrl}" class="d-block w-100 rounded story-image" alt="${story.name}" 
                            onerror="this.onerror=null;this.src='https://via.placeholder.com/200x300';">
                            <p class="text-center mt-2 small story-text">${story.name}</p>
                        </div>
                    `).join("")}
                </div>
            `;
            storyContainer.appendChild(storySlide);
        }
    
        const carouselElement = document.getElementById("storyCarousel");
        if (carouselElement) {
            new bootstrap.Carousel(carouselElement, {
                interval: false,
                ride: false
            });
        } else {
            console.error("Element #storyCarousel not found!");
        }
    }
    

    async function initStories() {
        const stories = await fetchStories();
        displayStories(stories);
    }

    initStories();
});

///////////////////////////////Fetch Posts/////////////////////////////
document.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.getElementById("posts-container");
    const paginationContainer = document.getElementById("pagination-container");

    if (!postsContainer || !paginationContainer) {
        console.error(" Elements .posts-container or .pagination not found!");
        return;
    }

    let currentPage = 1;
    const postsPerPage = 5;

    const randomImage = () => `https://picsum.photos/600/300?random=${Math.random()}`;

    async function fetchPosts(page) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${postsPerPage}`);
            if (!response.ok) throw new Error("Failed to fetch posts");

            const posts = await response.json();

            const postsWithImages = posts.map(post => ({
                ...post,
                imageUrl: randomImage()
            }));

            return postsWithImages;
        } catch (error) {
            console.error(" Error fetching posts:", error);
            return [];
        }
    }

    function displayPosts(posts) {
        postsContainer.innerHTML = ''; 
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('card', 'p-3', 'mt-3');
            postElement.innerHTML = `
                <div class="d-flex mb-3 justify-content-start">
                <img src="${post.imageUrl}" alt="Post Image" class="rounded-circle flex-1 me-3" width="50px" height="50px">
                <h6 class="flex-1 ">User ${post.userId}</h6>
                </div>
                <p>${post.title}</p>
                <p>${post.body}</p>
                <img src="${post.imageUrl}" class="img-fluid rounded mb-2" alt="Post Image" onerror="this.onerror=null;this.src='https://via.placeholder.com/600';">
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
        document.querySelectorAll('.comment-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const postId = event.target.getAttribute('data-post-id');
                const commentsContainer = document.getElementById(`comments-${postId}`);

                if (commentsContainer.style.display === "none") {
                    const comments = await fetchComments(postId);
                    displayComments(comments, commentsContainer);
                    commentsContainer.style.display = "block";
                } else {
                    commentsContainer.style.display = "none";
                }
            });
        });
        document.querySelectorAll('.like-btn').forEach(button => {
            button.addEventListener('click', function () {
                const postId = this.getAttribute('data-post-id');
                const reactionsContainer = document.getElementById(`reactions-${postId}`);
    
                reactionsContainer.style.display = reactionsContainer.style.display === "block" ? "none" : "block";
            });
        });
    
        document.querySelectorAll('.reaction').forEach(reaction => {
            reaction.addEventListener('click', function () {
                const selectedReaction = this.getAttribute('data-reaction');
                const postId = this.closest('.reactions-container').id.split('-')[1];
                const likeButton = document.querySelector(`.like-btn[data-post-id="${postId}"]`);
    
                likeButton.innerHTML = `${selectedReaction} Like`;
    
                document.getElementById(`reactions-${postId}`).style.display = "none";
            });
        });
    
        document.addEventListener('click', function (event) {
            if (!event.target.closest('.like-btn') && !event.target.closest('.reactions-container')) {
                document.querySelectorAll('.reactions-container').forEach(container => {
                    container.style.display = 'none';
                });
            }
        });
    }

    async function fetchComments(postId) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
            if (!response.ok) throw new Error("Failed to fetch comments");

            const comments = await response.json();
            return comments;
        } catch (error) {
            console.error(`Error fetching comments for post ${postId}:`, error);
            return [];
        }
    }
    function displayComments(comments, container) {
        container.innerHTML = ''; 
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('p-2', 'border-bottom');
    
            const randomAvatar = `https://i.pravatar.cc/50?u=${comment.email}`;
    
            commentElement.innerHTML = `
                <div class="card p-3">
                    <div class="d-flex mb-3 align-items-center">
                        <img src="${randomAvatar}" alt="User Avatar" class="rounded-circle me-3" width="50px" height="50px">
                        <h6 class="m-0"><strong>${comment.name}</strong></h6>
                    </div>
                    <p class="mb-1">${comment.body}</p>
                </div>
            `;
            container.appendChild(commentElement);
        });
    }
    
    function displayPagination(totalPages) {
        const paginationContainer = document.getElementById("pagination-container");
        paginationContainer.innerHTML = '';
        
        const controlsContainer = document.createElement("div");
        controlsContainer.classList.add("d-flex", "justify-content-center", "mt-3");
        
        const prevButton = document.createElement("button");
        prevButton.textContent = "Previous";
        prevButton.classList.add("btn", "btn-primary", "me-2");
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener("click", async () => {
            if (currentPage > 1) {
                currentPage--;
                const posts = await fetchPosts(currentPage);
                displayPosts(posts);
                displayPagination(totalPages);
            }
        });
        
        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.classList.add("btn", "btn-primary");
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener("click", async () => {
            if (currentPage < totalPages) {
                currentPage++;
                const posts = await fetchPosts(currentPage);
                displayPosts(posts);
                displayPagination(totalPages);
            }
        });
        
        controlsContainer.appendChild(prevButton);
        controlsContainer.appendChild(nextButton);
        paginationContainer.appendChild(controlsContainer);
    }
    
    function updateProfileName() {
                const loginData = JSON.parse(localStorage.getItem('loginData'));
                if (loginData && profileLink) {
                    profileLink.textContent = loginData.name;
                }
    }
    async function init() {
        try {
            const totalPostsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
            const totalPosts = await totalPostsResponse.json();
            const totalPages = Math.ceil(totalPosts.length / postsPerPage);

            const initialPosts = await fetchPosts(1);
            displayPosts(initialPosts);
            displayPagination(totalPages);
            updateProfileName();
        } catch (error) {
            console.error(" Error initializing posts:", error);
        }
    }

    init();
});
///////////////////////Fetch Left Side ////////////////////////////////
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
                            <button class="btn btn-primary my-3">Add Friend</button>
                            <button class="btn btn-outline-primary my-3">Delete</button>
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