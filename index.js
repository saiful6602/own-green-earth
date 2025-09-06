// https://openapi.programming-hero.com/api/plants
// https://openapi.programming-hero.com/api/plants/mango
// https://openapi.programming-hero.com/api/plant/1
// https://openapi.programming-hero.com/api/categories
// https://openapi.programming-hero.com/api/category/1

const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("plant-Container").classList.add("hidden");
  } else {
    document.getElementById("plant-Container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

const loadCategory = async () => {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/categories"
  );
  const data = await res.json();
  console.log(data.categories);

  displayCategory(data.categories);
};

const displayCategory = (categories) => {
  const categoryContainer = document.getElementById("category-Container");
  categoryContainer.innerHTML = "";

  categories.forEach((category) => {
    // console.log(category);
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category");
    categoryDiv.innerHTML = `
      <button id="lesson-btn-${category.id}" onclick="loadPlantsByCategory('${category.id}')" class="btn w-[200px] hover:bg-green-600 border-none my-1 bg-[#F0FDF480] hover:text-white  lesson">${category.category_name}</button>
    `;
    categoryContainer.appendChild(categoryDiv);
  });
};
let plants;
const loadPlantsByCategory = async (categoryId) => {
  console.log("Category ID:", categoryId);

  manageSpinner(true);

  const url = `https://openapi.programming-hero.com/api/category/${categoryId}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);

  //   plants = data.plants.filter((plant) => plant.category === categoryId);
  //   console.log(plants);

  removeActive(); // remove all active class
  const clickBtn = document.getElementById(`lesson-btn-${categoryId}`);
  clickBtn.classList.add("active"); // add active class
  displayPlants(data.plants);

  manageSpinner(false);
};

const loadSinglePlant = async (plantId) => {
  console.log("Plant ID:", plantId);
  const url = `https://openapi.programming-hero.com/api/plant/${plantId}`;
  const res = await fetch(url);
  const data = await res.json();
  displayPlantDetails(data.plants);
};

const displayPlantDetails = (plant) => {
  const modalContent = document.getElementById("details-container");
  modalContent.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">${plant.name}</h2>
            <img src="${plant.image}" alt="${
    plant.name
  }" class="w-full h-64 object-cover mb-4 rounded-lg"/>
            <p class="mb-2"><strong>Category:</strong> ${plant.category}</p>
            <p class="mb-2"><strong>Price:</strong> ৳${plant.price}</p>
            <p class="mb-2"><strong>Description:</strong> ${
    plant.description || "No description available."
  }</p>
        `;
  // Show the modal
  document.getElementById("plant_modal").showModal();
};

const displayPlants = (plants) => {
  const plantsContainer = document.getElementById("plant-Container");

  plantsContainer.innerHTML = "";

  plants.forEach((plant) => {
    console.log(plant);
    const plantDiv = document.createElement("div");

    plantDiv.innerHTML = `
    <div  class="card w-80 bg-base-100 shadow-xl  rounded-xl">
  <figure>
    <img
      src=${plant.image}
      alt="${plant.name}"
      class="rounded-t-xl w-full h-48 object-cover"
    />
  </figure>
  <div class="card-body">
    <h2 onclick="loadSinglePlant('${plant.id}')" class="card-title">${
      plant.name
    }</h2>
    <p>
          ${
        plant.description
          ? plant.description.slice(0, 100) + "..."
          : "No description available."
      }
    </p>
    <div class="flex items-center justify-between mt-3">
      <div class="badge badge-success badge-outline">${plant.category}</div>
      <span class="text-lg font-bold text-green-700">৳${plant.price}</span>
    </div>
    <div class="card-actions mt-4">
      <button onclick="addToCart('${
        plant.id
      }')" class="btn btn-success w-full rounded-full">Add to Cart</button>
    </div>
  </div>
</div>

      `;
    plantsContainer.appendChild(plantDiv);
  });
  manageSpinner(false);
};

let cart = [];
const addToCart = (plantId) => {
  console.log("Plant ID:", plantId);

  fetch(`https://openapi.programming-hero.com/api/plants`)
    .then((res) => res.json())
    .then((data) => {
      plants = data.plants;
      console.log(plants);

      const plant = plants.find((p) => String(p.id) === String(plantId));
      console.log(plant);
      if (plant) {
        cart.push(plant);
        console.log("Cart:", cart);
        displayCart();
        alert(`${plant.name} has been added to the cart.`);
      } else {
        console.error("Plant not found for ID:", plantId);
        alert("Error: Plant not found.");
      }
    });
};
const displayCart = () => {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";
  let total = 0;
  cart.forEach((plant) => {
    total += Number(plant.price);
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
      <div class="flex justify-between items-center bg-white pl-6 py-2">
       <div>
       <p class="font-bold text-xl">${plant.name}</p>
       <p>৳${plant.price}</p>
     </div>
       <span onclick="removeFromCart('${plant.id}')" class="cursor-pointer">❌</span>
      </div>
    `;
    cartContainer.appendChild(itemDiv);
  });
  // Show total amount
  const totalDiv = document.createElement("div");
  totalDiv.classList.add("cart-total");
  totalDiv.innerHTML = `<div class="font-bold text-right mt-4">Total: ৳${total}</div>`;
  cartContainer.appendChild(totalDiv);
};
const removeFromCart = (plantId) => {
  cart = cart.filter((plant) => String(plant.id) !== String(plantId));
  displayCart();
};
// Show all plants by default on page load
const loadAllPlants = async () => {
  const res = await fetch("https://openapi.programming-hero.com/api/plants");
  const data = await res.json();
  displayPlants(data.plants);
};

loadAllPlants();
loadCategory();