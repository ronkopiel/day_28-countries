"use strict";
const cardContainer = document.getElementById("card-container");
const searchInput = document.getElementById("search");
let countries = [];
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  countries.forEach((country) => {
    const isVisible = country.name.toLowerCase().includes(value);
    country.element.classList.toggle("hide", !isVisible);
  });
});
document.addEventListener("click", (e) => {
  if (e.target.className == "region-filter") {
    const value = e.target.textContent.toLowerCase();
    if (value == "all") {
      countries.forEach((country) => {
        country.element.classList.remove("hide");
      });
    } else {
      countries.forEach((country) => {
        const isVisible = country.region.toLowerCase().includes(value);
        country.element.classList.toggle("hide", !isVisible);
      });
    }
    const regiondDisplay = document.getElementsByClassName("regions")[0];
    regiondDisplay.classList.toggle("hide");
    const header = document.getElementsByClassName("dropdown-header")[0];
    header.textContent = e.target.textContent;
    return;
  }
  if (e.target.id == "dropdown-button") {
    e.target.nextElementSibling.classList.toggle("hide");
    return;
  }
  if (e.target.className == "arrow") {
    e.target.parentElement.nextElementSibling.classList.toggle("hide");
    return;
  }
  if (e.target.className == "dropdown-header") {
    e.target.parentElement.nextElementSibling.classList.toggle("hide");
    return;
  } else {
    const regiondDisplay = document.getElementsByClassName("regions")[0];
    regiondDisplay.classList.add("hide");
    return;
  }
});

const getAPI = async () => {
  try {
    const api = await axios.get("https://restcountries.com/v3.1/all");
    return api;
  } catch (err) {
    console.error(err);
  }
};
const makeCountryCard = async () => {
  const api = await getAPI();
  countries = api.data.map((country) => {
    const countryCard = document.createElement("div");
    const countryName = document.createElement("div");
    const capital = document.createElement("span");
    const population = document.createElement("span");
    const region = document.createElement("span");
    const flag = document.createElement("img");
    const regionContainer = document.createElement("div");
    const populationConatainer = document.createElement("div");
    const capitalContainer = document.createElement("div");
    const infoContainer = document.createElement("div");
    countryCard.className = "country-card";
    countryName.className = "country-name";
    infoContainer.className = "info-container";
    regionContainer.className = "description";
    populationConatainer.className = "description";
    capitalContainer.className = "description";
    regionContainer.innerText = "Region: ";
    populationConatainer.innerText = "Population: ";
    capitalContainer.innerText = "Capital: ";
    flag.src = country.flags.svg;
    flag.className = "flag";
    region.innerText = country.region;
    population.innerText = populationHypenated(country.population);
    capital.innerText =
      typeof country.capital != "undefined" ? country.capital : "No Capital";
    countryName.innerText = country.name.common;
    populationConatainer.appendChild(population);
    regionContainer.appendChild(region);
    capitalContainer.appendChild(capital);
    countryCard.appendChild(flag);
    infoContainer.appendChild(countryName);
    infoContainer.appendChild(populationConatainer);
    infoContainer.appendChild(regionContainer);
    infoContainer.appendChild(capitalContainer);
    countryCard.appendChild(infoContainer);
    cardContainer.appendChild(countryCard);
    return {
      name: country.name.common,
      region: country.region,
      element: countryCard,
    };
  });
};
makeCountryCard();
const populationHypenated = (number) => {
  let str = "";
  while (number % 1000 !== number) {
    if (number % 1000 === 0) {
      str = ",000" + str;
      number = Math.floor(number / 1000);
    } else if (number % 1000 == number % 100) {
      str = ",0" + (number % 1000).toString() + str;
      number = Math.floor(number / 1000);
    } else if (number % 1000 == number % 10) {
      str = ",00" + (number % 1000).toString() + str;
      number = Math.floor(number / 1000);
    } else {
      str = "," + (number % 1000).toString() + str;
      number = Math.floor(number / 1000);
    }
  }
  str = (number % 1000).toString() + str;
  return str;
};
