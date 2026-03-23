/***************variables globales ***************/
let modal = null
const focusableSelector = "button, input, select, textarea, a[href], [tabindex]:not([tabindex='-1'])"
let focusables = []
let previsouslyFocusedElement = null
const modal1 = document.querySelector("#modal1");
const modal2 = document.querySelector("#modal2");
const openModal2 = document.getElementById("openModal2");

/***************ouverture de la modale *****************/

function showModal(target) {
    modal = target;

    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previsouslyFocusedElement = document.querySelector(":focus");

    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.removeAttribute("inert");
    modal.setAttribute("aria-modal", "true");

    focusables[0]?.focus();

    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
}

/***************ouverture modale 1******************** */
function openModal(event) {
    event.preventDefault();
    const selector = event.currentTarget.getAttribute("href");
    const target = document.querySelector(selector);
    showModal(target);
}

/**********ouverture modale 2************************** */

function openModalById(id) {
    const target = document.getElementById(id);
    showModal(target);
}


/***************fermeture de la modale *****************/
function closeModal() {
  if (!modal) return;

  document.activeElement.blur(); // évite l’erreur aria-hidden

  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("inert", "");
  modal.removeAttribute("aria-modal");

  modal.removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);

  if (previsouslyFocusedElement) {
    previsouslyFocusedElement.focus();
  }

  modal = null;
}

function stopPropagation(e) {
  e.stopPropagation ()
}

/*************** GESTION DU FOCUS *************/
function focusInModal(e, modal) {
  if (focusables.length === 0) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

window.addEventListener("keydown", function (e) {
  if (!modal) return; // aucune modale ouverte

  if (e.key === "Escape") {
    e.preventDefault();
    closeModal(); // ferme la modale active
  }

  if (e.key === "Tab") {
    focusInModal(e, modal);
  }
});

/************* LISTENERS GENERAUX *************/
document.addEventListener("DOMContentLoaded", () => {
  const buttonModal = document.querySelectorAll(".js-modal");
    buttonModal.forEach(btn => {
    btn.addEventListener("click", openModal)
  });
});

  /*****************passage de la modale 1 vers la modale 2 */
 /*** Bouton dans la modale 1 pour ouvrir la modale 2 **/
document.getElementById("openModal2").addEventListener("click", () => {
  closeModal();          // ferme modal1
  openModalById("modal2"); // ouvre modal2 proprement
});

/***** retour vers modal2 */
document.querySelector("#modal2 .js-modal-back").addEventListener("click", () => {
  closeModal();          // ferme modal2
  openModalById("modal1"); // rouvre modal1 proprement
});

/******** suppression des travaux dans la modale *************/
async function deleteWork(event, id) {
  event.preventDefault();
  const urlDelete = "http://localhost:5678/api/works/";
  
  try {
    const response = await fetch (urlDelete + id, {
      method:"DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    });

if (!response.ok) {
      throw new Error("Erreur lors de la suppression du projet");
    }
    alert("Le projet a été supprimé avec succés.");

    /*retirer l’élément du DOM après suppression*/
    figure.remove();

    /*Mise à jour de la galerie principale*/
    getData();
   
  } catch (error) {
    console.error(error);
  }
}

/******** visualisation de l'image preview */
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("preview-image");
const containerPhoto = document.getElementById("container-photo");

imageInput.addEventListener("change", function () {
  const file = this.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      previewImage.src = this.result;
      previewImage.style.display = "block";

      /*masque l'icône ou le conteneur vide*/
      containerPhoto.style.display = "none";
    });

    reader.readAsDataURL(file);
  }
});
/* si erreur dans le choix de la photo on reclick sur l'image pour changement*/
previewImage.addEventListener("click", () => {
  imageInput.click();
});


/*****appel api pour recuperer categorie dans formulaire ***/
async function loadCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    setCategoryForm(categories);
  } catch (error) {
    console.error("Erreur chargement catégories :", error);
  }
}
loadCategories();

/*** Remplir selecteur categorie dans form ***/
function setCategoryForm(categories) {

  const sectionCategory = document.querySelector("#category");
  sectionCategory.innerHTML = "";

  categories.forEach(cat=> {
  const optionCategory = document.createElement("option");
  optionCategory.value = cat.id;
  optionCategory.textContent = cat.name;
  /* on ajoute le bouton au container*/
  sectionCategory.appendChild(optionCategory);
  });
}   

 /************************Envoyer des projets **************/
const form = document.querySelector(".add-photo");
const btnValider = document.querySelector(".btn-envoyer");

btnValider.addEventListener("click", async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page
  const image = document.querySelector("#imageInput").files[0];
  const title = document.querySelector("#titleInput").value;
  const category = document.querySelector("#category").value;

  // Validation simple côté client
  if (!image || !title || !category) {
    event.preventDefault(); // Empêche le rechargement de la page
    /*creation message erreur*/
    const errorMsgForm = document.createElement("div");
    errorMsgForm.className = "error-Form"
    errorMsgForm.innerText = "Veuillez remplir tous les champs !";
    form.prepend(errorMsgForm);
    return;
  }

      // Construction du FormData
      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", title);
      formData.append("category", category);

     try {
         // Envoi POST vers l'API
         const response = await fetch("http://localhost:5678/api/works", {
           method: "POST",
           headers: {
             "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: formData
          })
   
          if (!response.ok) {
            throw new Error(`Erreur serveur : ${response.status}`);
          }

        const result = await response.json();
        alert("Le projet a été ajouté avec succés.");

          //reset du formulaire
           form.reset();

        } catch (error) {
      console.error(error);
     }
});

