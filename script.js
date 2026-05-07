// ==============================
// SHARMA KIRANA • ULTRA EDITION
// ==============================

// ==============================
// GLOBAL STATE
// ==============================

let products = [];

let cart =
  JSON.parse(localStorage.getItem("cart")) || [];

let currentCategory = "All";

// ==============================
// USER PROFILE IMAGE
// ==============================

const userProfileImage =
  "https://i.pinimg.com/736x/28/8b/91/288b917391f9b2c07be1c3e05c654220.jpg";

// ==============================
// FETCH PRODUCTS
// FUTURE API READY
// ==============================

async function loadProducts() {

  // FUTURE CLOUDFLARE KV SUPPORT
  // const response = await fetch("/api/products");
  // products = await response.json();

  // TEMP LOCAL PRODUCTS

  products = [

    {
      id: 1,
      name: "Amul Milk",
      category: "Dairy",
      price: 30,
      image:
        "https://i.pinimg.com/736x/cb/16/69/cb16696e20e1f0a8298a11fab8adcacc.jpg"
    },

    {
      id: 2,
      name: "Farm Eggs",
      category: "Dairy",
      price: 60,
      image:
        "https://i.pinimg.com/736x/44/63/ed/4463ed18a381ac7edd7bf82f65ceac49.jpg"
    },

    {
      id: 3,
      name: "Haldiram Bhujia",
      category: "Snacks",
      price: 20,
      image:
        "https://i.pinimg.com/736x/c1/5a/7f/c15a7ff35afe99a39310ac5dab5dfcd7.jpg"
    },

    {
      id: 4,
      name: "Fresh Tomato",
      category: "Veggies",
      price: 40,
      image:
        "https://i.pinimg.com/736x/54/d3/76/54d3764e0c4d67a40c4cb63f52f4f70f.jpg"
    },

    {
      id: 5,
      name: "Bananas",
      category: "Fruits",
      price: 50,
      image:
        "https://i.pinimg.com/736x/79/3f/8d/793f8d4fbfd80f84e8f857f3d4a6d7f2.jpg"
    },

    {
      id: 6,
      name: "Cold Drink",
      category: "Drinks",
      price: 45,
      image:
        "https://i.pinimg.com/736x/31/51/79/31517957efac3f6f80f1f0cf0d2e6b4e.jpg"
    }
  ];

  renderCategories();

  renderProducts();

  updateFloatingCart();

  injectProfileImage();
}

// ==============================
// PROFILE IMAGE
// ==============================

function injectProfileImage() {

  const profileBtn =
    document.getElementById("profile-btn");

  if (!profileBtn) return;

  profileBtn.innerHTML = `

    <img
      src="${userProfileImage}"
      class="w-12 h-12 rounded-full object-cover border-2 border-pink-400 shadow-lg"
    >

    <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>

  `;
}

// ==============================
// PROFILE MENU
// ==============================

const profileBtn =
  document.getElementById("profile-btn");

const profileMenu =
  document.getElementById("profile-menu");

if (profileBtn) {

  profileBtn.addEventListener("click", () => {

    profileMenu.classList.toggle("hidden");
  });
}

document.addEventListener("click", e => {

  if (
    profileBtn &&
    !profileBtn.contains(e.target) &&
    !profileMenu.contains(e.target)
  ) {

    profileMenu.classList.add("hidden");
  }
});

// ==============================
// RENDER CATEGORIES
// ==============================

function renderCategories() {

  const categories = [
    "All",
    ...new Set(products.map(p => p.category))
  ];

  const categoryBar =
    document.getElementById("category-bar");

  categoryBar.innerHTML = categories
    .map(category => `

      <button
        onclick="filterCategory('${category}')"
        class="
          category-btn
          ${
            currentCategory === category
              ? "active-category"
              : ""
          }
        "
      >

        ${category}

      </button>

    `)
    .join("");
}

function filterCategory(category) {

  currentCategory = category;

  renderCategories();

  renderProducts();
}

// ==============================
// RENDER PRODUCTS
// ==============================

function renderProducts() {

  const grid =
    document.getElementById("product-grid");

  if (!grid) return;

  let filteredProducts = [...products];

  // SEARCH FILTER

  const searchQuery =
    document
      .getElementById("search-input")
      .value
      .toLowerCase();

  filteredProducts = filteredProducts.filter(
    product =>
      product.name
        .toLowerCase()
        .includes(searchQuery)
  );

  // CATEGORY FILTER

  if (currentCategory !== "All") {

    filteredProducts =
      filteredProducts.filter(
        product =>
          product.category === currentCategory
      );
  }

  // EMPTY STATE

  if (filteredProducts.length === 0) {

    grid.innerHTML = `

      <div class="col-span-full text-center py-20 opacity-60">

        <i class="fa-solid fa-box-open text-5xl mb-4"></i>

        <h2 class="text-xl font-bold">
          No Products Found
        </h2>

      </div>

    `;

    return;
  }

  // RENDER ITEMS

  grid.innerHTML = filteredProducts
    .map(product => {

      const cartItem =
        cart.find(
          item => item.id === product.id
        );

      const quantity =
        cartItem ? cartItem.quantity : 0;

      return `

        <div class="product-card">

          <div class="relative overflow-hidden rounded-3xl">

            <img
              src="${product.image}"
              class="product-image"
            >

            <div class="absolute top-3 left-3 glass-badge">

              ${product.category}

            </div>

          </div>

          <div class="mt-4">

            <h3 class="font-bold text-lg">

              ${product.name}

            </h3>

            <p class="opacity-60 text-sm mt-1">

              Fresh & Premium Quality

            </p>

          </div>

          <div class="flex items-center justify-between mt-5">

            <div>

              <p class="text-xl font-extrabold">

                ₹${product.price}

              </p>

            </div>

            ${
              quantity > 0
                ? `

                <div class="qty-box">

                  <button
                    onclick="updateQuantity(${product.id}, -1)"
                    class="qty-btn"
                  >
                    -
                  </button>

                  <span class="font-bold text-sm">
                    ${quantity}
                  </span>

                  <button
                    onclick="updateQuantity(${product.id}, 1)"
                    class="qty-btn"
                  >
                    +
                  </button>

                </div>

              `
                : `

                <button
                  onclick="updateQuantity(${product.id}, 1)"
                  class="add-btn"
                >

                  ADD

                </button>

              `
            }

          </div>

        </div>

      `;
    })
    .join("");
}

// ==============================
// UPDATE QUANTITY
// ==============================

function updateQuantity(productId, change) {

  const existingItem =
    cart.find(item => item.id === productId);

  if (existingItem) {

    existingItem.quantity += change;

    if (existingItem.quantity <= 0) {

      cart = cart.filter(
        item => item.id !== productId
      );
    }

  } else {

    cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveCart();

  renderProducts();

  updateFloatingCart();

  if (navigator.vibrate) {

    navigator.vibrate(40);
  }
}

// ==============================
// SAVE CART
// ==============================

function saveCart() {

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
}

// ==============================
// FLOATING CART
// ==============================

function updateFloatingCart() {

  const cartBtn =
    document.getElementById("view-cart-btn");

  const totalPriceEl =
    document.getElementById("cart-total-price");

  const totalItems =
    cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

  const totalPrice =
    cart.reduce((sum, item) => {

      const product =
        products.find(
          p => p.id === item.id
        );

      return (
        sum +
        product.price * item.quantity
      );

    }, 0);

  totalPriceEl.innerText =
    `₹${totalPrice}`;

  if (totalItems === 0) {

    cartBtn.style.display = "none";

  } else {

    cartBtn.style.display = "flex";
  }
}

// ==============================
// LIVE SEARCH
// ==============================

document
  .getElementById("search-input")
  .addEventListener("input", renderProducts);

// ==============================
// CHECKOUT MODAL
// ==============================

document
  .getElementById("view-cart-btn")
  .addEventListener(
    "click",
    openCheckoutModal
  );

function openCheckoutModal() {

  const modal =
    document.getElementById(
      "checkout-modal"
    );

  const itemsContainer =
    document.getElementById(
      "checkout-items"
    );

  modal.classList.remove("hidden");

  const cartProducts = cart.map(item => {

    const product =
      products.find(
        p => p.id === item.id
      );

    return {
      ...product,
      quantity: item.quantity
    };
  });

  itemsContainer.innerHTML =
    cartProducts.map(item => `

      <div class="checkout-item">

        <div class="flex items-center gap-3">

          <img
            src="${item.image}"
            class="w-16 h-16 rounded-2xl object-cover"
          >

          <div>

            <h3 class="font-bold">

              ${item.name}

            </h3>

            <p class="text-sm opacity-60">

              ${item.quantity} × ₹${item.price}

            </p>

          </div>

        </div>

        <p class="font-bold">

          ₹${item.price * item.quantity}

        </p>

      </div>

    `).join("");

  const total =
    cartProducts.reduce(
      (sum, item) =>
        sum +
        item.price * item.quantity,
      0
    );

  document.getElementById(
    "checkout-total"
  ).innerText = `₹${total}`;
}

function closeCheckoutModal() {

  document
    .getElementById("checkout-modal")
    .classList.add("hidden");
}

// ==============================
// PLACE ORDER
// ==============================

function placeOrder() {

  const totalItems =
    cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

  const totalPrice =
    cart.reduce((sum, item) => {

      const product =
        products.find(
          p => p.id === item.id
        );

      return (
        sum +
        product.price * item.quantity
      );

    }, 0);

  document.getElementById(
    "success-summary"
  ).innerHTML = `

    ${totalItems} items ordered successfully 🚀
    <br><br>
    Total Paid: ₹${totalPrice}

  `;

  document
    .getElementById("success-modal")
    .classList.remove("hidden");

  cart = [];

  saveCart();

  updateFloatingCart();

  closeCheckoutModal();

  renderProducts();
}

function closeSuccessModal() {

  document
    .getElementById("success-modal")
    .classList.add("hidden");
}

// ==============================
// OTAKU MODE
// ==============================

const themeToggle =
  document.getElementById("theme-toggle");

const savedTheme =
  localStorage.getItem("theme");

if (savedTheme === "otaku") {

  document.body.classList.add(
    "otaku-mode"
  );

  themeToggle.innerHTML =
    `<i class="fa-solid fa-star"></i>`;
}

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle(
    "otaku-mode"
  );

  const isOtaku =
    document.body.classList.contains(
      "otaku-mode"
    );

  localStorage.setItem(
    "theme",
    isOtaku ? "otaku" : "normal"
  );

  themeToggle.innerHTML = isOtaku
    ? `<i class="fa-solid fa-star"></i>`
    : `<i class="fa-solid fa-moon"></i>`;
});

// ==============================
// INIT
// ==============================

loadProducts();
