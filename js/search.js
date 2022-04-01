/*
    - Search Functionality For Cuisine Website
    Author: Yaman Sarabariya & Sajjan Karn
*/

// sets data in datalist of input for search suggestions
window.onload = () => {
  fetchCuisine().then((data) => {
    setAutoSuggestionData("cuisine", data);
  });

  fetchHotel().then((data) => {
    setAutoSuggestionData("hotel", data);
  });

  fetchLocation().then((data) => {
    setAutoSuggestionData("location", data);
  });
};

// renders result after a search query
const search_by_cuisine = document.getElementById("search_by_cuisine");
const search_by_hotel = document.getElementById("search_by_hotel");
const search_by_location = document.getElementById("search_by_location");

search_by_cuisine.addEventListener("keyup", () => {
  if (!search_by_cuisine.value) return;
  if (search_by_cuisine.value.trim().toLowerCase() === "all") {
    renderAllCuisines();
    return;
  }
  searchByCuisine(search_by_cuisine.value.trim());
});

search_by_hotel.addEventListener("keyup", () => {
  if (!search_by_hotel.value) return;
  searchByHotel(search_by_hotel.value.trim());
});

search_by_location.addEventListener("keyup", () => {
  if (!search_by_location.value) return;
  searchByLocation(search_by_location.value.trim());
});

// handlers
async function fetchCuisine() {
  let cuisine = [];
  await fetch("/data/data.json")
    .then((res) => res.json())
    .then((data) => {
      cuisine = data.map((x) => x.name);
    });
  cuisine = [...new Set(cuisine)];
  return cuisine;
}

async function fetchAll() {
  let cuisine = [];
  await fetch("/data/data.json")
    .then((res) => res.json())
    .then((data) => {
      cuisine = data;
    });

  return cuisine;
}

async function fetchLocation() {
  let location = [];
  await fetch("/data/hotel.json")
    .then((res) => res.json())
    .then((data) => {
      location = data.map((x) => x.location);
    });
  location = [...new Set(location)];
  return location;
}

async function fetchHotel() {
  let hotel = [];
  await fetch("/data/hotel.json")
    .then((res) => res.json())
    .then((data) => {
      hotel = data.map((x) => x.name);
    });
  hotel = [...new Set(hotel)];
  return hotel;
}

async function fetchHotelWithLocation() {
  let hotel = [];
  await fetch("/data/hotel.json")
    .then((res) => res.json())
    .then((data) => {
      hotel = data;
    });
  return hotel;
}

function setAutoSuggestionData(id, data) {
  const el = document.getElementById(id);
  data.forEach((x) => {
    el.innerHTML += `<option value="${x}">`;
  });
}

async function searchByCuisine(cuisine) {
  let result = [];
  const result_div = document.getElementById("result");
  result_div.innerHTML = "";
  search_by_hotel.value = "";
  search_by_location.value = "";
  await fetchAll().then((data) => {
    data.forEach((item) => {
      if (item.name == cuisine) {
        result.push(item);
      }
    });
  });

  if (result.length < 1) return;
  renderResult(result);
}

async function searchByHotel(hotel) {
  let result = [];
  const result_div = document.getElementById("result");
  result_div.innerHTML = "";
  search_by_cuisine.value = "";
  search_by_location.value = "";
  await fetchAll().then((data) => {
    data.forEach((item) => {
      let array_of_hotels = item.available_at;
      if (array_of_hotels.includes(hotel)) {
        result.push(item);
      }
    });
  });

  if (result.length < 1) return;
  renderResult(result);
}

async function searchByLocation(location) {
  let hotels = [];
  const result_div = document.getElementById("result");
  result_div.innerHTML = "";
  search_by_hotel.value = "";
  search_by_cuisine.value = "";
  await fetchHotelWithLocation().then((data) => {
    data.forEach((item) => {
      if (item.location === location) {
        hotels.push(item.name);
      }
    });
  });

  console.log(hotels)

  let result = [];
  await fetchAll().then((data) => {
    data.forEach((item, i) => {
        console.log(hotels[0])
      if (item.available_at.includes(hotels[0])) {
          console.log("hit...")
        result.push(item);
      }
    });
  });

  console.log(result)
  if (result.length < 1) return;
  renderResult(result);
}

async function renderAllCuisines() {
  let result = [];
  await fetchAll().then((data) => {
    result = data;
  });
  renderResult(result);
}

function renderResult(result) {
  const result_div = document.getElementById("result");
  result.forEach((item) => {
    result_div.innerHTML += `<div class="card">
      <img src="${item.url}" >
      <p class="food__name">
        <b>${item.name}</b>
      </p>
      <p class="food__price">
        <b>Price: </b><span>${item.price}</span>
      </p>
      <p class="available_at">
        <b>Available At: </b><br><br>
        ${item.available_at}
      </p>
    </div>`;
  });
}
