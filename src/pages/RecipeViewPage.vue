<template>
  <div class="recipe-view-page">
    <div v-if="recipe" class="recipe-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <img :src="recipe.image" class="hero-image" :alt="recipe.title" />
        <div class="hero-text">
          <h1 class="recipe-title">{{ recipe.title }}</h1>
          <div class="tags">
            <span v-if="recipe.vegan" class="badge vegan">Vegan</span>
            <span v-if="recipe.vegetarian" class="badge vegetarian">Vegetarian</span>
            <span v-if="recipe.glutenFree" class="badge gluten-free">Gluten Free</span>
          </div>
          <div class="meta-info">
            <span>🕒 Ready in: {{ recipe.readyInMinutes }} min</span>
            <span>👨‍👩‍👧‍👦 Servings: {{ recipe.servings }}</span>
          </div>

          <div class="btn-group">
            <b-button
              :variant="isFavorite ? 'danger' : 'outline-secondary'"
              class="action-btn"
              @click="handleFavorite"
            >
              {{ isFavorite ? "Remove From Favorites" : "Add To Favorites" }}
            </b-button>

            <b-button
              variant="success"
              class="action-btn"
              @click="handleProgress"
            >
              Start Making Recipe
            </b-button>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="content-section">
        <div class="info-card">
          <h4>Ingredients</h4>
          <div class="ingredient-grid">
            <div
              class="ingredient-item"
              v-for="ingredient in recipe.extendedIngredients"
              :key="ingredient.id"
            >
              <img
                v-if="ingredient.image"
                :src="ingredient.image.startsWith('http') 
                  ? ingredient.image 
                  : `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`"
                :alt="ingredient.name"
              />
              <div class="ingredient-text">
                <strong>
                  {{ isNaN(Number(ingredient.amount)) ? ingredient.amount : Number(ingredient.amount).toFixed(2) }}
                  {{ ingredient.unit }}
                </strong>
                  {{ ingredient.name || ingredient.originalName }}
              </div>
            </div>
          </div>
        </div>

        <div class="info-card">
          <h4>Instructions</h4>
          <div v-for="step in recipe._instructions" :key="step.number" class="step-box">
            <div class="step-number">{{ step.number.toString().padStart(2, '0') }}</div>
            <div class="step-text">{{ step.step }}</div>
          </div>
        </div>
      </div>

      <div class="back-link text-center mt-4">
        <a href="#" @click.prevent="router.push('/')">← Back to Main Page</a>
      </div>
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

const handleFavorite = () => {
  if (!store.username) {
    return router.push({ name: 'LoginRequired', query: { from: recipeId } });
  }
  toggleFavorite();
};

const handleProgress = () => {
  if (!store.username) {
    return router.push({ name: 'LoginRequired', query: { from: recipeId } });
  }
  goToProgressPage();
};


const toggleFavorite = async () => {
  try {
    if (isFavorite.value) {
      await axios.delete(`${store.server_domain}/users/FavoritesRecipes`, {
        data: { recipeId },
        withCredentials: true
      });
      isFavorite.value = false;
    } else {
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
  } catch (error) {
    console.error("Error loading recipe:", error);
    router.replace("/NotFound");
  }

  if (store.username) {
    try {
      await axios.post(
        `${store.server_domain}/users/LastViewedRecipes`,
        { recipeId },
        { withCredentials: true }
      );
    } catch (postErr) {
      console.warn("Failed to update LastViewedRecipes (probably guest):", postErr.message);
    }
  }

    await checkIfFavorite();

});
</script>

<style scoped>
.recipe-view-page {
  font-family: 'Poppins', sans-serif;
  background: #f9f5f0;
  padding: 2rem;
}

.hero-section {
  display: flex;
  align-items: stretch; 
  flex-wrap: wrap;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}


.hero-image {
  flex: 1 1 360px;
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.hero-text {
  flex: 1 1 400px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  min-height: 250px;
}

.recipe-title {
  font-size: 3.5rem;
  color: #4b2e2e;
  font-weight: bold;
  margin-bottom: 1rem;
  word-wrap: break-word;
}

.tags {
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tags .badge {
  font-size: 0.9rem;
  padding: 0.4em 0.8em;
  border-radius: 10px;
  color: white;
}

.vegan {
  background-color: #2E7D32;
}
.vegetarian {
  background-color: #00BCD4;
}
.gluten-free {
  background-color: #FFC107;
}

.meta-info {
  font-size: 1.15rem;
  color: #161A1D;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 2.3rem;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
}

.action-btn {
  flex: 1 1 220px;
  font-weight: 600;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  white-space: nowrap;
}

.content-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 3rem;
  gap: 2rem;
}

.info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  flex: 1 1 400px;
}

.ingredient-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ingredient-item img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.ingredient-text {
  font-size: 0.95rem;
  color: #3e2e2e;
}

.step-box {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.step-number {
  font-size: 1.4rem;
  font-weight: bold;
  color: #C08457;
  margin-right: 0.75rem;
}

.step-text {
  flex: 1;
  font-size: 1rem;
  color: #3e2e2e;
}

.back-link a {
  color: #6c4f3d;
  font-weight: 600;
  text-decoration: none;
}

.back-link a:hover {
  text-decoration: underline;
}

.info-card h4 {
  font-size: 1.6rem;
  color: #4b2e2e;
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>
