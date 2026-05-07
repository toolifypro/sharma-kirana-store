// =======================
// FUTURE API READY
// =======================

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let currentCategory = "All";

// =======================
// FETCH PRODUCTS
// =======================

async function loadProducts() {

  // FUTURE CLOUDFLARE KV API READY
  // const response = await fetch("/api/products");
  // products = await response.json();

  // TEMP LOCAL DATA
  products = [

    {
      id: 1,
      name: "Milk",
      category: "Dairy",
      price: 30,
      image: "https://i.pinimg.com/736x/cb/16/69/cb16696e20e1f0a8298a11fab8adcacc.jpg"
    },

    {
      id: 2,
      name: "Eggs",
      category: "Dairy",
      price: 60,
      image: "https://i.pinimg.com/736x/44/63/ed/4463ed18a381ac7edd7bf82f65ceac49.jpg"
    },

    {
      id: 3,
      name: "Chips",
      category: "Snacks",
      price: 20,
      image: "https://i.pinimg.com/736x/c1/5a/7f/c15a7ff35afe99a39310ac5dab5dfcd7.jpg"
    },

    {
      id: 4,
      name: "Tomato",
      category: "Veggies",
      price: 40,
      image: "https://i.pinimg.com/736x/54/d3/76/54d3764e0c4d67a40c4cb63f52f4f70f.jpg"
    }
  ];

  renderCategories();
  renderProducts();
}

// =======================
// RENDER CATEGORIES
// =======================

function renderCategories() {

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const bar = document.getElementById("category-bar");

  bar.innerHTML = categories.map(category => `

    <button
      onclick="filterCategory('${category}')"
      class="category-btn ${currentCategory === category ? 'active' : ''}"
    >

      ${category}

    </button>

  `).join("");
}

function filterCategory(category) {

  currentCategory = category;

  renderCategories();
  renderProducts();
}

// =======================
// RENDER PRODUCTS
// =======================

function renderProducts() {

  const grid = document.getElementById("product-grid");

  let filtered = [...products];

  // SEARCH
  const query = document
    .getElementById("search-input")
    .value
    .toLowerCase();

  filtered = filtered.filter(product =>
    product.name.toLowerCase().includes(query)
  );

  // CATEGORY
  if (currentCategory !== "All") {

    filtered = filtered.filter(
      product => product.category === currentCategory
    );
  }

  grid.innerHTML = filtered.map(product => {

    const item = cart.find(i => i.id === product.id);

    const qty = item ? item.quantity : 0;

    return `

      <div class="product-card">

        <img
          src="${product.image}"
          class="h-32 w-full object-cover rounded-2xl"
        >

        <h3 class="font-bold mt-3">${product.name}</h3>

        <p class="text-sm opacity-70">
          ${product.category}
        </p>

        <div class="flex justify-between items-center mt-4">

          <span class="font-bold">
            ₹${product.price}
          </span>

          ${
            qty > 0
            ?
            `
              <div class="flex items-center gap-2">

                <button onclick="updateQuantity(${product.id}, -1)">
                  -
                </button>

                <span>${qty}</span>

                <button onclick="updateQuantity(${product.id}, 1)">
                  +
                </button>

              </div>
            `
            :
            `
              <button
                onclick="updateQuantity(${product.id}, 1)"
                class="bg-[var(--accent)] text-white px-4 py-2 rounded-xl"
              >
                ADD
              </button>
            `
          }

        </div>

      </div>

    `;
  }).join("");
}

// =======================
// UPDATE QUANTITY
// =======================

function updateQuantity(productId, change) {

  const item = cart.find(i => i.id === productId);

  if (item) {

    item.quantity += change;

    if (item.quantity <= 0) {

      cart = cart.filter(i => i.id !== productId);
    }

  } else {

    cart.push({
      id: productId,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  renderProducts();
}

// =======================
// SEARCH
// =======================

document
  .getElementById("search-input")
  .addEventListener("input", renderProducts);

// =======================
// CART MODAL
// =======================

document
  .getElementById("view-cart-btn")
  .addEventListener("click", openCheckoutModal);

function openCheckoutModal() {

  const modal = document.getElementById("checkout-modal");

  const itemsContainer = document.getElementById("checkout-items");

  modal.classList.remove("hidden");

  const cartProducts = cart.map(item => {

    const product = products.find(p => p.id === item.id);

    return {
      ...product,
      quantity: item.quantity
    };
  });

  itemsContainer.innerHTML = cartProducts.map(item => `

    <div class="flex justify-between">

      <div>

        <h4 class="font-bold">
          ${item.name}
        </h4>

        <p class="text-sm opacity-70">
          ${item.quantity} x ₹${item.price}
        </p>

      </div>

      <span class="font-bold">
        ₹${item.quantity * item.price}
      </span>

    </div>

  `).join("");

  const total = cartProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  document.getElementById("checkout-total").innerText = `₹${total}`;
}

function closeCheckoutModal() {

  document
    .getElementById("checkout-modal")
    .classList.add("hidden");
}

// =======================
// PLACE ORDER
// =======================

function placeOrder() {

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  document.getElementById(
    "success-summary"
  ).innerText = `${totalItems} items will arrive in 10 mins 🚀`;

  document
    .getElementById("success-modal")
    .classList.remove("hidden");

  cart = [];

  localStorage.removeItem("cart");

  closeCheckoutModal();

  renderProducts();
}

function closeSuccessModal() {

  document
    .getElementById("success-modal")
    .classList.add("hidden");
}

// =======================
// OTAKU MODE
// =======================

const themeToggle = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "otaku") {

  document.body.classList.add("otaku-mode");
}

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("otaku-mode");

  const isOtaku = document.body.classList.contains("otaku-mode");

  localStorage.setItem(
    "theme",
    isOtaku ? "otaku" : "normal"
  );
});

// =======================
// INIT
// =======================

loadProducts();
