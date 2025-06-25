<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-center">My Family Recipes</h2>

    <div v-if="recipes.length === 0">No family recipes available.</div>
    <div v-else class="row row-cols-1 g-4">
      <div v-for="recipe in recipes" :key="recipe.recipe_id" class="d-flex flex-row align-items-start border p-3 rounded shadow-sm">
        <!-- Image -->
        <div class="me-4" style="width: 200px;">
          <img :src="require(`@/assets/${extractImageName(recipe.image_url)}`)" alt="Recipe Image" class="img-fluid rounded" />
        </div>

        <!-- Details -->
        <div>
          <p><strong>Family Member:</strong> {{ recipe.family_member }}</p>
          <p><strong>Relation:</strong> {{ recipe.relation }}</p>
          <p><strong>Best Event:</strong> {{ recipe.best_event }}</p>

          <!-- Ingredients -->
          <p><strong>Ingredients:</strong></p>
          <ul>
            <li v-for="(ingredient, index) in parseIngredients(recipe.ingredients)" :key="index">{{ ingredient }}</li>
          </ul>

          <!-- Instructions -->
          <p><strong>Instructions:</strong></p>
          <ol>
            <li v-for="(step, index) in parseInstructions(recipe.instructions)" :key="index">{{ step }}</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import store from '@/store'

const recipes = ref([])

onMounted(async () => {
  try {
    const response = await axios.get(`${store.server_domain}/users/FamilyRecipes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    recipes.value = response.data
  } catch (error) {
    console.error("Error fetching family recipes:", error)
  }
})

const parseIngredients = (ingredientsStr) => {
  return ingredientsStr.split(',').map(i => i.trim())
}

const parseInstructions = (instructionsStr) => {
  try {
    const steps = JSON.parse(instructionsStr)
    return steps.map(s => s.step)
  } catch (err) {
    return [instructionsStr]  // fallback
  }
}

const extractImageName = (path) => {
  return path?.split('/').pop() || ''
}
</script>

<style scoped>
img {
  max-height: 290px;
  object-fit: cover;
}
</style>
