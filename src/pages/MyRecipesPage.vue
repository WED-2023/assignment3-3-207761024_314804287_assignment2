<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-center">My Recipes</h2>

    <div v-if="recipes.length === 0" class="text-center text-muted">
      You haven’t created any recipes yet.
    </div>

    <div class="row">
      <div class="col-md-4 mb-4" v-for="recipe in recipes" :key="recipe.id || recipe.recipe_id">
        <RecipePreview :recipe="recipe" />
      </div>
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
