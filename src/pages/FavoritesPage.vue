<template>
  <div class="favorites-wrapper">
    <div class="favorites-page container">
      <h2 class="favorites-title">My Favorite Recipes</h2>
      <div v-if="favoriteRecipes.length === 0" class="empty-message">
        <p>You have no favorite recipes yet.</p>
      </div>
      <div v-else class="recipe-grid">
        <RecipePreview
          v-for="recipe in favoriteRecipes"
          :key="recipe.id"
          :recipe="recipe"
          :is-favorite="true"
        />
      </div>
    </div>
    <div class="text-center mt-5">
      <router-link to="/" class="button">← Back to Home</router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import store from '@/store';
import RecipePreview from '@/components/RecipePreview.vue';

const favoriteRecipes = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get(`${store.server_domain}/users/FavoritesRecipes`, {
      withCredentials: true
    });

    const recipeIds = response.data;

    const uniqueIds = [...new Set(recipeIds.map(id => parseInt(id)))];

    const recipeResponses = await Promise.all(
      uniqueIds.map(id =>
        axios.get(`${store.server_domain}/recipes/${id}`)
      )
    );

    favoriteRecipes.value = recipeResponses.map(res => res.data);
  } catch (error) {
    console.error('Error fetching favorite recipes:', error);
  }
});
</script>

<style scoped>
.favorites-page {
  padding: 2rem;
  background-color: transparent;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.favorites-title {
  text-align: center;
  font-size: 2.5rem;
  color: #4b2e2e;
  margin-bottom: 2rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 0.5rem;
}

.favorites-title::after {
  content: '';
  width: 80px;
  height: 4px;
  background: #C08457;
  display: block;
  margin: 0.5rem auto 0;
  border-radius: 2px;
  animation: slideIn 1s ease forwards;
}

.favorites-wrapper {
  background: url('@/assets/option2.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  padding: 2rem;
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

