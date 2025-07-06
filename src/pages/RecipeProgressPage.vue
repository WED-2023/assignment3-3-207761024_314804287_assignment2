<template>
  <div class="recipe-progress-page">
    <div v-if="loading" class="loading">Loading recipe instructions...</div>

    <div v-else class="fade-in">
      <!-- Header Section -->
      <section class="header-section" aria-label="Recipe Header">
        <div class="image-wrapper">
          <img :src="recipeImage" alt="Recipe Image" class="recipe-img" />
        </div>
        <div class="title-block">
          <h2>{{ recipeTitle }}</h2>
          <div class="meta-info">
            <p><strong>⏱️ Time:</strong> {{ readyInMinutes }} min</p>
            <p><strong>🍽️ Servings:</strong> {{ servings }}</p>
            <div class="labels">
              <span v-if="isVegan" class="label vegan">Vegan</span>
              <span v-if="isVegetarian" class="label vegetarian">Vegetarian</span>
              <span v-if="isGlutenFree" class="label gluten-free">Gluten Free</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Ingredients Section with Servings -->
      <section aria-label="Ingredients">
      <div class="ingredients-header">
        <h3 class="section-title">🧺 Ingredients</h3>
        <div class="servings-card">
          <button @click="servings = Math.max(1, servings - 1)">−</button>
          <span>{{ servings }}</span>
          <button @click="servings++">+</button>
        </div>
      </div>

      <div class="ingredients-and-servings">
        <ul class="ingredient-grid">
          <li
            v-for="ingredient in ingredients"
            :key="ingredient.id"
            class="ingredient-card"
          >
              <img
                v-if="ingredient.image"
                :src="ingredient.image.startsWith('http') 
                  ? ingredient.image 
                  : `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`"
                :alt="ingredient.name"
              />
            <span>
              {{ (ingredient.amount * servings).toFixed(2) }}
              {{ ingredient.unit }}
              {{ ingredient.name || ingredient.originalName }}
            </span>
          </li>
        </ul>
      </div>

      </section>

      <!-- Steps Section -->
      <section aria-label="Cooking Steps">
        <h3 class="section-title">👨‍🍳 Steps</h3>
        <transition-group name="fade" tag="ul" class="steps-list">
          <li v-for="(step, index) in steps" :key="index" class="step-card">
            <div class="checkbox-block">
              <input
                type="checkbox"
                v-model="recipeProgress[index]"
                :id="`step-${index}`"
              />
              <label :for="`step-${index}`">
                <strong>Step {{ step.number }}:</strong> {{ step.step }}
              </label>
            </div>

            <div v-if="step.ingredients?.length" class="step-subblock">
              <small><em>Ingredients:</em></small>
              <div class="icon-row">
                <div
                  v-for="(ing, i) in step.ingredients"
                  :key="i"
                  class="icon-pair"
                >
                  <img
                    :src="`https://spoonacular.com/cdn/ingredients_100x100/${ing.image}`"
                    :alt="ing.name"
                  />
                  <span>{{ ing.name }}</span>
                </div>
              </div>
            </div>

            <div v-if="step.equipment?.length" class="step-subblock">
              <small><em>Equipment:</em></small>
              <div class="icon-row">
                <div
                  v-for="(eq, i) in step.equipment"
                  :key="i"
                  class="icon-pair"
                >
                  <img :src="eq.image" :alt="eq.name" />
                  <span>{{ eq.name }}</span>
                </div>
              </div>
            </div>

            <div v-if="step.length" class="step-subblock">
              <small><em>Time:</em> {{ step.length.number }} {{ step.length.unit }}</small>
            </div>
          </li>
        </transition-group>
      </section>
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

const readyInMinutes = ref(null)
const isVegan = ref(false)
const isVegetarian = ref(false)
const isGlutenFree = ref(false)


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
    readyInMinutes.value = recipeMetaRes.data.readyInMinutes || null
    isVegan.value = recipeMetaRes.data.vegan || false
    isVegetarian.value = recipeMetaRes.data.vegetarian || false
    isGlutenFree.value = recipeMetaRes.data.glutenFree || false

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
    store.setMealCount(store.mealCount + 1)
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
.recipe-progress-page {
  font-family: 'Poppins', sans-serif;
  background: url('@/assets/search2.jpg') no-repeat center center fixed;
  padding: 2.5rem;
  min-height: 100vh;
  background-size: cover;
  background-attachment: fixed;
  background-blend-mode: lighten;
  animation: fadeInPage 1s ease-in-out;
  border-radius: 20px;
}

@keyframes fadeInPage {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading {
  text-align: center;
  font-size: 1.6rem;
  color: #7c4b2f;
  font-weight: bold;
  margin-top: 2rem;
}

.fade-in {
  animation: fadeIn 0.7s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 1rem;
}

.recipe-img {
  width: 100%;
  max-width: 580px;
  border-radius: 24px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  animation: pulseShadow 3s infinite ease-in-out;
}

@keyframes pulseShadow {
  0%, 100% {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
  50% {
    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.25);
  }
}

.title-block h2 {
  font-size: 4.2rem;
  font-weight: 800;
  color: #4b2e2e;
  text-shadow: 2px 2px #e9c8a7;
  margin: 0;
}

.section-title {
  margin-top: 2rem;
  font-size: 1.8rem;
  color: #603c1e;
  border-bottom: 3px solid #d7a86e;
  display: inline-block;
  padding-bottom: 0.4rem;
}

.ingredients-and-servings {
  margin-top: 2rem;
}

.ingredients-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
}

.servings-card {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: #fff;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  /* box-shadow: 6px 6px 12px #d6d6d6, -6px -6px 12px #ffffff; */
  font-weight: 600;
  transition: transform 0.2s ease;
}

.servings-card span {
  font-size: 1.2rem;
  min-width: 28px;
  text-align: center;
  color: #4b2e2e;
}

.servings-card button {
  background-color: #f3e1d2;
  border: none;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  color: #5e3f2b;
  transition: all 0.2s ease;
}

.servings-card button:hover {
  background-color: #e4c8b3;
  transform: scale(1.1);
}


.ingredient-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.2rem;
  margin-top: 1.2rem;
}

.ingredient-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(to bottom right, #fffaf5, #fff1e8);
  border-radius: 14px;
  border: 1px solid #eedac9;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.ingredient-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.ingredient-card img {
  width: 45px;
  height: 45px;
  object-fit: cover;
  border-radius: 10px;
}

.steps-list {
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  list-style: none;
  padding: 0;
}

.step-card {
  background: #fffaf5;
  border-radius: 16px;
  padding: 1.4rem 1.6rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: popUp 0.5s ease forwards;
}

.step-card:hover {
  transform: scale(1.01);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

@keyframes popUp {
  0% {
    transform: scale(0.96);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.checkbox-block {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #3c2b1c;
}

.step-subblock {
  margin-left: 1.6rem;
  margin-top: 0.8rem;
}

.icon-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 0.4rem;
}

.icon-pair {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #f7f3f0;
  padding: 0.5rem 0.8rem;
  border-radius: 10px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
}

.icon-pair img {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  object-fit: cover;
}

.meta-info {
  margin-top: 1rem;
  font-size: 1.5rem;
  color: #5b4031;
}

.meta-info p {
  margin: 0.5rem 0;
}

.labels {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.8rem;
}

.label {
  background: #f3ebe3;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
}

.label.vegan {
  background: #d1f5d3;
  color: #2e7d32;
}
.label.vegetarian {
  background: #d2faff;
  color: #00BCD4;
}
.label.gluten-free {
  background: #fff2cc;
  color: #8e6d00;
}


</style>
