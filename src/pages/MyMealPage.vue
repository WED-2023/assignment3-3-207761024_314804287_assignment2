<template>
  <div class="meal-plan-page">
    <h2 class="page-title">My Meal Plan</h2>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="recipes.length === 0" class="empty-msg">
      No recipes in your meal plan.
    </div>
    <div v-else class="recipe-list">
      <div
        v-for="(recipe, index) in recipes"
        :key="recipe.id"
        class="recipe-card"
      >
        <div class="card-header">
          <strong>#{{ index + 1 }} - {{ recipe.title }}</strong>
        </div>

        <div class="progress-section">
          <div class="progress-label">
            {{ getStepsDone(recipe.recipe_progress) }} /
            {{ getTotalSteps(recipe.recipe_progress) }} steps done
          </div>
          <div class="custom-progress-bar">
            <div
              class="custom-progress-fill"
              :style="{ width: getProgressPercent(recipe.recipe_progress) + '%' }"
            ></div>
          </div>
        </div>

        <div class="card-actions">
          <div class="reorder-btns">
            <button
              @click="moveUp(index)"
              :disabled="index === 0"
              title="Move Up"
              class="arrow-btn"
            >
              ⬆️
            </button>

            <button
              @click="moveDown(index)"
              :disabled="index === recipes.length - 1"
              title="Move Down"
              class="arrow-btn"
            >
              ⬇️
            </button>
          </div>
          <div class="action-btns">
            <button class="btn-remove" @click="removeFromMeal(recipe.id)">
              Remove
            </button>
            <button class="btn-start" @click="startPreparation(recipe.id)">
              Start
            </button>
          </div>
        </div>
      </div>

      <div class="clear-section">
        <button class="btn-clear" @click="clearMealPlan">🧹 Clear All</button>
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
    store.setMealCount(recipes.value.length) 
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
    store.setMealCount(store.mealCount - 1)
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


<style scoped>
.meal-plan-page {
  font-family: 'Poppins', sans-serif;
  background: url('@/assets/search2.jpg') no-repeat center center fixed;
  padding: 2.5rem;
  min-height: 100vh;
}

.page-title {
  font-size: 2.4rem;
  text-align: center;
  margin-bottom: 2.5rem;
  color: #4b2e2e;
  text-shadow: 1px 1px #e2c5a2;
}

.loading,
.empty-msg {
  text-align: center;
  font-size: 1.3rem;
  color: #6a4b35;
  margin-top: 2rem;
}

.recipe-list {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.recipe-card {
  background: #fffaf5;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.recipe-card:hover {
  transform: translateY(-3px);
}

.card-header {
  font-size: 1.2rem;
  color: #4b2e2e;
  font-weight: 600;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.progress-label {
  font-size: 0.95rem;
  color: #6a4b35;
}

.custom-progress-bar {
  width: 100%;
  background: #ece5dd;
  border-radius: 12px;
  overflow: hidden;
  height: 16px;
}

.custom-progress-fill {
  background-color: #7dd6d6;
  height: 100%;
  transition: width 0.4s ease;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Arrow Buttons */
.reorder-btns {
  display: flex;
  gap: 0.6rem;
}

.reorder-btns button {
  font-size: 1rem;
  padding: 0.35rem 0.6rem;
  border-radius: 10px;
  border: none;
  background: #eee2d3;
  color: #4b2e2e;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
}

.reorder-btns button:hover {
  background: #e2c5a2;
  transform: scale(1.05);
}

.reorder-btns button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Action Buttons */
.action-btns {
  display: flex;
  gap: 0.6rem;
}

.btn-remove {
  background: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-remove:hover {
  background: #A4161A;
}

.btn-start {
  background: #7dd6d6;
  color: #143434;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;
}

.btn-start:hover {
  background: #66c0c0;
}

.clear-section {
  text-align: center;
  margin-top: 2.5rem;
}

.btn-clear {
  background: #ffc107;
  color: #5e4200;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.btn-clear:hover {
  background: #e6ac00;
}

.reorder-btns {
  display: flex;
  gap: 0.5rem;
}

.arrow-btn {
  background: #f2e7db;
  color: #4b2e2e;
  font-size: 1rem;
  padding: 0.4rem 0.6rem;
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.arrow-btn:hover {
  background: #e2c5a2;
  transform: scale(1.05);
}

.arrow-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}



</style>
