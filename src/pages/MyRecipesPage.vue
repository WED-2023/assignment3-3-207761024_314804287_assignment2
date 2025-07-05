<template>
  <div class="my-recipes-wrapper">
    <div class="my-recipes-page container">
      <h2 class="recipes-title">My Recipes</h2>

      <div v-if="recipes.length === 0" class="empty-message">
        You haven’t created any recipes yet.
      </div>

      <div v-else class="recipe-grid">
        <RecipePreview
          v-for="recipe in recipes"
          :key="recipe.id || recipe.recipe_id"
          :recipe="recipe"
        />
      </div>
    </div>
    <div class="text-center mt-5">
      <router-link to="/" class="button">← Back to Home</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import store from '@/store';
import RecipePreview from '@/components/RecipePreview.vue' 

const recipes = ref([])

async function fetchMyRecipes() {
  try {
    const response = await axios.get(`${store.server_domain}/users/MyRecipes`, {
      withCredentials: true
    })
    recipes.value = response.data
  } catch (err) {
    console.error(" Failed to fetch user's recipes:", err)
  }
}

onMounted(fetchMyRecipes)
</script>

<style scoped>
.my-recipes-wrapper {
  background: url('@/assets/option2.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
}

.my-recipes-page {
  max-width: 1200px;
  margin: 0 auto;
}

.recipes-title {
  text-align: center;
  font-size: 2.5rem;
  color: #4b2e2e;
  margin-bottom: 2rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 0.5rem;
}

.recipes-title::after {
  content: '';
  width: 80px;
  height: 4px;
  background: #C08457;
  display: block;
  margin: 0.5rem auto 0;
  border-radius: 2px;
  animation: slideIn 1s ease forwards;
}

@keyframes slideIn {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 80px;
    opacity: 1;
  }
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

.empty-message {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
  margin-top: 3rem;
  animation: fadeIn 0.8s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.button {
  width: 100%;
  margin-top: 3rem;
  background: linear-gradient(to right, #c9945c, #dba76c);
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  transition: background 0.3s ease;
}

.button:hover {
  background: linear-gradient(to right, #b47e45, #cd9756);
}


</style>
