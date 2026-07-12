const menuLinks = [...document.querySelectorAll(".category-menu a")];
const sections = menuLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const cartButton = document.querySelector(".cart-button");
const cartPanel = document.querySelector("#cartPanel");
const cartItems = document.querySelector("[data-cart-items]");
const cartCount = document.querySelector("[data-cart-count]");
const addButtons = document.querySelectorAll("[data-add]");
const cart = new Map();

const syncActiveCategory = (entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    menuLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
};

const sectionObserver = new IntersectionObserver(syncActiveCategory, {
  rootMargin: "-42% 0px -50% 0px",
  threshold: 0,
});

sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll(".carousel-shell").forEach((shell) => {
  const carousel = shell.querySelector(".product-carousel");
  const previous = shell.querySelector(".prev");
  const next = shell.querySelector(".next");

  const scrollByCard = (direction) => {
    const firstCard = carousel.querySelector(".product-card");
    const distance = firstCard ? firstCard.getBoundingClientRect().width + 42 : 360;
    carousel.scrollBy({ left: distance * direction, behavior: "smooth" });
  };

  previous?.addEventListener("click", () => scrollByCard(-1));
  next?.addEventListener("click", () => scrollByCard(1));
});

const renderCart = () => {
  const totalItems = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  cartCount.textContent = totalItems;

  if (totalItems === 0) {
    cartItems.innerHTML = "<p>Your selection is empty.</p>";
    return;
  }

  cartItems.innerHTML = [...cart.entries()]
    .map(
      ([name, quantity]) => `
        <div class="cart-line">
          <strong>${name}</strong>
          <span>Qty ${quantity}</span>
        </div>
      `,
    )
    .join("");
};

const openCart = () => {
  cartPanel.classList.add("is-open");
  cartPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
};

const closeCart = () => {
  cartPanel.classList.remove("is-open");
  cartPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
};

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.add;
    cart.set(name, (cart.get(name) || 0) + 1);
    renderCart();
    openCart();
  });
});

cartButton.addEventListener("click", openCart);
document.querySelectorAll("[data-close-cart]").forEach((button) => button.addEventListener("click", closeCart));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

renderCart();
