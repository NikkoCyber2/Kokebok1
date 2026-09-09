(async () => {
  const menuButton = document.querySelector(".menu-button");
  const mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      mobileNav.setAttribute("aria-hidden", String(!open));
    });
  }

  const grid = document.getElementById("recipe-grid");
  if (!grid) return;

  const pageTitle = document.getElementById("page-title");
  const pageDescription = document.getElementById("page-description");
  const subfilters = document.getElementById("subfilters");
  const emptyMessage = document.getElementById("empty-message");
  const tabButtons = [...document.querySelectorAll(".main-tabs button")];
  const filterButtons = [...document.querySelectorAll(".subfilters button")];

  // Hent oppskrifter fra Supabase
  const { data, error } = await db
    .from("recipes")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Kunne ikke hente oppskrifter:", error);

    grid.innerHTML = "";

    emptyMessage.textContent =
      "Kunne ikke hente oppskriftene akkurat nå.";
    emptyMessage.hidden = false;

    return;
  }

  const recipes = data || [];

  console.log("Oppskrifter hentet fra Supabase:", recipes);

  const params = new URLSearchParams(window.location.search);
  const validCategories = ["frokost", "middag", "dessert"];

  let activeCategory = validCategories.includes(params.get("category"))
    ? params.get("category")
    : "middag";

  let activeFilter = "alle";

  const copy = {
    frokost: {
      title: "Frokost",
      description:
        "Gode starter på dagen – fra raske hverdager til rolige helgemorgener.",
    },

    middag: {
      title: "Middag",
      description:
        "Velg mellom fisk, kylling, svin, biff og vegetariske favoritter.",
    },

    dessert: {
      title: "Dessert",
      description:
        "Kaker, bakst og små søte avslutninger som er verdt å dele.",
    },
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function render() {
    pageTitle.textContent = copy[activeCategory].title;
    pageDescription.textContent = copy[activeCategory].description;

    document.title =
      `${copy[activeCategory].title} | Vår Kokebok`;

    tabButtons.forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.category === activeCategory
      );
    });

    subfilters.hidden = activeCategory !== "middag";

    if (activeCategory !== "middag") {
      activeFilter = "alle";
    }

    filterButtons.forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.filter === activeFilter
      );
    });

    const filtered = recipes.filter((recipe) => {
      const sameCategory =
        recipe.category === activeCategory;

      const sameFilter =
        activeFilter === "alle" ||
        recipe.subcategory === activeFilter;

      return sameCategory && sameFilter;
    });

    grid.innerHTML = filtered
      .map(
        (recipe) => `
          <article class="recipe-card">

            <div
              class="recipe-card-art"
              data-letter="${escapeHtml(recipe.title.charAt(0))}"
            ></div>

            <div class="recipe-card-content">

              <span class="recipe-badge">
                ${escapeHtml(recipe.subcategory)}
              </span>

              <h2>
                ${escapeHtml(recipe.title)}
              </h2>

              <p>
                ${escapeHtml(recipe.description)}
              </p>

              <div class="recipe-meta">
                <span>◷ ${escapeHtml(recipe.duration)}</span>
                <span>♙ ${escapeHtml(recipe.servings)}</span>
                <span>◇ ${escapeHtml(recipe.difficulty)}</span>
              </div>

              <button
                class="recipe-open"
                data-recipe-id="${recipe.id}"
              >
                Åpne oppskriften
              </button>

            </div>

          </article>
        `
      )
      .join("");

    emptyMessage.textContent =
      "Ingen oppskrifter i denne kategorien ennå.";

    emptyMessage.hidden = filtered.length !== 0;

    const url = new URL(window.location);

    url.searchParams.set(
      "category",
      activeCategory
    );

    history.replaceState(null, "", url);
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      activeFilter = "alle";

      render();
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;

      render();
    });
  });

  const modal = document.getElementById("recipe-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalKicker = document.getElementById("modal-kicker");
  const modalDescription =
    document.getElementById("modal-description");
  const modalMeta = document.getElementById("modal-meta");
  const modalIngredients =
    document.getElementById("modal-ingredients");
  const modalSteps =
    document.getElementById("modal-steps");

  function openModal(recipe) {
    modalTitle.textContent = recipe.title;

    modalKicker.textContent =
      `${recipe.category} · ${recipe.subcategory}`;

    modalDescription.textContent =
      recipe.description;

    modalMeta.innerHTML = `
      <span>◷ ${escapeHtml(recipe.duration)}</span>
      <span>♙ ${escapeHtml(recipe.servings)}</span>
      <span>◇ ${escapeHtml(recipe.difficulty)}</span>
    `;

    modalIngredients.innerHTML =
      (recipe.ingredients || [])
        .map(
          (item) =>
            `<li>${escapeHtml(item)}</li>`
        )
        .join("");

    modalSteps.innerHTML =
      (recipe.steps || [])
        .map(
          (step) =>
            `<li>${escapeHtml(step)}</li>`
        )
        .join("");

    modal.classList.add("open");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "modal-open"
    );

    document
      .querySelector(".modal-close")
      .focus();
  }

  function closeModal() {
    modal.classList.remove("open");

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "modal-open"
    );
  }

  grid.addEventListener("click", (event) => {
    const button =
      event.target.closest("[data-recipe-id]");

    if (!button) return;

    const recipe = recipes.find(
      (item) =>
        item.id === Number(button.dataset.recipeId)
    );

    if (recipe) {
      openModal(recipe);
    }
  });

  document
    .querySelectorAll("[data-close-modal]")
    .forEach((element) => {
      element.addEventListener(
        "click",
        closeModal
      );
    });

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        modal.classList.contains("open")
      ) {
        closeModal();
      }
    }
  );

  render();
})();