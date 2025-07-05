<template>
  <div class="family-page">
    <h2 class="title">My Family Recipes</h2>

    <div v-if="recipes.length === 0" class="empty-message">
      No family recipes available.
    </div>

    <div v-else class="recipe-grid">
      <div
        v-for="recipe in recipes"
        :key="recipe.recipe_id"
        class="family-card styled-card shadow"
      >
        <!-- Image -->
        <div class="image-container">
          <img
            :src="require(`@/assets/${extractImageName(recipe.image_url)}`)"
            alt="Recipe Image"
            class="recipe-img"
          />
        </div>

        <!-- Details -->
        <div class="details">
          <p><strong>👨‍👩‍👧 Family Member:</strong> {{ recipe.family_member }}</p>
          <p><strong>🔗 Relation:</strong> {{ recipe.relation }}</p>
          <p><strong>🎉 Best Event:</strong> {{ recipe.best_event }}</p>

          <p class="section-header">🧂 Ingredients:</p>
          <ul>
            <li v-for="(ingredient, index) in parseIngredients(recipe.ingredients)" :key="index">
              {{ ingredient }}
            </li>
          </ul>

          <p class="section-header">📝 Instructions:</p>
          <ol>
            <li v-for="(step, index) in parseInstructions(recipe.instructions)" :key="index">
              {{ step }}
            </li>
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
    return [instructionsStr]  
  }
}

const extractImageName = (path) => {
  return path?.split('/').pop() || ''
}


</script>

<style scoped>
.family-page {
  padding: 2rem;
  background: url('@/assets/option.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.title {
  text-align: center;
  font-size: 2.5rem;
  color: #4b2e2e;
  margin-bottom: 2rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 0.5rem;
}

.title::after {
  content: '';
  width: 80px;
  height: 4px;
  background: #C08457;
  display: block;
  margin: 0.5rem auto 0;
  border-radius: 2px;
  animation: slideIn 1s ease forwards;
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

.empty-message {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
  margin-top: 3rem;
  animation: fadeIn 0.8s ease-in;
}

.recipe-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 900px;
  margin: auto;
}

.family-card {
  background: white;
  border-radius: 24px;
  display: flex;
  gap: 2rem;
  padding: 2rem;
  align-items: flex-start;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex-wrap: wrap;
  border-left: 6px solid #c08457;
}

.family-card:hover {
  transform: scale(1.01);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.15);
}

.image-container {
  flex: 1 1 250px;
  max-width: 280px;
}

.recipe-img {
  width: 100%;
  height: auto;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.details {
  flex: 2;
  font-size: 1rem;
  color: #3e2e2e;
}

.details p {
  margin-bottom: 0.4rem;
}

.details ul,
.details ol {
  margin-top: 0.5rem;
  padding-left: 1.2rem;
}

.section-header {
  font-weight: bold;
  color: #4b2e2e;
  margin-top: 1rem;
  font-size: 1.1rem;
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
</style>
