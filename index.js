document.addEventListener("DOMContentLoaded", () => {
  const startSection = document.querySelector(".start");
  const startButtonEN = document.querySelector(".start-en button");
  const startButtonFR = document.querySelector(".start-fr button");

  const calculatorEN = document.querySelector(".calculator-en");
  const calculatorFR = document.querySelector(".calculator-fr");

  const closeButtons = document.querySelectorAll(".close-button");

  const calculateButtonEn = document.getElementById("calculate-button-en");
  const calculateButtonFr = document.getElementById("calculate-button-fr");

  const resetButtonEn = document.getElementById("reset-button-en");
  const resetButtonFr = document.getElementById("reset-button-fr");

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

  function calculate(lang) {
    const city = document.getElementById("city-select-" + lang);
    const sqft = document.getElementById("sqft-input-" + lang);

    const formatter = new Intl.NumberFormat(lang, {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    if (!city.value || !sqft.value) {
      return;
    }

    // set km's based on nearest shippping location
    if (city.value === "vancouver") {
      distance_qz = 1160;
      distance_wool = 523;
    } else if (city.value === "calgary") {
      distance_qz = 300;
      distance_wool = 702;
    } else if (city.value === "regina") {
      distance_qz = 781;
      distance_wool = 1245;
    } else if (city.value === "winnipeg") {
      distance_qz = 1307;
      distance_wool = 1821;
    } else if (city.value === "toronto") {
      distance_qz = 30;
      distance_wool = 54;
    } else if (city.value === "montreal") {
      distance_qz = 532;
      distance_wool = 610;
    } else if (city.value === "fredericton") {
      distance_qz = 1340;
      distance_wool = 1416;
    } else if (city.value === "halifax") {
      distance_qz = 1769;
      distance_wool = 1845;
    } else {
      distance_qz = 0;
      distance_wool = 0;
    }

    // calculate bags of wool and qz
    setBagsOfInsulation(
      Math.round(parseInt(sqft.value) / 128),
      Math.round(parseInt(sqft.value) / 65),
      formatter
    );

    // calculate pounds of fiber
    setPoundsOfFiber(
      Math.round(parseInt(sqft.value) * 0.23),
      Math.round(parseInt(sqft.value) * 0.73),
      formatter
    );

    // calculate tons of fiber
    setTonsOfFiber(
      (Math.round(parseInt(sqft.value) * 0.23) / 2200).toFixed(2),
      (Math.round(parseInt(sqft.value) * 0.73) / 2200).toFixed(2),
      formatter
    );

    // calculate co2 emissions
    setCo2Emissions(
      (
        Math.ceil(parseInt(sqft.value) / 92160) *
        ((distance_qz * 1.07) / 1000)
      ).toFixed(2),
      (
        Math.ceil(parseInt(sqft.value) / 16536) *
        ((distance_wool * 1.07) / 1000)
      ).toFixed(2),
      formatter
    );

    // calculate litres of gas
    setLitresOfGas(
      Math.round(
        parseFloat(
          Math.ceil(parseInt(sqft.value) / 92160) *
            ((distance_qz * 1.07) / 1000) *
            426
        )
      ).toFixed(2),
      Math.round(
        Math.ceil(parseInt(sqft.value) / 16536) *
          ((distance_wool * 1.07) / 1000) *
          426
      ).toFixed(2),
      formatter
    );
  }

  function setBagsOfInsulation(bagsofqz, bagsofwool, formatter) {
    document.querySelectorAll(".fibergas_bags").forEach((element) => {
      element.textContent = formatter.format(bagsofqz);
    });
    document.querySelectorAll(".mineral_wool_bags").forEach((element) => {
      element.textContent = formatter.format(bagsofwool);
    });
    document
      .querySelectorAll(".environmental_bags_saved")
      .forEach((element) => {
        element.innerHTML = formatter.format(Math.abs(bagsofqz - bagsofwool));
      });
  }

  function setPoundsOfFiber(lbsfiberqz, lbsfiberwool, formatter) {
    document.querySelectorAll(".fibergas_pounds").forEach((element) => {
      element.textContent = formatter.format(lbsfiberqz);
    });
    document.querySelectorAll(".mineral_wool_pounds").forEach((element) => {
      element.textContent = formatter.format(lbsfiberwool);
    });
    document.querySelectorAll(".environmental_pounds").forEach((element) => {
      element.innerHTML = formatter.format(Math.abs(lbsfiberqz - lbsfiberwool));
    });
    document.querySelectorAll(".environmental_bears").forEach((element) => {
      element.innerHTML = formatter.format(
        Math.round(Math.abs(lbsfiberqz - lbsfiberwool) / 300)
      );
    });
  }

  function setTonsOfFiber(tonsfiberqz, tonsfiberwool, formatter) {
    document.querySelectorAll(".fibergas_tons").forEach((element) => {
      element.textContent = formatter.format(tonsfiberqz);
    });
    document.querySelectorAll(".mineral_wool_tons").forEach((element) => {
      element.textContent = formatter.format(tonsfiberwool);
    });
    document.querySelectorAll(".environmental_tons").forEach((element) => {
      element.innerHTML = formatter.format(
        Math.abs(tonsfiberqz - tonsfiberwool).toFixed(2)
      );
    });
    document.querySelectorAll(".environmental_moose").forEach((element) => {
      element.innerHTML = formatter.format(
        Math.round(Math.abs(tonsfiberqz - tonsfiberwool))
      );
    });
  }

  function setCo2Emissions(co2emitqz, co2emitwool, formatter) {
    document.querySelectorAll(".fibergas_co2").forEach((element) => {
      element.textContent = formatter.format(co2emitqz);
    });
    document.querySelectorAll(".mineral_wool_co2").forEach((element) => {
      element.textContent = formatter.format(co2emitwool);
    });
    document.querySelectorAll(".environmental_co2").forEach((element) => {
      element.innerHTML = formatter.format(
        Math.abs(co2emitqz - co2emitwool).toFixed(2)
      );
    });
  }

  function setLitresOfGas(litresofgasqz, litresofgaswool, formatter) {
    document.querySelectorAll(".environmental_gasoline").forEach((element) => {
      element.innerHTML = formatter.format(
        Math.round(Math.abs(litresofgasqz - litresofgaswool))
      );
    });
  }

  function resetCalculator() {
    document.getElementById("city-select-en").value = "";
    document.getElementById("city-select-fr").value = "";
    document.getElementById("sqft-input-en").value = "";
    document.getElementById("sqft-input-fr").value = "";

    const fieldsToReset = [
      ".fibergas_bags",
      ".mineral_wool_bags",
      ".environmental_bags_saved",
      ".fibergas_pounds",
      ".mineral_wool_pounds",
      ".environmental_pounds",
      ".environmental_bears",
      ".fibergas_tons",
      ".mineral_wool_tons",
      ".environmental_tons",
      ".environmental_moose",
      ".fibergas_co2",
      ".mineral_wool_co2",
      ".environmental_co2",
      ".environmental_gasoline",
    ];

    fieldsToReset.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.textContent = "0";
      });
    });
  }

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(showStart, 120000); // 2 minutes
  }

  // Register event listeners
  calculateButtonEn.addEventListener("click", () => calculate("en"));
  calculateButtonFr.addEventListener("click", () => calculate("fr"));

  // Show the start section when the page loads
  startButtonEN.addEventListener("click", () => showCalculator("en"));
  startButtonFR.addEventListener("click", () => showCalculator("fr"));
  resetButtonEn.addEventListener("click", resetCalculator);
  resetButtonFr.addEventListener("click", resetCalculator);

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showStart();
      resetCalculator();
    });
  });

  document.addEventListener("mousemove", resetInactivityTimer);
  document.addEventListener("keypress", resetInactivityTimer);
});
