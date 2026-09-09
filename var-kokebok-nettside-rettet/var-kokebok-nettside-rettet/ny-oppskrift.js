const recipeForm =
  document.getElementById("recipe-form");

const formMessage =
  document.getElementById("form-message");

const categorySelect =
  document.getElementById("category");

const subcategoryContainer =
  document.getElementById("subcategory-container");

const subcategorySelect =
  document.getElementById("subcategory");

const logoutButton =
  document.getElementById("logout-button");


async function checkLogin() {
  const {
    data: { user },
    error,
  } = await db.auth.getUser();

  if (error || !user) {
    window.location.href = "login.html";
  }
}

checkLogin();


function updateSubcategory() {
  const category = categorySelect.value;

  if (category === "middag") {
    subcategoryContainer.hidden = false;
  } else {
    subcategoryContainer.hidden = true;
  }
}

categorySelect.addEventListener(
  "change",
  updateSubcategory
);

updateSubcategory();


recipeForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    formMessage.textContent =
      "Lagrer oppskrift...";

    const category =
      categorySelect.value;

    let subcategory;

    if (category === "middag") {
      subcategory =
        subcategorySelect.value;
    } else {
      subcategory = category;
    }

    const ingredients =
      document
        .getElementById("ingredients")
        .value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

    const steps =
      document
        .getElementById("steps")
        .value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

    const recipe = {
      title:
        document.getElementById("title").value.trim(),

      description:
        document
          .getElementById("description")
          .value
          .trim(),

      category,

      subcategory,

      duration:
        document
          .getElementById("duration")
          .value
          .trim(),

      servings:
        document
          .getElementById("servings")
          .value
          .trim(),

      difficulty:
        document.getElementById("difficulty").value,

      ingredients,

      steps,
    };

    const { error } = await db
      .from("recipes")
      .insert(recipe);

    if (error) {
      console.error(error);

      formMessage.textContent =
        "Noe gikk galt. Oppskriften ble ikke lagret.";

      return;
    }

    formMessage.textContent =
      "Oppskriften er lagret! 🎉";

    recipeForm.reset();

    categorySelect.value = "frokost";

    updateSubcategory();
  }
);


logoutButton.addEventListener(
  "click",
  async () => {

    await db.auth.signOut();

    window.location.href =
      "index.html";
  }
);