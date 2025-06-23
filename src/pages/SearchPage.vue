<template>
  <div class="container mt-4">
    <!-- Search Bar -->
    <div class="form-group mb-3">
      <input v-model="searchQuery" type="text" class="form-control" placeholder="Search for a recipe..." />
    </div>

    <!-- Filters -->
    <div class="row mb-3">
      <div class="col-md-3">
        <select v-model="selectedCuisine" class="form-control">
          <option value="">All Cuisines</option>
          <option v-for="c in cuisines" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <select v-model="selectedDiet" class="form-control">
          <option value="">All Diets</option>
          <option v-for="d in diets" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <select v-model="selectedIntolerance" class="form-control">
          <option value="">No Intolerances</option>
          <option v-for="i in intolerances" :key="i" :value="i">{{ i }}</option>
        </select>
      </div>
      <div class="col-md-3 d-flex">
        <select v-model="selectedNumber" class="form-control me-2">
          <option value="5">5 results</option>
          <option value="10">10 results</option>
          <option value="15">15 results</option>
        </select>
        <select v-model="selectedSort" class="form-control">
          <option value="">No Sort</option>
          <option value="prep-asc">Ascending preparation time</option>
          <option value="prep-desc">Descending preparation time</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>
    </div>

    <!-- Search and clear Button -->
    <div class="text-center mb-4 d-flex justify-content-center gap-3">
      <button class="btn btn-primary" @click="searchRecipes">Search</button>
      <button class="btn btn-secondary" @click="clearSearch">Clear Search</button>
    </div>


    <!-- Results -->
    <RecipePreviewList :recipes="recipes" v-if="recipes.length" />

    <!-- No Results Message -->
    <div v-else-if="searched" class="alert alert-warning text-center">
      No recipes found for the given search parameters.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import RecipePreviewList from '@/components/RecipePreviewList.vue';
import cuisinesData from '@/assets/cuisines.js';
import dietsData from '@/assets/diets.js';
import intolerancesData from '@/assets/intolerances.js';
import axios from 'axios';
import store from '@/store';

// State Variables
const searchQuery = ref('');
const selectedCuisine = ref('');
const selectedDiet = ref('');
const selectedIntolerance = ref('');
const selectedNumber = ref('5');
const selectedSort = ref('');
const recipes = ref([]);
const searched = ref(false);

// Dropdown Data
const cuisines = ref(cuisinesData);
const diets = ref(dietsData);
const intolerances = ref(intolerancesData);


// Save last search to localStorage
const saveLastSearch = () => {
  const lastSearch = {
    searchQuery: searchQuery.value,
    selectedCuisine: selectedCuisine.value,
    selectedDiet: selectedDiet.value,
    selectedIntolerance: selectedIntolerance.value,
    selectedNumber: selectedNumber.value,
    selectedSort: selectedSort.value,
  };
  localStorage.setItem('lastSearch', JSON.stringify(lastSearch));
};

// Load last search if exists
const loadLastSearch = async () => {
  const saved = localStorage.getItem('lastSearch');
  if (saved && store.username) {
    const lastSearch = JSON.parse(saved);
    searchQuery.value = lastSearch.searchQuery || '';
    selectedCuisine.value = lastSearch.selectedCuisine || '';
    selectedDiet.value = lastSearch.selectedDiet || '';
    selectedIntolerance.value = lastSearch.selectedIntolerance || '';
    selectedNumber.value = lastSearch.selectedNumber || '5';
    selectedSort.value = lastSearch.selectedSort || '';
    await searchRecipes(); // auto-run search
  }
};

// Search recipes
// const searchRecipes = async () => {
//   try {
    
//     const response = await axios.get(`${store.server_domain}/recipes/search`, {
//       params: {
//         recipeName: searchQuery.value,
//         cuisine: selectedCuisine.value,
//         diet: selectedDiet.value,
//         intolerance: selectedIntolerance.value,
//         number: selectedNumber.value,
//         sort: selectedSort.value,
//       }
//     });
//     recipes.value = response.data;
//     searched.value = true;
//     saveLastSearch(); // save search params
//   } catch (err) {
//     if (err.response?.status === 404) {
//       recipes.value = [];
//     } else {
//       console.error("Error searching recipes:", err);
//     }
//     searched.value = true;
//     saveLastSearch(); // save even if not found
//   }
// };

const searchRecipes = async () => {
  try {
    const backendSort = selectedSort.value === "popularity" ? "popularity" : "";

    const response = await axios.get(`${store.server_domain}/recipes/search`, {
      params: {
        recipeName: searchQuery.value,
        cuisine: selectedCuisine.value,
        diet: selectedDiet.value,
        intolerance: selectedIntolerance.value,
        number: selectedNumber.value,
        sort: backendSort || undefined,
      }
    });

    let results = response.data;

    if (selectedSort.value === "prep-asc") {
      results.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
    } else if (selectedSort.value === "prep-desc") {
      results.sort((a, b) => b.readyInMinutes - a.readyInMinutes);
    }

    recipes.value = results;
    searched.value = true;
    saveLastSearch();
  } catch (err) {
    if (err.response?.status === 404) {
      recipes.value = [];
    } else {
      console.error("Error searching recipes:", err);
    }
    searched.value = true;
    saveLastSearch();
  }
};


const clearSearch = () => {
  searchQuery.value = '';
  selectedCuisine.value = '';
  selectedDiet.value = '';
  selectedIntolerance.value = '';
  selectedNumber.value = '5';
  selectedSort.value = '';
  recipes.value = [];
  searched.value = false;
};

// On load
onMounted(async () => {
  await loadLastSearch();
});
</script>

<style scoped>
input,
select.form-control {
  white-space: nowrap;
}
button {
  width: 200px;
}
</style>
