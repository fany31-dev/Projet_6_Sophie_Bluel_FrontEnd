/** variable globale works */

let works = [];

/**********récupération des données GET/WORKS depuis l'API *******/
async function getData() {
  const url = "http://localhost:5678/api/works";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    /*Données/réponses retournées par l'API */
    const resultsJson = await response.json();
    /*console.log(resultsJson);

    // On stocke les projets globalement */
    works = resultsJson;

    /*Enleve l'affichage des éléments dans la galerie Projet */
    document.querySelector(".gallery").innerHTML = "";
    
    /*On affiche les projets dans la galerie*/
    displayGallery(works);

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
    /*console.log(resultsCategoriesJson);

    /*On affiche les projets dans la galerie*/
    displayBtnFilter(resultsCategoriesJson);
    filterButtons();
 
  } catch (error) {
    console.error(error.message);
  }
}
getCategories ();


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
  btnAll.dataset.id = "0";
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
}


/**fonction filtre par nom categories*/
function filterByCategoryName(name) {
  if (name === "Tous") return works;

  const donneesFiltrées = works.filter (item => item.category.name === name);
  return donneesFiltrées;
}

/******** 7. AJOUT DES EVENT LISTENERS ************/
function filterButtons() {
  const buttons = document.querySelectorAll(".sectionFilters button");

  buttons.forEach(button => {    
    button.addEventListener("click", () => {

      // Retire la classe active de tous les boutons
      buttons.forEach(btn => btn.classList.remove("active"));
      // Active le bouton cliqué
      button.classList.add("active");

      const categoryName = button.dataset.name;
      const projetsFiltres = filterByCategoryName(categoryName);
      displayGallery(projetsFiltres);
      /*console.log(projetsFiltres);*/
      });
  });
}
