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
  transition: transform 0.2s;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.recipe-card:hover {
  transform: scale(1.01);
}

.recipe-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.card-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
}

.badges > .badge {
  margin: 0 4px 4px 0;
  font-size: 0.75rem;
  padding: 5px 8px;
}

.watched-indicator {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 0.75rem;
  font-weight: bold;
}

.favorite-btn {
  position: absolute;
  top: 0px;
  right: 8px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 2;
}

.favorite-btn .star {
  font-size: 2rem;
  color: #ccc;
  transition: transform 0.2s, color 0.2s;
}

.favorite-btn .star.active {
  color: gold;
}

.favorite-btn:hover .star {
  transform: scale(2.5);
  color: gold;
}

</style>
