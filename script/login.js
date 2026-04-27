const loginForm = document.getElementById("login_form");

loginForm.addEventListener("submit", loginUser);

// Empêcher l'accès à la page login si l'utilisateur est déjà connecté
const token = sessionStorage.getItem("token");

if (token) {
  window.location.href = "index.html"; // redirection vers l'accueil
}

/* fonction connexion login utilisateur */
async function loginUser(event) {
  event.preventDefault(); // bloque le comportement du navigateur

  const userEmail = document.getElementById("login_email").value;
  const password = document.getElementById("login_password").value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, password }),
    });

    const result = await response.json();

    if (response.ok && result.token) {
      /*console.log("Vous etes connectés !!")*/

      // Stockage du token
      sessionStorage.setItem("token", result.token);

      // Redirection
      window.location.href = "index.html";
    } else {
      /*creation message erreur*/
      if (!loginForm.querySelector(".error-login")) {
        const errorMsg = document.createElement("div");
        errorMsg.className = "error-login";
        errorMsg.innerText = "Erreur dans l’identifiant ou le mot de passe";
        loginForm.prepend(errorMsg);
      }
      return;
    }
  } catch (error) {
    console.error("Erreur API :", error);
    /*creation message erreur si backend non connecté*/
    if (!loginForm.querySelector(".error-backend")) {
      const errorMsg = document.createElement("div");
      errorMsg.className = "error-backend";
      errorMsg.innerText =
        "Le serveur est indisponible. Veuillez réessayer ultérieurement.";
      loginForm.prepend(errorMsg);
    }
  }
}

// Effacer le message d’erreur quand on re-clique dans le formulaire */
loginForm.addEventListener("click", () => {
  const oldErrorMsg = loginForm.querySelector(".error-login");
  const oldBackendErrorMsg = loginForm.querySelector(".error-backend");

  if (oldErrorMsg) oldErrorMsg.remove();
  if (oldBackendErrorMsg) oldBackendErrorMsg.remove();
});
