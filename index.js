document.addEventListener("DOMContentLoaded", () => {
  const startSection = document.querySelector(".start");
  const calculatorEN = document.querySelector(".calculator-en");
  const calculatorFR = document.querySelector(".calculator-fr");
  const startButtonEN = document.querySelector(".start-en button");
  const startButtonFR = document.querySelector(".start-fr button");
  const closeButtons = document.querySelectorAll(".close-button");

  let inactivityTimer;

  function showCalculator(lang) {
    startSection.style.display = "none";
    if (lang === "en") {
      calculatorEN.style.display = "block";
      calculatorFR.style.display = "none";
    } else {
      calculatorFR.style.display = "block";
      calculatorEN.style.display = "none";
    }
    resetInactivityTimer();
  }

  function showStart() {
    startSection.style.display = "flex";
    calculatorEN.style.display = "none";
    calculatorFR.style.display = "none";
    resetCalculator();
    clearTimeout(inactivityTimer);
  }

  function resetCalculator() {
    // Reset calculator values here
    // For example:
    // document.getElementById('calculatorInput').value = '';
    // document.getElementById('calculatorResult').textContent = '';
  }

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(showStart, 120000); // 2 minutes
  }

  startButtonEN.addEventListener("click", () => showCalculator("en"));
  startButtonFR.addEventListener("click", () => showCalculator("fr"));

  closeButtons.forEach((button) => {
    button.addEventListener("click", showStart);
  });

  document.addEventListener("mousemove", resetInactivityTimer);
  document.addEventListener("keypress", resetInactivityTimer);
});
