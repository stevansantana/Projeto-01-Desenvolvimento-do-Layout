const products = Array.from({ length: 5 }, () => ({
  isNew: true,
  image: "figures/main/produto-avanti-Mockup.png",
  title: "Lorem Ipsum Dolor Sit Amet Consectetuer Adipiscing Elit",
  originalPrice: "R$ 100,00",
  promoPrice: "R$79,00",
  discount: "10% OFF",
  installment: "10x de R$ 7,90",
}));

function createSlide({
  isNew,
  image,
  title,
  originalPrice,
  promoPrice,
  discount,
  installment,
}) {
  return `
    <li class="glide__slide">
      <div class="product-card">
        <div class="product-image-container">
          ${isNew ? '<span class="product-badge">NOVO</span>' : ""}
          <img src="${image}" alt="${title}">
        </div>
        <p class="product-title">${title}</p>
        <div class="product-price-section">
          <div class="product-prices">
            <span>${originalPrice}</span>
            <span>${promoPrice}</span>
          </div>
          <span class="product-discount">${discount}</span>
        </div>
        <p class="product-installments">
          Ou em até <span>${installment}</span>
        </p>
        <button class="product-buy-button">Comprar</button>
      </div>
    </li>
  `;
}

function initializeCarousel(carouselId) {
  const carousel = document.querySelector(`#${carouselId}`);
  if (!carousel) return;

  const slidesContainer = carousel.querySelector(".glide__slides");
  const bulletsContainer = carousel.querySelector(".glide__bullets");

  slidesContainer.innerHTML = products.map(createSlide).join("");
  bulletsContainer.innerHTML =
    products.length > 1
      ? Array.from({ length: Math.min(products.length, 3) })
          .map(
            (_, i) =>
              `<button class="glide__bullet" data-glide-dir="=${i}"></button>`
          )
          .join("")
      : "";

  new Glide(`#${carouselId}`, {
    type: products.length <= 3 ? "slider" : "carousel",
    startAt: 0,
    perView: Math.min(products.length, 5),
    focusAt: 0,
    gap: -10,
    bound: true,
    classes: {
      arrow: {
        disabled: "glide__arrow--disabled",
      },
    },
    breakpoints: {
      450: { perView: 1 },
      650: { perView: 2 },
      850: { perView: 3 },
      1100: { perView: 4 },
    },
  }).mount();

  if (products.length <= 1) {
    bulletsContainer.style.display = "none";
  }
}

function setupFooterAccordion() {
  document.querySelectorAll(".footer-links-group").forEach((group) => {
    group.addEventListener("click", () => {
      document
        .querySelectorAll(".footer-links-group")
        .forEach((g) => g !== group && g.classList.remove("active"));
      group.classList.toggle("active");
    });
  });
}

function setupBuyButtons() {
  document.body.addEventListener("click", (e) => {
    const button = e.target.closest(".product-buy-button");
    if (!button) return;

    const card = button.closest(".product-card");
    const isMinus = e.target.closest(".minus");
    const isPlus = e.target.closest(".plus");
    const countElement = button.querySelector(".count");

    if (!button.classList.contains("active")) {
      button.classList.add("active");
      button.innerHTML = `
        <span class="minus"><span>−</span></span>
        <span class="count">1</span>
        <span class="plus"><span>+</span></span>
      `;
    } else if (isMinus && countElement) {
      let count = parseInt(countElement.textContent);
      if (count > 1) {
        countElement.textContent = count - 1;
      } else {
        button.classList.remove("active");
        button.textContent = "Comprar";
      }
    } else if (isPlus && countElement) {
      let count = parseInt(countElement.textContent);
      if (count < 4) {
        countElement.textContent = count + 1;
      }
    }
  });
}

function setupSearchFunctionality() {
  const searchForm = document.querySelector(".search-form");
  if (!searchForm) return;

  const input = searchForm.querySelector("input");
  const button = searchForm.querySelector(".search-button");
  const message = document.querySelector(".search-message");

  let timer = null;

  button.addEventListener("click", () => {
    const term = input.value.trim();
    if (!term) return;

    clearTimeout(timer);
    message.textContent = `Você buscou por: "${term}"`;
    message.style.display = "block";

    timer = setTimeout(() => {
      message.classList.add("hiding");
      setTimeout(() => {
        message.style.display = "none";
        message.classList.remove("hiding");
      }, 300);
    }, 2700);
  });

  searchForm.addEventListener("submit", (e) => e.preventDefault());
}

function setupMenuToggle() {
  const burger = document.querySelector(".menu-burger-container");
  const category = document.querySelector(".all-category-container");
  const deptLinks = document.querySelectorAll(".departament-link");
  const deptContainer = document.querySelector(".departament-container");

  document.addEventListener("click", (e) => {
    if (!burger.contains(e.target) && !category.contains(e.target)) {
      category.style.display = "none";
    }

    if (
      ![...deptLinks].some((link) => link.contains(e.target)) &&
      !deptContainer.contains(e.target)
    ) {
      deptContainer.style.display = "none";
    }
  });

  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = category.style.display === "flex";
    category.style.display = isOpen ? "none" : "flex";
    if (!isOpen) deptContainer.style.display = "none";
  });

  deptLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = deptContainer.style.display === "flex";
      deptContainer.style.display = isOpen ? "none" : "flex";
      if (!isOpen) category.style.display = "none";
    });
  });
}

function hideAllCategoryContainer() {
  const allCategoryContainer = document.querySelector(".all-category-container");
  allCategoryContainer.style.display = "none";
}

// Inicializa tudo ao carregar o documento
document.addEventListener("DOMContentLoaded", () => {
  ["carousel-products-1", "carousel-products-2"].forEach(initializeCarousel);
  setupFooterAccordion();
  setupBuyButtons();
  setupSearchFunctionality();
  setupMenuToggle();
});
