const appState = {
  allPlants: [],  
  categories: [], 
  cart: [],       
};
const manageUI = (showSpinner) => {
  const spinner = document.getElementById("spinner");
  const plantContainer = document.getElementById("plant-Container");

  if (showSpinner) {
    spinner.classList.remove("hidden");
    plantContainer.classList.add("hidden");
  } else {
    spinner.classList.add("hidden");
    plantContainer.classList.remove("hidden");
  }
};
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to get data from URL. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Oops! Something went wrong while fetching data:", error);
    return null;
  }
};
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("category-Container");
  categoryContainer.innerHTML = ""; 

  categories.forEach((category) => {
    const buttonDiv = document.createElement('div');
    buttonDiv.innerHTML = `
      <button 
        id="lesson-btn-${category.id}" 
        onclick="loadPlantsByCategory(${category.id})" 
        class="btn w-[200px] hover:bg-green-600 border-none my-1 bg-[#F0FDF480] hover:text-white lesson">
        ${category.category_name}
      </button>`;
    
    categoryContainer.appendChild(buttonDiv.firstElementChild);
  });
};
const displayPlants = (plants) => {
  const plantsContainer = document.getElementById("plant-Container");
  plantsContainer.innerHTML = ""; 

  plants.forEach((plant) => {
    const plantCard = document.createElement("div");
    plantCard.innerHTML = `
      <div class="card w-80 bg-base-100 shadow-xl rounded-xl">
        <figure>
          <img src=${plant.image} alt="${plant.name}" class="rounded-t-xl w-full h-48 object-cover"/>
        </figure>
        <div class="card-body">
          <h2 onclick="loadSinglePlant(${plant.id})" class="card-title">${plant.name}</h2>
          <p>${plant.description?.slice(0, 100) || "No description available."}...</p>
          <div class="flex items-center justify-between mt-3">
            <div class="badge badge-success badge-outline">${plant.category}</div>
            <span class="text-lg font-bold text-green-700">৳${plant.price}</span>
          </div>
          <div class="card-actions mt-4">
            <button onclick="addToCart(${plant.id})" class="btn btn-success w-full rounded-full">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    plantsContainer.appendChild(plantCard.firstElementChild);
  });
};
const displayPlantDetails = (plant) => {
  const modalContent = document.getElementById("details-container");
  modalContent.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">${plant.name}</h2>
    <img src="${plant.image}" alt="${plant.name}" class="w-full h-64 object-cover mb-4 rounded-lg"/>
    <p class="mb-2"><strong>Category:</strong> ${plant.category}</p>
    <p class="mb-2"><strong>Price:</strong> ৳${plant.price}</p>
    <p class="mb-2"><strong>Description:</strong> ${plant.description || "No description available."}</p>
  `;
  document.getElementById("plant_modal").showModal();
};
const displayCart = () => {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = ""; 
  let total = 0;

  appState.cart.forEach((plant) => {
    total += Number(plant.price);
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
      <div class="flex justify-between items-center bg-white pl-6 py-2">
        <div>
          <p class="font-bold text-xl">${plant.name}</p>
          <p>৳${plant.price}</p>
        </div>
        <span onclick="removeFromCart(${plant.id})" class="cursor-pointer">❌</span>
      </div>
    `;
    cartContainer.appendChild(itemDiv);
  });
  
  const totalDiv = document.createElement("div");
  totalDiv.classList.add("cart-total");
  totalDiv.innerHTML = `<div class="font-bold text-right mt-4">Total: ৳${total}</div>`;
  cartContainer.appendChild(totalDiv);
};
const loadPlantsByCategory = (categoryId) => {
  manageUI(true); 
  
  const categoryName = appState.categories.find(cat => String(cat.id) === String(categoryId))?.category_name;
  
  const filteredPlants = categoryName ? appState.allPlants.filter(plant => plant.category === categoryName) : appState.allPlants;
  
  document.querySelectorAll(".lesson").forEach(btn => btn.classList.remove("active"));
  const clickedBtn = document.getElementById(`lesson-btn-${categoryId}`);
  if (clickedBtn) {
    clickedBtn.classList.add("active");
  }

  displayPlants(filteredPlants);
  manageUI(false);
};
const loadSinglePlant = async (plantId) => {
  const data = await fetchData(`https://openapi.programming-hero.com/api/plant/${plantId}`);
  if (data && data.plants) {
    displayPlantDetails(data.plants);
  }
};
const addToCart = (plantId) => {
  const plant = appState.allPlants.find(p => String(p.id) === String(plantId));
  if (plant) {
    appState.cart.push(plant);
    displayCart();
    alert(`${plant.name} has been added to the cart.`);
  } else {
    alert("Error: Plant not found.");
  }
};
const removeFromCart = (plantIdToRemove) => {
  const index = appState.cart.findIndex(plant => String(plant.id) === String(plantIdToRemove));
  if (index !== -1) {
    appState.cart.splice(index, 1);
    displayCart();
  }
};
const initializeApp = async () => {
  manageUI(true); 
  const plantsData = await fetchData("https://openapi.programming-hero.com/api/plants");
  if (plantsData) {
    appState.allPlants = plantsData.plants;
    displayPlants(appState.allPlants);
  }
  const categoriesData = await fetchData("https://openapi.programming-hero.com/api/categories");
  if (categoriesData) {
    appState.categories = categoriesData.categories;
    displayCategories(appState.categories);
  }

  manageUI(false); 
};

initializeApp();