
let modal = null

/***************creation des elements figure dans la modale *****************/
function setFigureModal (works) {

  const sectionModal = document.querySelector(".modal-photo-gallery")

  works.forEach(work=> {
    const figureModal = document.createElement("figure");

    /* creation image*/
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    imageElement.className = "projet-modal";

    // /* creation poubelle */
    const btnDelete = document.createElement("button");
    btnDelete.className = "supp-projet";
    btnDelete.innerHTML ='<i class="fa-solid fa-trash-can"></i>';

    /*Ajout dans gallery et figure*/
    figureModal.appendChild(imageElement);
    figureModal.appendChild(btnDelete);
    sectionModal.appendChild(figureModal);
  });
}

/***************ouverture de la modale *****************/
function openModal (event) {
    event.preventDefault ();
    const selector = event.currentTarget.getAttribute("href");
    const target = document.querySelector(selector);
    target.style.display =null;
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", "true");
    modal = target
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
}

/***************fermeture de la modale *****************/
function closeModal (event) {
  if (modal === null) return
    event.preventDefault ();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
    modal = null
}

function stopPropagation(e) {
  e.stopPropagation ()
}

document.addEventListener("DOMContentLoaded", () => {
  const buttonModal = document.querySelectorAll(".js-modal");
    buttonModal.forEach(btn => {
    btn.addEventListener("click", openModal)
  });
});

window.addEventListener("keydown", function (e) {
  if(e.key === "Escape" || e.key === "Esc") {
    closeModal (e)
  }
})