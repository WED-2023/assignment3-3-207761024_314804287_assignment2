<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-center">My Meal Plan</h2>

    <div v-if="loading">Loading...</div>
    <div v-else-if="recipes.length === 0">No recipes in your meal plan.</div>
    <div v-else>
      <ul class="list-group">
        <li
          v-for="(recipe, index) in recipes"
          :key="recipe.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div class="w-100 me-3">
            <strong>#{{ index + 1 }} - {{ recipe.title }}</strong>

            <b-progress
              :value="getProgressPercent(recipe.recipe_progress)"
              max="100"
              variant="success"
              height="20px"
              class="mt-2"
            >
              <b-progress-bar :value="getProgressPercent(recipe.recipe_progress)">
                {{ getStepsDone(recipe.recipe_progress) }} / {{ getTotalSteps(recipe.recipe_progress) }} steps done
              </b-progress-bar>
            </b-progress>
          </div>

          <div class="d-flex flex-column gap-2 align-items-end">
            <div class="d-flex gap-1 mb-2">
                <b-button size="sm" :disabled="index === 0" @click="moveUp(index)">⬆️</b-button>
                <b-button size="sm" :disabled="index === recipes.length - 1" @click="moveDown(index)">⬇️</b-button>
            </div>
            <b-button variant="danger" size="sm" @click="removeFromMeal(recipe.id)">Remove</b-button>
            <b-button variant="info" size="sm" @click="startPreparation(recipe.id)">Start</b-button>
            </div>
        </li>
      </ul>

      <div class="text-center mt-4">
        <b-button variant="warning" @click="clearMealPlan">Clear All</b-button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import store from '@/store'

const recipes = ref([])
const loading = ref(true)
const router = useRouter()

async function fetchMyMeal() {
  try {
    const response = await axios.get(`${store.server_domain}/users/MyMeal`, { withCredentials: true })
    recipes.value = response.data
  } catch (err) {
    console.error('Failed to load meal recipes:', err)
  } finally {
    loading.value = false
  }
}

async function removeFromMeal(recipeId) {
  try {
    await axios.delete(`${store.server_domain}/users/MyMeal`, {
      data: { recipeId },
      withCredentials: true,
    })
    recipes.value = recipes.value.filter(r => r.id !== recipeId)
  } catch (err) {
    console.error('Failed to remove:', err)
  }
}

async function clearMealPlan() {
  for (const recipe of recipes.value) {
    await removeFromMeal(recipe.id)
  }
}

function startPreparation(recipeId) {
  router.push(`/progress/${recipeId}`)
}

function getStepsDone(progress) {
  if (!Array.isArray(progress)) return 0;
  return progress.filter(Boolean).length;
}

function getTotalSteps(progress) {
  if (!Array.isArray(progress)) return 0;
  return progress.length;
}

function getProgressPercent(progress) {
  const done = getStepsDone(progress);
  const total = getTotalSteps(progress);
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function moveUp(index) {
  if (index > 0) {
    const temp = recipes.value[index]
    recipes.value[index] = recipes.value[index - 1]
    recipes.value[index - 1] = temp
  }
}

function moveDown(index) {
  if (index < recipes.value.length - 1) {
    const temp = recipes.value[index]
    recipes.value[index] = recipes.value[index + 1]
    recipes.value[index + 1] = temp
  }
}



onMounted(fetchMyMeal)
</script>
