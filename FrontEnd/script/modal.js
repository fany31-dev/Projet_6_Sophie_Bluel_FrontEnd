/***************variables globales ***************/
let modal = null
const focusableSelector = "button, input, select, textarea, a[href], [tabindex]:not([tabindex='-1'])"
let focusables = []
let previsouslyFocusedElement = null
const modal1 = document.querySelector("#modal1");
const modal2 = document.querySelector("#modal2");
const openModal2 = document.getElementById("openModal2");

/***************ouverture de la modale *****************/
function openModal (event) {
    event.preventDefault ();

    const selector = event.currentTarget.getAttribute("href");
    const target = document.querySelector(selector);
    modal = target;

    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previsouslyFocusedElement = document.querySelector(":focus");

    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.removeAttribute("inert");
    modal.setAttribute("aria-modal", "true");

    focusables[0]?.focus();

    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
}

/***************ouverture avec id *****************/
function openModalById(id) {
  const target = document.getElementById(id);
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
