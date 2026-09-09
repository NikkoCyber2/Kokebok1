const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  loginMessage.textContent = "Logger inn...";

  const { data, error } = await db.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    loginMessage.textContent = "Feil e-post eller passord.";
    return;
  }

  if (data.user) {
    window.location.href = "admin.html";
  }
});