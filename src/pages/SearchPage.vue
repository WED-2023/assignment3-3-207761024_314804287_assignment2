<template>
  <div class="search-page">
    <h2 class="title">Explore Recipes</h2>

    <!-- Search Inputs -->
    <div class="search-controls">
      <input v-model="searchQuery" type="text" class="search-input" placeholder="🔍 Search for a recipe..." />

      <div class="filters">
        <select v-model="selectedCuisine">
          <option value="">All Cuisines</option>
          <option v-for="c in cuisines" :key="c" :value="c">🍽️ {{ c }}</option>
        </select>
        <select v-model="selectedDiet">
          <option value="">All Diets</option>
          <option v-for="d in diets" :key="d" :value="d">🥗 {{ d }}</option>
        </select>
        <select v-model="selectedIntolerance">
          <option value="">No Intolerances</option>
          <option v-for="i in intolerances" :key="i" :value="i">🚫 {{ i }}</option>
        </select>
        <select v-model="selectedNumber">
          <option value="5">5 results</option>
          <option value="10">10 results</option>
          <option value="15">15 results</option>
        </select>
        <select v-model="selectedSort">
          <option value="">No Sort</option>
          <option value="prep-asc">Prep Time Ascending</option>
          <option value="prep-desc">Prep Time Descending</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>

      <div class="buttons">
        <button class="btn-search" @click="searchRecipes">Search</button>
        <button class="btn-clear" @click="clearSearch">Clear Search</button>
      </div>
    </div>

    <!-- Results -->
    <RecipePreviewList :recipes="recipes" v-if="recipes.length" />

    <div v-else-if="searched" class="no-results">
      <p>No recipes found for the given search parameters.</p>
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

const searchQuery = ref('');
const selectedCuisine = ref('');
const selectedDiet = ref('');
const selectedIntolerance = ref('');
const selectedNumber = ref('5');
const selectedSort = ref('');
const recipes = ref([]);
const searched = ref(false);

const cuisines = ref(cuisinesData);
const diets = ref(dietsData);
const intolerances = ref(intolerancesData);


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
    await searchRecipes(); 
  }
};



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

onMounted(async () => {
  await loadLastSearch();
});
</script>

<style scoped>
.search-page {
  padding: 2rem;
  background: url('@/assets/search3.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.title {
  text-align: center;
  font-size: 3rem;
  color: #3e2e2e;
  margin-bottom: 1.5rem;
  font-weight: 800;
  position: relative;
}

.title::after {
  content: '';
  width: 90px;
  height: 4px;
  background: #c08457;
  display: block;
  margin: 0.5rem auto 0;
  border-radius: 2px;
}

.search-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.search-input {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  width: 90%;
  max-width: 1100px;
  background-color: #fef9f3;
  border: 1px solid #d9bfa8;
  border-radius: 12px;
  font-size: 1.1rem;
  outline: none;
  background-color: white;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

.search-input,
.filters select {
  background-color: #fef9f3;
  border: 1px solid #d9bfa8;
  border-radius: 12px;
  font-size: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  max-width: 1100px;
}

select {
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  border: 1px solid #bbb;
  font-size: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  min-width: 160px;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.btn-search,
.btn-clear {
  padding: 0.3rem 1.2rem;
  font-weight: bold;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-search {
  background: linear-gradient(to right, #c9945c, #dba76c);
  color: white;
  box-shadow: 0 4px 12px rgba(201, 148, 92, 0.4);
}

.btn-search:hover {
  background: linear-gradient(to right, #b37644, #cc8e55);
}

.btn-clear {
  background: #5e5e5e;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.btn-clear:hover {
  background: #3e3e3e;
}

.horizontal-recipe-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 2.5rem;
}

.recipe-horizontal-card {
  flex: 1 1 calc(30% - 2rem);
  max-width: 350px;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.recipe-horizontal-card:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
}

.no-results {
  text-align: center;
  margin-top: 3rem;
  color: #6c6c6c;
  font-size: 1.2rem;
  font-weight: 500;
}
</style>

