const manageSpinner = (status) => {
  const spinner = document.getElementById("spinner");
  const plantContainer = document.getElementById("plant-Container");
  if (status) {
    spinner.classList.remove("hidden");
    plantContainer.classList.add("hidden");
  } else {
    plantContainer.classList.remove("hidden");
    spinner.classList.add("hidden");
  }
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

let allPlants = [];
let categories = []; 
let cart = [];

const loadCategory = async () => {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await res.json();
    categories = data.categories; 
    displayCategory(categories);
  } catch (error) {
    console.error("Failed to load categories:", error);
  }
};

const displayCategory = (categories) => {
  const categoryContainer = document.getElementById("category-Container");
  categoryContainer.innerHTML = "";
  categories.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category");
    categoryDiv.innerHTML = `
      <button id="lesson-btn-${category.id}" onclick="loadPlantsByCategory('${category.id}')" class="btn w-[200px] hover:bg-green-600 border-none my-1 bg-[#F0FDF480] hover:text-white lesson">${category.category_name}</button>
    `;
    categoryContainer.appendChild(categoryDiv);
  });
};

const loadPlantsByCategory = (categoryId) => {
  manageSpinner(true);
  
  const categoryName = categories.find(cat => String(cat.id) === String(categoryId))?.category_name;
  
  let filteredPlants = [];
  if (categoryName) {
    filteredPlants = allPlants.filter(plant => plant.category === categoryName);
  }

  displayPlants(filteredPlants);
  
  removeActive();
  const clickBtn = document.getElementById(`lesson-btn-${categoryId}`);
  if (clickBtn) {
    clickBtn.classList.add("active");
  }
  
  manageSpinner(false);
};

const loadSinglePlant = async (plantId) => {
  try {
    const url = `https://openapi.programming-hero.com/api/plant/${plantId}`;
    const res = await fetch(url);
    const data = await res.json();
    displayPlantDetails(data.plants);
  } catch (error) {
    console.error("Failed to load single plant:", error);
  }
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
  document.getElementById("plant_modal").showModal();
};

const displayPlants = (plantsToDisplay) => {
  const plantsContainer = document.getElementById("plant-Container");
  plantsContainer.innerHTML = "";
  plantsToDisplay.forEach((plant) => {
    const plantDiv = document.createElement("div");
    plantDiv.innerHTML = `
      <div class="card w-80 bg-base-100 shadow-xl rounded-xl">
        <figure>
          <img src=${plant.image} alt="${plant.name}" class="rounded-t-xl w-full h-48 object-cover"/>
        </figure>
        <div class="card-body">
          <h2 onclick="loadSinglePlant('${plant.id}')" class="card-title">${plant.name}</h2>
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
            <button onclick="addToCart('${plant.id}')" class="btn btn-success w-full rounded-full">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    plantsContainer.appendChild(plantDiv);
  });
};

const addToCart = (plantId) => {
  const plant = allPlants.find((p) => String(p.id) === String(plantId));
  if (plant) {
    cart.push(plant);
    displayCart();
    alert(`${plant.name} has been added to the cart.`);
  } else {
    alert("Error: Plant not found.");
  }
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
  const totalDiv = document.createElement("div");
  totalDiv.classList.add("cart-total");
  totalDiv.innerHTML = `<div class="font-bold text-right mt-4">Total: ৳${total}</div>`;
  cartContainer.appendChild(totalDiv);
};

const removeFromCart = (plantIdToRemove) => {
  // Use findIndex() to locate the first instance of the plant with the matching ID.
  const indexToRemove = cart.findIndex((plant) => String(plant.id) === String(plantIdToRemove));
  
  // If the plant is found, remove only that one instance.
  if (indexToRemove !== -1) {
    cart.splice(indexToRemove, 1);
    displayCart();
  }
};

const loadAllPlants = async () => {
  manageSpinner(true);
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const data = await res.json();
    allPlants = data.plants;
    displayPlants(allPlants);
  } catch (error) {
    console.error("Failed to load all plants:", error);
  }
  manageSpinner(false);
};

loadAllPlants();
loadCategory();