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

    /*Enleve l'affichage des éléments dans la galerie Projet */
    document.querySelector(".gallery").innerHTML = "";
    
    /*On affiche les projets dans la galerie*/
    displayGallery(resultsJson);

  } catch (error) {
    console.error(error.message);
  }
}
getData ();


/********************Fonction affichage des projets dans Galerie */
function displayGallery (resultsJson) {
  resultsJson.forEach(work=> {
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

    const sectionProjet = document.querySelector(".gallery");
    sectionProjet.appendChild(figure);
  });
}

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
    console.log(resultsCategoriesJson);

  } catch (error) {
    console.error(error.message);
  }
}
getCategories ();


 