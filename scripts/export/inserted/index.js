const counterButton = document.querySelector("[data-counter]");

if (counterButton) {
  let count = 0;
  const counter = counterButton.querySelector("span");
  counterButton.addEventListener("click", () => {
    count += 1;
    counter.textContent = String(count);
  });
}
