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
// SAVE CART
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
// RENDER PRODUCTS
// ================================
function renderProducts(filteredProducts = products) {

    const productGrid = document.getElementById("product-grid");

    if (!productGrid) return;

    productGrid.innerHTML = filteredProducts.map(product => {

        const quantity = getProductQuantity(product.id);

        return `
        <div class="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm flex flex-col group">

            <div class="h-28 w-full bg-brand-gray rounded-xl overflow-hidden mb-3">
                <img src="${product.imageUrl}" 
                     alt="${product.name}"
                     class="h-full w-full object-cover">
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
                    ?
                    `
                    <div class="flex items-center gap-2 bg-green-100 rounded-lg px-2 py-1">

                        <button onclick="updateQuantity(${product.id}, -1)"
                            class="bg-green-600 text-white w-6 h-6 rounded">
                            -
                        </button>

                        <span class="font-bold">
                            ${quantity}
                        </span>

                        <button onclick="updateQuantity(${product.id}, 1)"
                            class="bg-green-600 text-white w-6 h-6 rounded">
                            +
                        </button>

                    </div>
                    `
                    :
                    `
                    <button onclick="updateQuantity(${product.id}, 1)"
                        class="bg-brand-gray border border-brand-green text-brand-green font-bold text-sm px-4 py-1.5 rounded-lg hover:bg-brand-green hover:text-white transition">

                        ADD

                    </button>
                    `
                }

            </div>

        </div>
        `;

    }).join("");
}

// ================================
// UPDATE QUANTITY
// ================================
function updateQuantity(productId, change) {

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {

        existingItem.quantity += change;

        // Remove if quantity becomes 0
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
}

// ================================
// UPDATE FLOATING CART
// ================================
function updateCartUI() {

    const floatingCart = document.getElementById("floating-cart");
    const cartCountEl = document.getElementById("cart-count");
    const cartTotalEl = document.getElementById("cart-total");

    if (!floatingCart) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = cart.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    if (totalItems > 0) {

        floatingCart.classList.remove("hidden");

        cartCountEl.innerText = `${totalItems} Items`;

        cartTotalEl.innerText = `₹${totalPrice}`;

    } else {

        floatingCart.classList.add("hidden");
    }
}

// ================================
// SEARCH FUNCTIONALITY
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
// CHECKOUT MODAL
// ================================
function openCheckoutModal() {

    const modal = document.getElementById("checkout-modal");

    const checkoutItems = document.getElementById("checkout-items");

    const checkoutTotal = document.getElementById("checkout-total");

    if (!modal || !checkoutItems || !checkoutTotal) return;

    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    checkoutItems.innerHTML = cart.map(item => `
        <div class="flex justify-between items-center border-b py-2">

            <div>
                <h4 class="font-semibold">${item.name}</h4>
                <p class="text-sm text-gray-500">
                    ${item.quantity} x ₹${item.price}
                </p>
            </div>

            <span class="font-bold">
                ₹${item.quantity * item.price}
            </span>

        </div>
    `).join("");

    const totalBill = cart.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    checkoutTotal.innerText = `₹${totalBill}`;

    modal.classList.remove("hidden");
}

// ================================
// CLOSE MODAL
// ================================
function closeCheckoutModal() {

    const modal = document.getElementById("checkout-modal");

    if (modal) {
        modal.classList.add("hidden");
    }
}

// ================================
// INITIALIZATION
// ================================
document.addEventListener("DOMContentLoaded", () => {

    renderProducts();

    updateCartUI();

    const viewCartBtn = document.getElementById("view-cart-btn");

    if (viewCartBtn) {

        viewCartBtn.addEventListener("click", openCheckoutModal);
    }
});
