/************************************************************
 * SIMPLE USER AUTH + GTM DATALAYER HOOKS
 ************************************************************/

// ----------------------------------------------------------
// Registration
// ----------------------------------------------------------
function registerUser() {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();

    if (!username || !password) {
        alert("Please enter both username and password");
        return;
    }

    // Save data in localStorage (for demo purposes only)
    localStorage.setItem('user_' + username, password);

    // Push registration event to dataLayer for GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: 'register',
        username: username
    });

    alert("Registration successful!");
    window.location.href = "login.html";
}

// ----------------------------------------------------------
// Login
// ----------------------------------------------------------
function loginUser() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const storedPassword = localStorage.getItem('user_' + username);

    if (storedPassword && storedPassword === password) {
        // Save logged in user in sessionStorage (temporary)
        sessionStorage.setItem('loggedInUser', username);

        // Flag for GTM tracking on next page
        sessionStorage.setItem('justLoggedInUser', username);

        alert("Login successful!");
        window.location.href = "index.html";
    } else {
        alert("Invalid credentials");
    }
}

// ----------------------------------------------------------
// Logout
// ----------------------------------------------------------
function logoutUser() {
    sessionStorage.removeItem('loggedInUser');
    alert("Logged out successfully!");
    window.location.href = "login.html";
}

// ----------------------------------------------------------
// Check Login Status (Protected pages only)
// ----------------------------------------------------------
function checkLogin() {
    const user = sessionStorage.getItem('loggedInUser');

    if (!user) {
        // Only redirect if NOT already on login page
        if (!window.location.pathname.endsWith('login.html')) {
            window.location.href = "login.html";
        }
    }
}

// ----------------------------------------------------------
// Track Login Event for GTM (Runs ONCE after login)
// ----------------------------------------------------------
function trackLoginEvent() {
    const loggedInUsername = sessionStorage.getItem('justLoggedInUser');
    if (loggedInUsername) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'login',
            username: loggedInUsername
        });

        console.log("Pushed 'login' event for user:", loggedInUsername);

        // Remove flag so this doesn't run again on refresh
        sessionStorage.removeItem('justLoggedInUser');
    }
}

// ----------------------------------------------------------
// Product Loading & Cart
// ----------------------------------------------------------
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Product added to cart!");
}

function loadProducts() {
    // Run login check BEFORE loading products
    checkLogin();

    const container = document.getElementById('productList');
    if (container) {
        const products = [
            { id: 1, name: "T-Shirt", price: 10 },
            { id: 2, name: "Jeans", price: 20 },
            { id: 3, name: "Sneakers", price: 30 }
        ];

        products.forEach(p => {
            const div = document.createElement('div');
            div.className = "product";
            div.innerHTML = `
                <h3>${p.name}</h3>
                <p>Price: $${p.price}</p>
                <button onclick="addToCart(${p.id})">Add to Cart</button>`;
            container.appendChild(div);
        });
    }
}

/************************************************************
 * PAGE INITIALIZERS
 * Run different code depending on which page we're on
 ************************************************************/
window.onload = function () {
    const path = window.location.pathname;

    if (path.endsWith('index.html') || path.endsWith('/')) {
        // User-facing home products page
        checkLogin();
        trackLoginEvent();  // push GTM event if just logged in
        loadProducts();

    } else if (path.endsWith('login.html')) {
        // Login page - do nothing special here except wait for form actions
        console.log("On login page – waiting for user input.");

    } else if (path.endsWith('register.html')) {
        // Registration page
        console.log("On register page – waiting for user input.");
    }
};