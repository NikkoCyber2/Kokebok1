async function updateAuthNavigation() {
  const {
    data: { session }
  } = await db.auth.getSession();

  const authLinks =
    document.querySelectorAll(".auth-link");

  authLinks.forEach((link) => {
    if (session) {
      link.textContent = "Min side";
      link.href = "admin.html";
    } else {
      link.textContent = "Logg inn";
      link.href = "login.html";
    }
  });
}

updateAuthNavigation();

db.auth.onAuthStateChange(() => {
  updateAuthNavigation();
});