// Initial Menu Data
const menuData = [
    {
        id: "m1",
        name: "Butter Chicken",
        category: "non-veg",
        price: 350,
        rating: 4.8,
        ratingCount: "1.2K",
        bestseller: true,
        description: "Boneless chicken tikka cooked in a smooth, rich tomato and creamy gravy.",
        image: "butter_chicken.png"
    },
    {
        id: "m2",
        name: "Paneer Tikka Masala",
        category: "veg",
        price: 290,
        rating: 4.6,
        ratingCount: "850",
        bestseller: true,
        description: "Cubes of marinated paneer grilled and simmered in a spiced onion-tomato gravy.",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "m3",
        name: "Chicken Dum Biryani",
        category: "non-veg",
        price: 420,
        rating: 4.9,
        ratingCount: "2K",
        bestseller: true,
        description: "Aromatic basmati rice cooked with tender marinated chicken and exotic Indian spices.",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "m4",
        name: "Dal Makhani",
        category: "veg",
        price: 260,
        rating: 4.5,
        ratingCount: "640",
        bestseller: false,
        description: "Black lentils slow-cooked overnight with tomatoes, cream and butter.",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "m5",
        name: "Mutton Rogan Josh",
        category: "non-veg",
        price: 520,
        rating: 4.7,
        ratingCount: "430",
        bestseller: false,
        description: "Classic Kashmiri dish of tender lamb pieces cooked in a rich, warm, robust gravy.",
        image: "https://images.unsplash.com/photo-1627042633145-b780d842bac7?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "m6",
        name: "Garlic Butter Naan",
        category: "veg",
        price: 80,
        rating: 4.8,
        ratingCount: "3K",
        bestseller: true,
        description: "Soft Indian flatbread topped with minced garlic and brushed with melting butter.",
        image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "m7",
        name: "Palak Paneer",
        category: "veg",
        price: 310,
        rating: 4.4,
        ratingCount: "512",
        bestseller: false,
        description: "Fresh spinach puree cooked with cottage cheese cubes and mild spices.",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "m8",
        name: "Tandoori Chicken (Half)",
        category: "non-veg",
        price: 360,
        rating: 4.6,
        ratingCount: "920",
        bestseller: false,
        description: "Chicken marinated in yogurt and spices, roasted perfectly in a traditional clay oven.",
        image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=400&auto=format&fit=crop"
    }
];

// App State
let cart = JSON.parse(localStorage.getItem("restaurant_cart")) || {};
let currentSearch = "";
let currentFilter = "all";

// Elements
const domNameElements = document.querySelectorAll(".dynamic-name");
const editNameBtn = document.getElementById("edit-name-btn");
const nameInput = document.getElementById("name-input");
const saveNameBtn = document.getElementById("save-name-btn");
const editNameContainer = document.getElementById("edit-name-container");
const menuContainer = document.getElementById("menu-container");
const popularContainer = document.getElementById("popular-container");
const searchInputs = [document.getElementById("search-input"), document.getElementById("mobile-search-input")];
const filterRadios = document.querySelectorAll("input[name='diet']");
const noResults = document.getElementById("no-results");

// Cart Elements
const cartSidebar = document.getElementById("cart-sidebar");
const overlay = document.getElementById("overlay");
const cartItemsContainer = document.getElementById("cart-items");
const cartCountElements = document.getElementById("cart-count");
const billDetails = document.getElementById("bill-details");
const itemTotalEl = document.getElementById("item-total");
const grandTotalEl = document.getElementById("grand-total");
const checkoutBtn = document.getElementById("checkout-btn");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    loadRestaurantName();
    renderPopularDishes();
    renderMenu();
    updateCartUI();
    
    // Attach event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Dynamic Name Edit
    editNameBtn.addEventListener("click", () => {
        editNameBtn.classList.add("hidden");
        document.getElementById("restaurant-name").classList.add("hidden");
        editNameContainer.classList.remove("hidden");
        nameInput.value = localStorage.getItem("restaurant_name") || "Dynamic Restaurant";
        nameInput.focus();
    });

    saveNameBtn.addEventListener("click", saveRestaurantName);
    nameInput.addEventListener("keyup", (e) => {
        if(e.key === "Enter") saveRestaurantName();
    });

    // Search
    searchInputs.forEach(input => {
        if(input) {
            input.addEventListener("input", (e) => {
                currentSearch = e.target.value.toLowerCase();
                // sync both inputs if present
                searchInputs.forEach(inp => { if(inp) inp.value = e.target.value; });
                renderMenu();
            });
        }
    });

    // Filters
    filterRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            currentFilter = e.target.value;
            renderMenu();
        });
    });
}

// Name Management
function loadRestaurantName() {
    const savedName = localStorage.getItem("restaurant_name") || "The Indian Spice";
    domNameElements.forEach(el => el.textContent = savedName);
}

function saveRestaurantName() {
    const newName = nameInput.value.trim() || "The Indian Spice";
    localStorage.setItem("restaurant_name", newName);
    loadRestaurantName();
    
    editNameContainer.classList.add("hidden");
    document.getElementById("restaurant-name").classList.remove("hidden");
    editNameBtn.classList.remove("hidden");
}

// Menu Rendering
function renderPopularDishes() {
    popularContainer.innerHTML = "";
    // Get top rated items
    const popularItems = menuData.filter(item => item.rating >= 4.7 && item.bestseller);
    
    popularItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "popular-card";
        card.onclick = () => {
            document.getElementById("menu").scrollIntoView();
            // Optional: highlight the item in the menu
        };
        
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="popular-img" loading="lazy">
            <div class="popular-info">
                <div class="popular-title">${item.name}</div>
                <div style="color: var(--text-light); font-size: 0.9rem;">₹${item.price}</div>
            </div>
        `;
        popularContainer.appendChild(card);
    });
}

function renderMenu() {
    menuContainer.innerHTML = "";
    
    // Filter & Search Logic
    let filteredMenu = menuData.filter(item => {
        const matchesFilter = currentFilter === "all" || item.category === currentFilter;
        const matchesSearch = item.name.toLowerCase().includes(currentSearch) || item.category.includes(currentSearch);
        return matchesFilter && matchesSearch;
    });

    if (filteredMenu.length === 0) {
        noResults.classList.remove("hidden");
    } else {
        noResults.classList.add("hidden");
        
        filteredMenu.forEach(item => {
            const card = document.createElement("div");
            card.className = "dish-card";
            
            // Render quantity controls if item in cart, else Add button
            const qtyInCart = cart[item.id] ? cart[item.id].quantity : 0;
            let actionBtnHtml = "";
            
            if (qtyInCart > 0) {
                actionBtnHtml = `
                    <div class="qty-controls">
                        <button onclick="updateCartItem('${item.id}', -1)">-</button>
                        <span>${qtyInCart}</span>
                        <button onclick="updateCartItem('${item.id}', 1)">+</button>
                    </div>
                `;
            } else {
                actionBtnHtml = `
                    <button class="add-btn" onclick="updateCartItem('${item.id}', 1)">ADD</button>
                `;
            }

            card.innerHTML = `
                <div class="dish-details">
                    <div class="dish-header">
                        <span class="diet-icon ${item.category}"></span>
                        ${item.bestseller ? '<span class="bestseller-tag">Bestseller</span>' : ''}
                    </div>
                    <h3 class="dish-title">${item.name}</h3>
                    <div class="dish-price">₹${item.price}</div>
                    <div class="dish-rating">
                        <i class="fas fa-star"></i> ${item.rating} <span class="rating-count">(${item.ratingCount})</span>
                    </div>
                    <p class="dish-desc">${item.description}</p>
                </div>
                <div class="dish-image-container">
                    <img src="${item.image}" alt="${item.name}" class="dish-image" loading="lazy">
                    ${actionBtnHtml}
                </div>
            `;
            menuContainer.appendChild(card);
        });
    }
}

// Cart System
function toggleCart() {
    cartSidebar.classList.toggle("active");
    overlay.classList.toggle("active");
}

overlay.addEventListener("click", toggleCart);

function updateCartItem(id, change) {
    if (!cart[id]) {
        if (change > 0) {
            cart[id] = { ...menuData.find(i => i.id === id), quantity: 1 };
            showToast(`Added ${cart[id].name} to cart`);
        }
    } else {
        cart[id].quantity += change;
        if (cart[id].quantity <= 0) {
            delete cart[id];
        }
    }
    
    // Save to local storage
    localStorage.setItem("restaurant_cart", JSON.stringify(cart));
    
    // Re-render UI components
    renderMenu();
    updateCartUI();
}

function updateCartUI() {
    const items = Object.values(cart);
    
    // Update count badge
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.textContent = totalQty;
    
    if (items.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-msg">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-3613108-3020773.png" alt="Empty Cart">
                <p>Your cart is empty. Add some delicious food!</p>
            </div>
        `;
        billDetails.classList.add("hidden");
        checkoutBtn.classList.add("disabled");
        checkoutBtn.textContent = "Checkout";
        return;
    }
    
    // Render list
    cartItemsContainer.innerHTML = "";
    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <span class="diet-icon ${item.category}"></span>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">₹${item.price}</div>
            </div>
            <div class="cart-item-qty">
                <button onclick="updateCartItem('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartItem('${item.id}', 1)">+</button>
            </div>
            <div class="item-total">₹${item.price * item.quantity}</div>
        `;
        cartItemsContainer.appendChild(div);
    });
    
    // Update Bill
    const itemTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    itemTotalEl.textContent = `₹${itemTotal}`;
    
    const deliveryFee = 40;
    const grandTotal = itemTotal + deliveryFee;
    grandTotalEl.textContent = `₹${grandTotal}`;
    
    billDetails.classList.remove("hidden");
    checkoutBtn.classList.remove("disabled");
    checkoutBtn.textContent = `Checkout • ₹${grandTotal}`;
}

// Checkout & Modals
function checkout() {
    if (Object.keys(cart).length === 0) return;
    
    toggleCart(); // close sidebar
    document.getElementById("success-modal").classList.add("active");
    
    // Clear cart
    cart = {};
    localStorage.setItem("restaurant_cart", JSON.stringify(cart));
    updateCartUI();
    renderMenu();
}

function closeSuccessModal() {
    document.getElementById("success-modal").classList.remove("active");
}

// Toasts
function showToast(message) {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        if(toastContainer.contains(toast)) {
            toast.remove();
        }
    }, 3000);
}
