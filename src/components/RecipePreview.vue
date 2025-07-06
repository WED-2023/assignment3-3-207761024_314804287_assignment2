<template>
  <div class="card h-100 recipe-card" @click="goToRecipe">
    <div class="position-relative">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        class="card-img-top recipe-image"
        :alt="recipe.title"
      />

      <div v-if="watched" class="watched-indicator">
        👁️ Watched
      </div>

      <button class="favorite-btn" @click.stop="toggleFavorite" :title="isFavorite ? 'Remove from Favorites' : 'Add to Favorites'">
        <span class="star" :class="{ active: isFavorite }">★</span>
      </button>


    </div>

    <div class="card-body text-center">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text">{{ recipe.readyInMinutes }} minutes</p>

      <!-- Dietary labels -->
      <div class="badges mt-2">
        <span v-if="recipe.vegan" class="badge bg-success">Vegan</span>
        <span v-if="recipe.vegetarian" class="badge bg-info text-dark">Vegetarian</span>
        <span v-if="recipe.glutenFree" class="badge bg-warning text-dark">Gluten Free</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import store from '@/store'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const watched = ref(false)
const isFavorite = ref(false)

onMounted(async () => {
  try {
    const watchedRes = await axios.get(`${store.server_domain}/users/IsLastViewedRecipe`, {
      params: { recipeId: props.recipe.id },
      withCredentials: true
    })
    watched.value = watchedRes.data?.isLastViewed === true

    const favoritesRes = await axios.get(`${store.server_domain}/users/FavoritesRecipes`, {
      withCredentials: true
    })
    const favoriteIds = favoritesRes.data.map(id => String(id))
    isFavorite.value = favoriteIds.includes(String(props.recipe.id))
  } catch (error) {
    console.error('Error loading recipe preview state:', error.response?.data || error.message)
  }
})

const toggleFavorite = async () => {
  try {
    if (isFavorite.value) {
      await axios.delete(`${store.server_domain}/users/FavoritesRecipes`, {
        data: { recipeId: props.recipe.id },
        withCredentials: true
      })
      isFavorite.value = false
    } else {
      await axios.post(`${store.server_domain}/users/FavoritesRecipes`, {
        recipeId: props.recipe.id,
        recipeSource: 'Spoonacular'  
      }, {
        withCredentials: true
      })
      isFavorite.value = true
    }
  } catch (error) {
    console.error('Error toggling favorite:', error.response?.data || error.message)
  }
}

const goToRecipe = () => {
  router.push(`/recipe/${props.recipe.id}`)
}
</script>


<style scoped>
.recipe-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  border: none;
  border-radius: 20px;
  overflow: hidden;
  background: #fffdf8;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.recipe-card:hover {
  transform: scale(1.015);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.recipe-image {
  width: 100%;
  height: 150px; 
  object-fit: cover;
  border-bottom: 2px solid #f2e6d9;
}

.card-body {
  padding: 1rem 1.2rem;
  background-color: #F5F3F4;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #5C4033;
  margin-bottom: 0.3rem;
}

.card-text {
  font-size: 0.95rem;
  color: #5C4033;
  margin-bottom: 0.5rem;
}

.badges {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 0.5rem;
}

.badges > .badge {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 500;
  background-color: #f4e1c9;
  color: #5a3e2b;
  border: 1px solid #d8c0a3;
}

.badge.bg-success {
  background-color: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

.badge.bg-info {
  background-color: #d1ecf1;
  color: #0c5460;
  border-color: #bee5eb;
}

.badge.bg-warning {
  background-color: #fff3cd;
  color: #856404;
  border-color: #ffeeba;
}

.watched-indicator {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #4b2e2e;
  color: #ffffff;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.favorite-btn {
  position: absolute;
  top: 0px;
  right: 10px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 2;
}

.favorite-btn .star {
  font-size: 1.8rem;
  color: #ddd;
  transition: transform 0.2s, color 0.2s;
}

.favorite-btn .star.active {
  color: gold;
  text-shadow: 0 0 4px rgba(255, 215, 0, 0.5);
}

.favorite-btn:hover .star {
  transform: scale(1.4);
  color: gold;
}

</style>
