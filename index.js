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

  const citySelectEn = document.getElementById("city-select-en");
  const citySelectFr = document.getElementById("city-select-fr");

  const sqftInputEn = document.getElementById("sqft-input-en");
  const sqftInputFr = document.getElementById("sqft-input-fr");

  const tooltipStartEn = document.getElementById("tooltip_start_en");
  const tooltipInputEn = document.getElementById("tooltip_input_en");
  const tooltipCalculateEn = document.getElementById("tooltip_calculate_en");

  const tooltipStartFr = document.getElementById("tooltip_start_fr");
  const tooltipInputFr = document.getElementById("tooltip_input_fr");
  const tooltipCalculateFr = document.getElementById("tooltip_calculate_fr");

  let inactivityTimer;

  handleTooltipFlow();

  function showCalculator(lang) {
    startSection.style.display = "none";
    if (lang === "en") {
      calculatorEN.style.display = "block";
      calculatorFR.style.display = "none";
      startTooltips("en");
      showOverlays("en");
    } else {
      calculatorFR.style.display = "block";
      calculatorEN.style.display = "none";
      startTooltips("fr");
      showOverlays("fr");
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
    hideTooltips();
    hideOverlays(lang);
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

    setCostSavings(sqft.value, 1.23, formatter);
  }

  function showOverlays(lang) {
    const calculator = lang === "en" ? calculatorEN : calculatorFR;
    const cells = calculator.querySelectorAll(".calculator-cell");
    cells.forEach((cell, index) => {
      if (
        !(
          cell.parentElement.classList.contains("calculator-row") &&
          cell.parentElement ===
            cell.parentElement.parentElement.firstElementChild &&
          (index === 1 || index === 2)
        )
      ) {
        cell.classList.add("overlay");
      }
    });
  }

  function hideOverlays(lang) {
    const calculator = lang === "en" ? calculatorEN : calculatorFR;
    const cells = calculator.querySelectorAll(".calculator-cell");
    cells.forEach((cell) => {
      cell.classList.remove("overlay");
    });
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

  function setCostSavings(projectSize, savingsFactor, formatter) {
    document
      .querySelectorAll(".environmental_cost_savings")
      .forEach((element) => {
        const amount = Math.round(Math.abs(projectSize * savingsFactor));
        const isFrench = formatter.resolvedOptions().locale === "fr";

        if (isFrench) {
          element.innerHTML = `${formatter.format(amount)} $`;
        } else {
          element.innerHTML = `$${formatter.format(amount)}`;
        }
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
      ".environmental_cost_savings",
    ];

    fieldsToReset.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.textContent = "0";
      });
    });

    hasSelectedCity = false;
    hasInteractedWithInput = false;
    hasShownInputTooltip = false;
    hasShownCalculateTooltip = false;

    if (inputTimeout) {
      clearTimeout(inputTimeout);
    }

    const lang = calculatorEN.style.display === "block" ? "en" : "fr";
    showOverlays(lang);
    startTooltips(lang);
  }

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(showStart, 120000); // 2 minutes
  }

  let hasSelectedCity = false;
  let hasInteractedWithInput = false;
  let inputTimeout;
  let hasShownInputTooltip = false;
  let hasShownCalculateTooltip = false;

  function showTooltip(tooltip) {
    tooltip.style.display = "flex";
    void tooltip.offsetWidth;
    tooltip.classList.add("visible");
  }

  function hideTooltip(tooltip) {
    tooltip.classList.remove("visible");
    setTimeout(() => {
      if (!tooltip.classList.contains("visible")) {
        tooltip.style.display = "none";
      }
    }, 300);
  }

  function startTooltips(lang) {
    const tooltips =
      lang === "en"
        ? {
            start: tooltipStartEn,
            input: tooltipInputEn,
            calculate: tooltipCalculateEn,
          }
        : {
            start: tooltipStartFr,
            input: tooltipInputFr,
            calculate: tooltipCalculateFr,
          };

    showTooltip(tooltips.start);
    hideTooltip(tooltips.input);
    hideTooltip(tooltips.calculate);

    hasSelectedCity = false;
    hasInteractedWithInput = false;
    hasShownInputTooltip = false;
    hasShownCalculateTooltip = false;

    if (inputTimeout) {
      clearTimeout(inputTimeout);
    }
  }

  function handleTooltipFlow() {
    setupLanguageTooltips("en", {
      select: citySelectEn,
      input: sqftInputEn,
      calculate: calculateButtonEn,
      tooltips: {
        start: tooltipStartEn,
        input: tooltipInputEn,
        calculate: tooltipCalculateEn,
      },
    });

    setupLanguageTooltips("fr", {
      select: citySelectFr,
      input: sqftInputFr,
      calculate: calculateButtonFr,
      tooltips: {
        start: tooltipStartFr,
        input: tooltipInputFr,
        calculate: tooltipCalculateFr,
      },
    });
  }

  function setupLanguageTooltips(lang, elements) {
    const { select, input, calculate, tooltips } = elements;

    select.addEventListener("click", () => {
      hideTooltip(tooltips.start);
    });

    select.addEventListener("change", () => {
      tooltips.start.style.display = "none";
      tooltips.input.style.display = "none";

      if (!hasShownCalculateTooltip) {
        hideTooltip(tooltips.calculate);
      }

      if (select.value) {
        hasSelectedCity = true;
        if (!hasShownInputTooltip) {
          showTooltip(tooltips.input);
          hasShownInputTooltip = true;
        }

        if (inputTimeout) {
          clearTimeout(inputTimeout);
        }
      } else {
        hasSelectedCity = false;
      }
    });

    input.addEventListener("focus", () => {
      if (hasSelectedCity) {
        hideTooltip(tooltips.input);
        hasInteractedWithInput = true;
      }
    });

    input.addEventListener("input", () => {
      if (hasSelectedCity && hasInteractedWithInput) {
        if (inputTimeout) clearTimeout(inputTimeout);
        hideTooltip(tooltips.calculate);

        inputTimeout = setTimeout(() => {
          if (input.value && !hasShownCalculateTooltip) {
            showTooltip(tooltips.calculate);
            hasShownCalculateTooltip = true;
          }
        }, 3000);
      }
    });

    input.addEventListener("blur", () => {
      if (
        hasSelectedCity &&
        hasInteractedWithInput &&
        input.value &&
        !hasShownCalculateTooltip
      ) {
        showTooltip(tooltips.calculate);
        hasShownCalculateTooltip = true;
      }
    });

    calculate.addEventListener("click", () => {
      hideTooltip(tooltips.start);
      hideTooltip(tooltips.input);
      hideTooltip(tooltips.calculate);
    });
  }

  function hideTooltips() {
    [
      tooltipStartEn,
      tooltipInputEn,
      tooltipCalculateEn,
      tooltipStartFr,
      tooltipInputFr,
      tooltipCalculateFr,
    ].forEach((tooltip) => {
      tooltip.style.display = "none";
      tooltip.classList.remove("visible");
    });
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
