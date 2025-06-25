<template>
  <div class="container">
    <div v-if="recipe">
      <div class="recipe-header mt-3 mb-4 text-center">
        <h1>{{ recipe.title }}</h1>
        <img :src="recipe.image" class="recipe-image" :alt="recipe.title" />
      </div>

      <div class="recipe-meta mb-4 text-center">
        <p><strong>Ready in:</strong> {{ recipe.readyInMinutes }} minutes</p>
        <p><strong>Servings:</strong> {{ recipe.servings }}</p>

        <div class="mt-2">
          <span v-if="recipe.vegan" class="badge vegan">Vegan</span>
          <span v-if="recipe.vegetarian" class="badge vegetarian">Vegetarian</span>
          <span v-if="recipe.glutenFree" class="badge gluten-free">Gluten Free</span>
        </div>

        <BButton
          :variant="isFavorite ? 'danger' : 'outline-secondary'"
          class="mt-3"
          @click="toggleFavorite"
        >
          {{ isFavorite ? "Remove From Favorites" : "Add To Favorites" }}
        </BButton>

        <b-button variant="success" class="mt-3" @click="goToProgressPage">
          Start Making Recipe
        </b-button>


      </div>

      <div class="wrapper">
        <div class="wrapped">
          <h5>Ingredients:</h5>
<ul>
  <li
    v-for="(ingredient, index) in recipe.ingredients || recipe.extendedIngredients"
    :key="index"
  >
    {{ ingredient.quantity || ingredient.amount }} {{ ingredient.unit }} {{  ingredient.originalName || ingredient.name  }}
  </li>
</ul>

        </div>

        <div class="wrapped">
          <h5>Instructions:</h5>
          <ol>
            <li v-for="step in recipe._instructions" :key="step.number">
              {{ step.step }}
            </li>
          </ol>
        </div>
      </div>
    </div>

    <div class="text-center mt-4">
      <a href="#" @click.prevent="router.push('/')">← Back to Main Page</a>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BButton } from 'bootstrap-vue-3';
import axios from 'axios';
import store from '@/store';

const route = useRoute();
const router = useRouter();
const recipe = ref(null);
const isFavorite = ref(false);
const recipeId = route.params.recipeId;

// Check if the recipe is marked as favorite (by externalRecipeId)
const checkIfFavorite = async () => {
  try {
    const response = await axios.get(`${store.server_domain}/users/FavoritesRecipes`, {
      withCredentials: true
    });

    const favoriteIds = response.data.map(id => String(id));
    isFavorite.value = favoriteIds.includes(String(recipeId));
  } catch (error) {
    console.error("Error checking favorites list:", error.response?.data || error.message);
  }
};

// Toggle favorite status
const toggleFavorite = async () => {
  try {
    if (isFavorite.value) {
      // Remove from favorites
      await axios.delete(`${store.server_domain}/users/FavoritesRecipes`, {
        data: { recipeId },
        withCredentials: true
      });
      isFavorite.value = false;
    } else {
      // Add to favorites
      await axios.post(`${store.server_domain}/users/FavoritesRecipes`, {
        recipeId,
        recipeSource: 'Spoonacular'
      }, {
        withCredentials: true
      });
      isFavorite.value = true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error.response?.data || error.message);
  }
};


const goToProgressPage = () => {
  router.push(`/progress/${recipeId}`)
}

// Load recipe and mark as viewed
onMounted(async () => {
  try {
    const response = await axios.get(`${store.server_domain}/recipes/${recipeId}`);
    const data = response.data;

    const _instructions = Array.isArray(data.instructions)
      ? data.instructions.map((step, idx) => ({
          number: idx + 1,
          step
        }))
      : [];

    recipe.value = {
      title: data.title,
      image: data.image,
      readyInMinutes: data.readyInMinutes,
      servings: data.servings,
      aggregateLikes: data.aggregateLikes ?? 0,
      extendedIngredients: data.extendedIngredients,
      instructions: data.instructions,
      _instructions,
      vegan: data.vegan,
      vegetarian: data.vegetarian,
      glutenFree: data.glutenFree
    };

    await axios.post(
      `${store.server_domain}/users/LastViewedRecipes`,
      { recipeId },
      { withCredentials: true }
    );

    await checkIfFavorite();
  } catch (error) {
    console.error("Error loading recipe:", error);
    router.replace("/NotFound");
  }
});
</script>

<style scoped>
.vegan {
  background-color: green;
  color: white;
}
.vegetarian {
  background-color: orange;
  color: white;
}
.gluten-free {
  background-color: purple;
  color: white;
}
</style>
