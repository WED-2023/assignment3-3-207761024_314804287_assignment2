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
      </div>

      <div class="wrapper">
        <!-- Ingredients -->
        <div class="wrapped">
          <h5>Ingredients:</h5>
          <ul>
            <li v-for="(ing, index) in recipe.extendedIngredients" :key="index + '_' + ing.id">
              {{ ing.original }}
            </li>
          </ul>
        </div>

        <!-- Instructions -->
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
  </div>
  <div class="text-center mt-4">
  <a href="#" @click.prevent="router.push('/')">← Back to Main Page</a>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import store from '@/store';

const route = useRoute();
const router = useRouter();
const recipe = ref(null);

onMounted(async () => {
  try {
    const recipeId = route.params.recipeId;

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

    await axios.post(`${store.server_domain}/users/LastViewedRecipes`, {
      recipeId
    }), {withCredentials: true};

  } catch (error) {
    console.error("Error loading recipe:", error);
    router.replace("/NotFound");
  }
});
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.wrapped {
  flex: 1 1 45%;
}

.recipe-image {
  display: block;
  margin: 0 auto;
  width: auto;
  max-height: 300px;
  object-fit: cover;
}

.recipe-meta p {
  margin: 0.2rem 0;
}

.badge {
  display: inline-block;
  padding: 3px 8px;
  margin: 0 4px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
}

.vegan {
  background-color: #28a745;
}

.vegetarian {
  background-color: #17a2b8;
}

.gluten-free {
  background-color: #ffc107;
  color: black;
}



</style>
