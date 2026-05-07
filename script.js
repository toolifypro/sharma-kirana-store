// 1. Product Data Array
const products = [
    { 
        id: 1, 
        name: "Amul Taaza Toned Milk", 
        price: 25, 
        unit: "500 ml", 
        imageUrl: "https://via.placeholder.com/150/F3F4F6/9CA3AF?text=Milk" 
    },
    { 
        id: 2, 
        name: "Fresh Coriander (Dhania)", 
        price: 15, 
        unit: "100 g", 
        imageUrl: "https://via.placeholder.com/150/F3F4F6/9CA3AF?text=Coriander" 
    },
    { 
        id: 3, 
        name: "Haldiram's Bhujia Sev", 
        price: 110, 
        unit: "400 g", 
        imageUrl: "https://via.placeholder.com/150/F3F4F6/9CA3AF?text=Bhujia" 
    },
    { 
        id: 4, 
        name: "Farm Fresh White Eggs", 
        price: 48, 
        unit: "6 pcs", 
        imageUrl: "https://via.placeholder.com/150/F3F4F6/9CA3AF?text=Eggs" 
    }
];

// 2. Global Cart State (Initialize from LocalStorage)
let cart = JSON.parse(localStorage.getItem('sharma_kirana_cart')) || [];

// 3. Render Products into the Grid
function renderProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => `
        <div class="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm flex flex-col group">
            <div class="h-28 w-full bg-brand-gray rounded-xl flex items-center justify-center mb-3 overflow-hidden group-hover:bg-gray-200 transition-colors relative">
                <img src="${product.imageUrl}" alt="${product.name}" class="object-cover h-full w-full mix-blend-multiply opacity-50">
            </div>
            <div class="flex-grow">
                <h4 class="text-sm font-semibold text-gray-800 leading-tight mb-1">${product.name}</h4>
                <p class="text-xs text-gray-500 mb-3">${product.unit}</p>
            </div>
            <div class="flex items-center justify-between mt-auto">
                <div class="flex flex-col">
                    <span class="text-sm font-bold">₹${product.price}</span>
                </div>
                <button onclick="addToCart(${product.id})" class="bg-brand-gray border border-brand-green text-brand-green font-bold text-sm px-4 py-1.5 rounded-lg hover:bg-brand-green hover:text-white transition-colors active:scale-95 transform">
                    ADD
                </button>
            </div>
        </div>
    `).join('');
}

// 4. Add to Cart Logic
function addToCart(productId) {
    // Find the product in our database array
    const productToAdd = products.find(p => p.id === productId);
    if (!productToAdd) return;

    // Check if item already exists in the cart
    const existingCartItem = cart.find(item => item.id === productId);

    if (existingCartItem) {
        existingCartItem.quantity += 1;
    } else {
        // Add new item to cart array with initial quantity of 1
        cart.push({ ...productToAdd, quantity: 1 });
    }

    // Save updated cart to LocalStorage
    saveCart();
    
    // Update the UI immediately
    updateCartUI();
    
    // Optional: Tiny vibration for mobile feedback
    if (navigator.vibrate) navigator.vibrate(50); 
}

// 5. Update Floating Cart UI
function updateCartUI() {
    const floatingCart = document.getElementById('floating-cart');
    const cartCountEl = document.getElementById('cart-count');
    const cartTotalEl = document.getElementById('cart-total');

    if (!floatingCart || !cartCountEl || !cartTotalEl) return;

    // Calculate Totals
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Toggle Visibility
    if (totalItems > 0) {
        floatingCart.classList.remove('hidden'); // Show cart
        // Add a little slide-up animation effect
        floatingCart.classList.add('translate-y-0');
        floatingCart.classList.remove('translate-y-full');
        
        // Update DOM text
        cartCountEl.innerText = `${totalItems} Item${totalItems > 1 ? 's' : ''}`;
        cartTotalEl.innerText = `₹${totalPrice}`;
    } else {
        // Hide cart
        floatingCart.classList.add('translate-y-full');
        setTimeout(() => floatingCart.classList.add('hidden'), 300); // Wait for transition
    }
}

// 6. Save to LocalStorage
function saveCart() {
    localStorage.setItem('sharma_kirana_cart', JSON.stringify(cart));
}

// 7. View Cart Action
function viewCart() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    // Format cart for the alert display
    const cartSummary = cart.map(item => 
        `${item.quantity}x ${item.name} - ₹${item.price * item.quantity}`
    ).join('\n');
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    alert(`🛒 YOUR CART:\n\n${cartSummary}\n\nTotal to pay: ₹${totalPrice}\n\nProceeding to checkout...`);
    console.log("Current Cart Object:", cart);
}

// 8. Initialization (Runs when script loads)
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();

    // Attach event listener to View Cart button
    const viewCartBtn = document.getElementById('view-cart-btn');
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', viewCart);
    }
});
