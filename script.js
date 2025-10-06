// Save registration data
function registerUser() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    if (!username || !password) {
        alert("Please enter both username and password");
        return;
    }

        window.dataLayer = window.dataLayer || [];
        console.log(username);
dataLayer.push({
  'event': 'register',
  'username': username,
});

    localStorage.setItem('user_' + username, password);
    alert("Registration successful!");
    window.location.href = "login.html";
}

// Login user
function loginUser() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const storedPassword = localStorage.getItem('user_' + username);
    window.dataLayer = window.dataLayer || [];

    if (storedPassword && storedPassword === password) {
        
        window.dataLayer.push({
        'event': 'login1',
        'username': username
        });
        sessionStorage.setItem('loggedInUser', username);
        alert("Login successful!");
        // window.location.href = "index.html";
        

    } else {
        alert("Invalid credentials");
    }
}


// Logout user
function logoutUser() {
    sessionStorage.removeItem('loggedInUser');
    alert("Logged out successfully!");
    window.location.href = "login.html";
}

// Check login status
function checkLogin() {
    const user = sessionStorage.getItem('loggedInUser');
    if (!user) {
        window.location.href = "login.html";
    }
}

// Add to cart
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Product added to cart!");
}

// Display products
function loadProducts() {
    checkLogin();
    const products = [
        {id: 1, name: "T-Shirt", price: 10},
        {id: 2, name: "Jeans", price: 20},
        {id: 3, name: "Sneakers", price: 30}
    ];

    const container = document.getElementById('productList');
    products.forEach(p => {
        const div = document.createElement('div');
        div.className = "product";
        div.innerHTML = `<h3>${p.name}</h3><p>Price: $${p.price}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>`;
        container.appendChild(div);
    });
}