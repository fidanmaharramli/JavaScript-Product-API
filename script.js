const apiUrl = "https://dummyjson.com";
let products = [];
const productsContainer = document.querySelector(".products-container");
const statusMessage = document.querySelector(".status-message");
const productsCount = document.querySelector(".products-count");
const searchInput = document.querySelector(".search-input");
const categoryFilter = document.querySelector(".category-filter");
const sortFilter = document.querySelector(".sort-filter");

const productModal = document.querySelector("#product-modal");
const modalImage = document.querySelector(".modal-image");
const modalTitle = document.querySelector(".modal-title");
const modalPrice = document.querySelector(".modal-price");
const modalDescription = document.querySelector(".modal-description");
const closeModalButton = document.querySelector(".close-modal");

async function getProducts() {
    try {
        const response = await fetch(`${apiUrl}/products`);

        if (!response.ok) {
            throw new Error("Не удалось загрузить данные");
        }

        const data = await response.json();
        products = data.products;
        displayProducts();
    } catch (error) {
        productsContainer.innerHTML = "";
        statusMessage.textContent = "Произошла ошибка при загрузке товаров. Пожалуйста, попробуйте позже.";
        statusMessage.style.color = "#c44578";
    }
}

async function getCategories() {
    try {
        const response = await fetch(`${apiUrl}/products/categories`);

        if (!response.ok) {
            throw new Error("Не удалось загрузить категории");
        }

        const categories = await response.json();

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.slug;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error("Ошибка при получении категорий:", error);
    }
}

function displayProducts() {
    statusMessage.textContent = "";
    productsContainer.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (sortFilter.value === "low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortFilter.value === "high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    productsCount.textContent = `Найдено товаров: ${filteredProducts.length}`;

    if (filteredProducts.length === 0) {
        statusMessage.textContent = "Товары не найдены.";
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="price">$${product.price}</p>
            <button>Подробнее</button>
        `;

        const detailsButton = card.querySelector("button");

        detailsButton.addEventListener("click", () => {
            modalImage.src = product.thumbnail;
            modalImage.alt = product.title;
            modalTitle.textContent = product.title;
            modalPrice.textContent = `$${product.price}`;
            modalDescription.textContent = product.description;

            productModal.style.display = "flex";
        });

        productsContainer.appendChild(card);
    });
}

getProducts();
getCategories();

searchInput.addEventListener("input", displayProducts);
categoryFilter.addEventListener("change", displayProducts);
sortFilter.addEventListener("change", displayProducts);

closeModalButton.addEventListener("click", () => {
    productModal.style.display = "none";
});

productModal.addEventListener("click", (event) => {
    if (event.target === productModal) {
        productModal.style.display = "none";
    }
});
