// ================================
// SHARMA KIRANA STORE - SCRIPT.JS
// ================================

// 1. Product Database
const products = [
    {
        id: 1,
        name: "Amul Taaza Milk",
        price: 25,
        unit: "500ml",
        imageUrl: "https://i.pinimg.com/736x/cb/16/69/cb16696e20e1f0a8298a11fab8adcacc.jpg"
    },
    {
        id: 2,
        name: "Farm Fresh Eggs",
        price: 48,
        unit: "6 pcs",
        imageUrl: "https://i.pinimg.com/736x/44/63/ed/4463ed18a381ac7edd7bf82f65ceac49.jpg"
    },
    {
        id: 3,
        name: "Brown Bread",
        price: 40,
        unit: "1 pack",
        imageUrl: "https://i.pinimg.com/736x/74/2b/85/742b85dd4ec5f0f9efb02c81f5f1b3d4.jpg"
    },
    {
        id: 4,
        name: "Bananas",
        price: 60,
        unit: "1 dozen",
        imageUrl: "https://i.pinimg.com/736x/09/55/46/095546d7b7d2dcf82f28c4b5b95f4d4f.jpg"
    },
    {
        id: 5,
        name: "Haldiram Bhujia",
        price: 110,
        unit: "400g",
        imageUrl: "https://i.pinimg.com/736x/c1/5a/7f/c15a7ff35afe99a39310ac5dab5dfcd7.jpg"
    },
    {
        id: 6,
        name: "Fresh Tomatoes",
        price: 35,
        unit: "500g",
        imageUrl: "https://i.pinimg.com/736x/54/d3/76/54d3764e0c4d67a40c4cb63f52f4f70f.jpg"
    }
];

// 2. Cart State
let cart = JSON.parse(localStorage.getItem("sharma_kirana_cart")) || [];

// ================================
// SAVE CART TO STORAGE
// ================================
function saveCart() {
    localStorage.setItem("sharma_kirana_cart", JSON.stringify(cart));
}

// ================================
// GET PRODUCT QUANTITY
// ================================
function getProductQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
}

// ================================
// RENDER PRODUCTS GRID
// ================================
function renderProducts(filteredProducts = products) {
    const productGrid = document.getElementById("product-grid");
    if (!productGrid) return;

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="col-span-2 text-center py-8 text-gray-400">
                <i class="fa-solid fa-face-frown text-3xl mb-2 block"></i>
                No items found!
            </div>`;
        return;
    }

    productGrid.innerHTML = filteredProducts.map(product => {
        const quantity = getProductQuantity(product.id);

        return `
        <div class="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm flex flex-col group transition-all hover:shadow-md">
            <div class="h-28 w-full bg-brand-gray rounded-xl overflow-hidden mb-3">
                <img src="${product.imageUrl}" 
                     alt="${product.name}"
                     class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300">
            </div>
            <div class="flex-grow">
                <h4 class="text-sm font-semibold text-gray-800 leading-tight mb-1">
                    ${product.name}
                </h4>
                <p class="text-xs text-gray-500 mb-3">
                    ${product.unit}
                </p>
            </div>
            <div class="flex items-center justify-between mt-auto">
                <span class="text-sm font-bold">
                    ₹${product.price}
                </span>
                ${
                    quantity > 0
                    ? `
                    <div class="flex items-center gap-3 bg-green-50 border border-brand-green/30 rounded-xl p-1 shadow-sm">
                        <button onclick="updateQuantity(${product.id}, -1)"
                            class="bg-brand-green text-white w-6 h-6 rounded-lg font-bold flex items-center justify-center hover:bg-green-700 active:scale-90 transition-all">
                            -
                        </button>
                        <span class="font-black text-brand-dark text-sm w-4 text-center">
                            ${quantity}
                        </span>
                        <button onclick="updateQuantity(${product.id}, 1)"
                            class="bg-brand-green text-white w-6 h-6 rounded-lg font-bold flex items-center justify-center hover:bg-green-700 active:scale-90 transition-all">
                            +
                        </button>
                    </div>
                    `
                    : `
                    <button onclick="updateQuantity(${product.id}, 1)"
                        class="bg-white border border-brand-green text-brand-green font-bold text-xs px-4 py-1.5 rounded-lg hover:bg-brand-green hover:text-white transition-all active:scale-95">
                        ADD
                    </button>
                    `
                }
            </div>
        </div>`;
    }).join("");
}

// ================================
// UPDATE QUANTITY (Both Grid and Modal)
// ================================
function updateQuantity(productId, change) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += change;
        if (existingItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
    } else if (change > 0) {
        const product = products.find(p => p.id === productId);
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    renderProducts();
    updateCartUI();

    // Live update items list in bottom sheet if open
    const modal = document.getElementById("checkout-modal");
    if (modal && !modal.classList.contains("invisible")) {
        renderModalItems();
    }
}

// ================================
// UPDATE FLOATING BOTTOM CART
// ================================
function updateCartUI() {
    const floatingCart = document.getElementById("floating-cart");
    const cartCountEl = document.getElementById("cart-count");
    const cartTotalEl = document.getElementById("cart-total");

    if (!floatingCart) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (totalItems > 0) {
        floatingCart.classList.remove("hidden");
        cartCountEl.innerText = `${totalItems} Items`;
        cartTotalEl.innerText = `₹${totalPrice}`;
    } else {
        floatingCart.classList.add("hidden");
        // If modal was open, shut it down automatically when cart goes empty
        closeCheckoutModal();
    }
}

// ================================
// RENDER CART ITEMS IN MODAL
// ================================
function renderModalItems() {
    const itemsList = document.getElementById("cart-items-list");
    const modalSubtotal = document.getElementById("modal-subtotal");
    const modalTotal = document.getElementById("modal-total");

    if (!itemsList || !modalSubtotal || !modalTotal) return;

    if (cart.length === 0) {
        itemsList.innerHTML = `<p class="text-gray-500 text-center py-6">Your basket is empty!</p>`;
        modalSubtotal.innerText = `₹0`;
        modalTotal.innerText = `₹0`;
        return;
    }

    itemsList.innerHTML = cart.map(item => `
        <div class="flex justify-between items-center border-b border-gray-100 py-3">
            <div class="flex items-center gap-3">
                <img src="${item.imageUrl}" class="w-12 h-12 rounded-lg object-cover border border-gray-100">
                <div>
                    <h4 class="font-semibold text-sm text-brand-dark">${item.name}</h4>
                    <p class="text-xs text-gray-400">₹${item.price} per ${item.unit}</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-2 py-0.5">
                    <button onclick="updateQuantity(${item.id}, -1)" class="text-brand-green font-black text-sm w-4 h-4 flex items-center justify-center">-</button>
                    <span class="font-bold text-brand-dark text-xs">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="text-brand-green font-black text-sm w-4 h-4 flex items-center justify-center">+</button>
                </div>
                <span class="font-bold text-sm text-brand-dark min-w-[50px] text-right">
                    ₹${item.quantity * item.price}
                </span>
            </div>
        </div>
    `).join("");

    const totalBill = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    modalSubtotal.innerText = `₹${totalBill}`;
    modalTotal.innerText = `₹${totalBill}`;
}

// ================================
// BOTTOM SHEET ANILMATIONS
// ================================
function openCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    const overlay = document.getElementById("modal-overlay");
    const sheet = document.getElementById("modal-sheet");

    if (!modal || !overlay || !sheet) return;

    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    renderModalItems();

    // Trigger Slide-up and Fade-in
    modal.classList.remove("invisible");
    setTimeout(() => {
        overlay.classList.remove("opacity-0");
        overlay.classList.add("opacity-100");
        sheet.classList.remove("translate-y-full");
        sheet.classList.add("translate-y-0");
    }, 10);
}

function closeCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    const overlay = document.getElementById("modal-overlay");
    const sheet = document.getElementById("modal-sheet");

    if (!modal || !overlay || !sheet) return;

    // Trigger Slide-down and Fade-out
    overlay.classList.remove("opacity-100");
    overlay.classList.add("opacity-0");
    sheet.classList.remove("translate-y-0");
    sheet.classList.add("translate-y-full");

    setTimeout(() => {
        modal.classList.add("invisible");
    }, 300); // Wait for transition animation to end
}

// ================================
// PLACE ORDER FUNCTION
// ================================
function placeOrder() {
    alert("🎉 Order Placed Successfully! Delivery partner will arrive shortly.");
    cart = [];
    saveCart();
    renderProducts();
    updateCartUI();
    closeCheckoutModal();
}

// ================================
// SEARCH SYSTEM
// ================================
const searchInput = document.getElementById("search-input");
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => {
            return product.name.toLowerCase().includes(query);
        });
        renderProducts(filteredProducts);
    });
}

// ================================
// DOM INITIALIZATION
// ================================
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCartUI();

    const viewCartBtn = document.getElementById("view-cart-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const dragHandle = document.getElementById("close-drag");
    const overlay = document.getElementById("modal-overlay");
    const placeOrderBtn = document.getElementById("place-order-btn");

    if (viewCartBtn) viewCartBtn.addEventListener("click", openCheckoutModal);
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeCheckoutModal);
    if (dragHandle) dragHandle.addEventListener("click", closeCheckoutModal);
    if (overlay) overlay.addEventListener("click", closeCheckoutModal);
    if (placeOrderBtn) placeOrderBtn.addEventListener("click", placeOrder);
});
