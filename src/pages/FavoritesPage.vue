<template>
  <div class="favorites-page container">
    <h2 class="text-center mb-4">My Favorite Recipes</h2>
    <div v-if="favoriteRecipes.length === 0">
      <p>You have no favorite recipes yet.</p>
    </div>
    <div v-else class="row">
      <RecipePreview
        v-for="recipe in favoriteRecipes"
        :key="recipe.id"
        :recipe="recipe"
      />
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
  margin-top: 30px;
}
</style>
