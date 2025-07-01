<template>
  <div class="container mt-4">
    <div v-if="loading">Loading recipe instructions...</div>

    <div v-else>
      <!-- Title + Image -->
      <div class="d-flex align-items-start mb-4">
        <div>
          <h2 class="mb-3">{{ recipeTitle }}</h2>
        </div>
        <div class="ms-auto">
          <img :src="recipeImage" alt="Recipe Image" class="recipe-img" />
        </div>
      </div>

      <!-- Servings Selector -->
      <div class="mb-4">
        <label for="servings" class="form-label">Servings:</label>
        <input
          type="number"
          id="servings"
          v-model.number="servings"
          min="1"
          class="form-control w-auto d-inline-block ms-2"
        />
      </div>

      <!-- Ingredients List with amounts -->
      <h4>Ingredients:</h4>
      <ul class="list-unstyled row">
        <li
          v-for="ingredient in ingredients"
          :key="ingredient.id"
          class="col-md-4 d-flex align-items-center mb-3"
        >
          <img
            :src="`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`"
            :alt="ingredient.name"
            class="ingredient-img me-2"
          />
          <span>
            {{ (ingredient.amount * servings).toFixed(2) }} {{ ingredient.unit }} {{ ingredient.name }}
          </span>
        </li>
      </ul>

      <!-- Steps with details -->
      <h4 class="mt-5">Steps:</h4>
      <ul class="list-group">
        <li
          v-for="(step, index) in steps"
          :key="index"
          class="list-group-item"
        >
          <div class="form-check">
            <input
              type="checkbox"
              v-model="recipeProgress[index]"
              :id="`step-${index}`"
              class="form-check-input"
            />
            <label :for="`step-${index}`" class="form-check-label">
              <strong>Step {{ step.number }}:</strong> {{ step.step }}
            </label>
          </div>

          <!-- Step Ingredients -->
          <div class="mt-2 ms-4">
            <small><em>Ingredients:</em></small>
            <div class="d-flex flex-wrap mt-1">
              <div
                v-for="(ing, i) in step.ingredients"
                :key="i"
                class="d-flex align-items-center me-3 mb-1"
              >
                <img
                  :src="`https://spoonacular.com/cdn/ingredients_100x100/${ing.image}`"
                  :alt="ing.name"
                  class="step-icon-img me-1"
                />
                <span class="small">{{ ing.name }}</span>
              </div>
            </div>
          </div>

          <!-- Step Equipment -->
          <div v-if="step.equipment?.length" class="mt-1 ms-4">
            <small><em>Equipment:</em></small>
            <div class="d-flex flex-wrap mt-1">
              <div
                v-for="(eq, i) in step.equipment"
                :key="i"
                class="d-flex align-items-center me-3 mb-1"
              >
                <img
                  :src="eq.image"
                  :alt="eq.name"
                  class="step-icon-img me-1"
                />
                <span class="small">{{ eq.name }}</span>
              </div>
            </div>
          </div>

          <!-- Step Time -->
          <div v-if="step.length" class="mt-1 ms-4">
            <small><em>Time: </em> {{ step.length.number }} {{ step.length.unit }}</small>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import store from '../store'

const steps = ref([])
const ingredients = ref([])
const recipeProgress = ref([])
const recipeTitle = ref('')
const recipeImage = ref('')
const servings = ref(1)
const loading = ref(true)

const route = useRoute()
const recipeId = route.params.recipeId

onMounted(async () => {
  await ensureRecipeInMeal(recipeId)

  try {
    const [instructionsRes, recipeMetaRes] = await Promise.all([
      axios.get(`${store.server_domain}/recipes/${recipeId}/analyzedInstructions`, {
        withCredentials: true
      }),
      axios.get(`${store.server_domain}/recipes/${recipeId}`, {
        withCredentials: true
      }).catch(() => ({ data: {} }))
    ])

    recipeTitle.value = recipeMetaRes.data.title || 'Untitled Recipe'
    recipeImage.value = recipeMetaRes.data.image || ''

    if (instructionsRes.data.length > 0) {
      steps.value = instructionsRes.data[0].steps

      if (recipeMetaRes.data.extendedIngredients?.length) {
        ingredients.value = recipeMetaRes.data.extendedIngredients
      }

      try {
        const progressRes = await axios.get(
          `${store.server_domain}/users/RecipeMakingProgress/${recipeId}`,
          { withCredentials: true }
        )
        if (progressRes.data?.recipe_progress) {
          recipeProgress.value = progressRes.data.recipe_progress
        } else {
          recipeProgress.value = steps.value.map(() => false)
        }
      } catch {
        recipeProgress.value = steps.value.map(() => false)
      }
    }
  } catch (err) {
    console.error('Error loading instructions or recipe:', err)
  } finally {
    loading.value = false
  }
})

let debounceTimeout = null
watch(recipeProgress, (newProgress) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(async () => {
    try {
      await axios.put(
        `${store.server_domain}/users/RecipeMaking`,
        { recipeId, recipe_progress: newProgress },
        { withCredentials: true }
      )
      console.log('Progress saved to server:', newProgress)
    } catch (err) {
      console.error('Failed to update progress:', err)
    }
  }, 500)
}, { deep: true })

async function ensureRecipeInMeal(recipeId) {
  try {
    await axios.post(`${store.server_domain}/users/MyMeal`, {
      recipeId,
      servings: 1
    }, { withCredentials: true })
  } catch (e) {
    if (e.response?.status === 409) {
      console.log("Recipe already in MyMeal")
    } else {
      console.error("Error ensuring recipe in meal:", e)
    }
  }
}
</script>

<style scoped>
.recipe-img {
  max-width: 280px;
  border-radius: 10px;
}
.ingredient-img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 5px;
}
.step-icon-img {
  width: 30px;
  height: 30px;
  object-fit: contain;
  border-radius: 5px;
}
</style>
