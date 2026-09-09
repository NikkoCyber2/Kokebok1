const logoutButton =
  document.getElementById("logout-button");

const userInfo =
  document.getElementById("user-info");


async function checkLogin() {

  const {
    data: { session }
  } = await db.auth.getSession();

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const email =
    session.user.email;

  userInfo.textContent =
    `Innlogget som ${email}`;
}


logoutButton.addEventListener(
  "click",
  async () => {

    await db.auth.signOut();

    window.location.href =
      "index.html";
  }
);


checkLogin();