
function openModal (event) {
    event.preventDefault ();

    const selector = event.currentTarget.getAttribute("href");
    const target = document.querySelector(selector);

    target.style.display ="inline-flex";
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", "true");
}
    // console.log(document.getElementsByClassName("js-modal"))

    document.addEventListener("DOMContentLoaded", () => {
    const buttonModal = document.querySelectorAll(".js-modal");
    buttonModal.forEach(btn => {
      btn.addEventListener("click", openModal)

    });
  });