
let modal = null

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

// console.log(document.getElementsByClassName("js-modal"))

    document.addEventListener("DOMContentLoaded", () => {
    const buttonModal = document.querySelectorAll(".js-modal");
    buttonModal.forEach(btn => {
      btn.addEventListener("click", openModal)

    });
  });