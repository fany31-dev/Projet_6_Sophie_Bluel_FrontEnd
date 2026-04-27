/** variables globales */
let works = [];
let token = sessionStorage.getItem("token");

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

    /*On affiche les projets dans la galerie*/
    displayGallery(works);
    setFigureModal(works);
  } catch (error) {
    console.error(error.message);
  }
}
getData();

/********************Fonction affichage des projets dans Galerie */
function displayGallery(works) {
  const projectSection = document.querySelector(".gallery");
  projectSection.innerHTML = "";

  works.forEach((work) => {
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
    projectSection.appendChild(figure);
  });
}

/***************creation des elements figure dans la modale *****************/
function setFigureModal(works) {
  const sectionModal = document.querySelector(".modal-photo-gallery");
  sectionModal.innerHTML = "";

  works.forEach((work) => {
    const figureModal = document.createElement("figure");
    figureModal.id = work.id;

    /* creation image*/
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    imageElement.className = "project-modal";

    // /* creation poubelle */
    const btnDelete = document.createElement("button");
    btnDelete.className = "delete-project";
    btnDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    // Ajout de l’event listener ici
    btnDelete.addEventListener("click", (e) => {
      deleteWork(e, work.id, figureModal);
      getData();
      console.log("Suppression du projet", work.id);
    });

    /*Ajout dans gallery et figure*/
    figureModal.appendChild(imageElement);
    figureModal.appendChild(btnDelete);
    sectionModal.appendChild(figureModal);
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
getCategories();

/****************************************************************/
/********************Fonction affichage des projets dans Galerie */
function displayBtnFilter(resultsCategoriesJson) {
  /* recuperation de la section portfolio et gallery*/
  const portfolio = document.querySelector("#portfolio");
  const projectSection = document.querySelector(".gallery");

  /*** creation du container des Filtres ****/
  const sectionFilters = document.createElement("div");
  sectionFilters.classList.add("sectionFilters");

  /* on ajoute le container à portfolio*/
  portfolio.appendChild(sectionFilters);
  portfolio.insertBefore(sectionFilters, projectSection);

  /*** creation btn "Tous/All" ***/
  const btnAll = document.createElement("button");
  btnAll.innerText = "Tous";
  btnAll.dataset.name = "Tous";
  btnAll.dataset.id = 0;
  btnAll.classList.add("active");
  sectionFilters.appendChild(btnAll);

  /* creation btn pour chaque categorie*/
  resultsCategoriesJson.forEach((categories) => {
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
  const filteredData = works.filter((item) => item.category.id === id);
  return filteredData;
}

/***********************************************/
/******** AJOUT DES EVENT LISTENERS ************/
function filterButtons() {
  const buttons = document.querySelectorAll(".sectionFilters button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // Retire la classe active de tous les boutons
      buttons.forEach((btn) => btn.classList.remove("active"));
      // Active le bouton cliqué
      button.classList.add("active");

      const categoryId = Number(button.dataset.id);
      const filteredProjects = filterByCategoryId(categoryId);
      displayGallery(filteredProjects);
    });
  });
}

/**************************creation de la nouvelle page index.html apres connexion*******************/

function displayBanner() {
  // Affichage de la bannière d'édition//
  const editModeBanner = document.createElement("div");
  editModeBanner.className = "banner";
  editModeBanner.innerHTML =
    '<p><i class="fa-regular fa-pen-to-square"></i> Mode édition</p>';
  document.body.prepend(editModeBanner);
}

function replaceLinkLogin() {
  // Affiche "Logout" à la place de "Login"//
  const loginLink = document.querySelector(".lien-login");

  const logoutLink = document.createElement("a");
  logoutLink.className = "lien-logout";
  logoutLink.textContent = "logout";
  logoutLink.href = "index.html";

  logoutLink.addEventListener("click", function (event) {
    event.preventDefault(); // bloque le comportement du navigateur
    sessionStorage.removeItem("token");
    window.location.href = "index.html";
  });

  loginLink.replaceWith(logoutLink);
}

// affichage de la div modifier//
function displayEditButton() {
  const titleGallery = document.querySelector(".title-projet");
  const portfolio = document.querySelector("#portfolio");

  /*** creation de l'element modifier open-modal à cote de Mon projet ***/
  const editIconContainer = document.createElement("a");
  editIconContainer.className = "js-modal";
  editIconContainer.href = "#modal1";

  const icone = document.createElement("i");
  icone.className = "icone-modifier";
  icone.classList.add("fa-regular", "fa-pen-to-square");

  const textModifier = document.createElement("p");
  textModifier.className = "text-modifier";
  textModifier.textContent = " modifier";

  editIconContainer.appendChild(icone);
  editIconContainer.appendChild(textModifier);
  portfolio.appendChild(editIconContainer);

  // Ajout à côté du titre
  titleGallery.insertAdjacentElement("afterend", editIconContainer);
}

/**********************************************/

function enableEditModePage() {
  document.addEventListener("DOMContentLoaded", () => {
    if (token) {
      displayBanner();
      replaceLinkLogin();
      displayEditButton();
    }
  });
}
enableEditModePage();
