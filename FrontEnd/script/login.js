const formulaireLogin = document.getElementById("login_form");

formulaireLogin.addEventListener("submit", connexionUtilisateur);

/* fonction connexion login utilisateur */
async function connexionUtilisateur (event) {
  event.preventDefault(); // bloque le comportement du navigateur

  const userEmail = document.getElementById("login_email").value;
  const password = document.getElementById("login_password").value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, password }),
    });

    const resultat = await response.json();

    if(response.ok && resultat.token) {
    /*console.log("Vous etes connectés !!")*/

    // Stockage du token  
    localStorage.setItem("token",resultat.token);

    // Redirection
    window.location.href = "index.html";
    
  } else {
    /*creation message erreur*/
    const errorMsg = document.createElement ("div");
    errorMsg.className = "error-login"
    errorMsg.innerText = "Erreur dans l’identifiant ou le mot de passe";
    login_form.prepend(errorMsg);
    /***********************/
  }

  } catch (error) {
    console.error("Erreur API :", error);
  }
  
};





