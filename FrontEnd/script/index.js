/** variables globales */

let works = [];
let token = localStorage.getItem("token");

/**********récupération des données GET/WORKS depuis l'API *******/
async function getData() {
  const url = "http://localhost:5678/api/works";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    /*Données/réponses retournées par l'API */
    works = await response.json();

    /*Enleve l'affichage des éléments dans la galerie Projet */
    document.querySelector(".gallery").innerHTML = "";
    
    /*On affiche les projets dans la galerie*/
    displayGallery(works);
    setFigureModal(works);

  } catch (error) {
    console.error(error.message);
  }
}
getData ();


/********************Fonction affichage des projets dans Galerie */
function displayGallery (works) {

  const sectionProjet = document.querySelector(".gallery");
  sectionProjet.innerHTML = "";

  works.forEach(work=> {
    /* creation des elements de la galerie Projet*/
    const figure = document.createElement("figure");

    /* creation image*/
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;

    /* creation legende/titre */
    const titleElement = document.createElement("figcaption");
    titleElement.innerText = work.title;

    /*Ajout dans gallery et figure*/
    figure.appendChild(imageElement);
    figure.appendChild(titleElement);
    sectionProjet.appendChild(figure);
  });
}

/**********************************************************************/
/**********récupération des données GET/categories depuis l'API *******/
async function getCategories() {
  const urlCategories = "http://localhost:5678/api/categories";

  try {
    const response = await fetch(urlCategories);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    /*Données/réponses retournées par l'API */
    const resultsCategoriesJson = await response.json();

    /*On affiche les projets dans la galerie*/
    displayBtnFilter(resultsCategoriesJson);
    filterButtons();
 
  } catch (error) {
    console.error(error.message);
  }
}
getCategories ();

/****************************************************************/
/********************Fonction affichage des projets dans Galerie */
function displayBtnFilter (resultsCategoriesJson) {
  /* recuperation de la section portfolio et gallery*/
  const portfolio = document.querySelector("#portfolio");
  const sectionProjet = document.querySelector(".gallery");

  /*** creation du container des Filtres ****/
  const sectionFilters = document.createElement ("div");
  sectionFilters.classList.add("sectionFilters");

  /* on ajoute le container à portfolio*/
  portfolio.appendChild(sectionFilters);
  portfolio.insertBefore(sectionFilters, sectionProjet);

  /*** creation btn "Tous/All" ***/
  const btnAll = document.createElement("button");
  btnAll.innerText = "Tous";
  btnAll.dataset.name = "Tous";
  btnAll.dataset.id = 0;
  sectionFilters.appendChild(btnAll);

  /* creation btn pour chaque categorie*/
  resultsCategoriesJson.forEach(categories=> {
  const btnFilter = document.createElement("button");
  btnFilter.dataset.name = categories.name;
  btnFilter.dataset.id = categories.id;
  btnFilter.innerText = categories.name;
  /* on ajoute le bouton au container*/
  sectionFilters.appendChild(btnFilter);
  });

  // Si mode édition → on cache immédiatement
  if (token) {
    sectionFilters.style.display = "none";
  }
}


/**fonction filtre par nom categories*/
function filterByCategoryId(id) {
  if (id === 0) return works;
  const donneesFiltrées = works.filter (item => item.category.id === id);
  return donneesFiltrées;
}

/***********************************************/
/******** AJOUT DES EVENT LISTENERS ************/
function filterButtons() {
  const buttons = document.querySelectorAll(".sectionFilters button");

  buttons.forEach(button => { 
   
    button.addEventListener("click", () => {

      // Retire la classe active de tous les boutons
      buttons.forEach(btn => btn.classList.remove("active"));
      // Active le bouton cliqué
      button.classList.add("active");

      const categoryId = Number(button.dataset.id);
      const projetsFiltres = filterByCategoryId(categoryId);
      displayGallery(projetsFiltres);
      /*console.log(categoryId);*/
      });
  });
}

/**************************creation de la nouvelle page index.html apres connexion*******************/

function displayBanner() {
  // Affichage de la bannière d'édition//
  const banniereModeEdition = document.createElement("div");
  banniereModeEdition.className = "banner";
  banniereModeEdition.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i> Mode édition</p>';
  document.body.prepend(banniereModeEdition);
}

function replaceLinkLogin() {
  // Affiche "Logout" à la place de "Login"//
  const lienLogin = document.querySelector(".lien-login");

  const lienLogout = document.createElement("a");
  lienLogout.className = "lien-logout";
  lienLogout.textContent = "Logout";
  lienLogout.href = "index.html";

  lienLogout.addEventListener("click", function (event) {
    event.preventDefault(); // bloque le comportement du navigateur
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

  lienLogin.replaceWith(lienLogout);
}

// affichage de la div modifier//
function displayModifier () {

  const titleGallery = document.querySelector(".title-projet");
  const portfolio = document.querySelector("#portfolio");

  /*** creation de l'element modifier open-modal à cote de Mon projet ***/
  const containerIconeModifier = document.createElement("a");
  containerIconeModifier.className = "js-modal";
  containerIconeModifier.href = "#modal1";
   
  const icone = document.createElement ("i");
  icone.className = "icone-modifier";
  icone.classList.add("fa-regular", "fa-pen-to-square");

  const textModifier = document.createElement ("p");
  textModifier.className = "text-modifier";
  textModifier.textContent = " modifier";

  containerIconeModifier.appendChild(icone);
  containerIconeModifier.appendChild(textModifier);
  portfolio.appendChild(containerIconeModifier);

  // Ajout à côté du titre
  titleGallery.insertAdjacentElement("afterend", containerIconeModifier);
}


/**********************************************/

function pageModeEdition() {

  document.addEventListener("DOMContentLoaded", () => {
    if (token) {
      displayBanner();
      replaceLinkLogin();
      displayModifier ();
    };
  });
}
pageModeEdition();