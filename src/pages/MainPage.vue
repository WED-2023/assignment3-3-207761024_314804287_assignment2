<template>
  <div class="container mt-4">
    <div class="row">
      <!-- Left column -->
      <div class="col-md-8">
        <h3>Explore these recipes</h3>
        <RecipePreviewList :recipes="randomRecipes" />
        <button class="btn btn-primary mt-3" @click="loadNewRecipes">Load New</button>
      </div>

      <!-- Right column -->
      <div class="col-md-4">
        <div v-if="isLoggedIn">
          <h4>Last Watched</h4>
          <RecipePreviewList :recipes="lastWatchedRecipes" />
        </div>
        <div v-else class="login-container">
          <LoginPage />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import RecipePreviewList from '@/components/RecipePreviewList.vue'
import LoginPage from '@/pages/LoginPage.vue'
import store from '@/store'

const randomRecipes = ref([])
const lastWatchedRecipes = ref([])

const isLoggedIn = computed(() => !!store.username)

const loadNewRecipes = async () => {
  try {
    const response = await fetch(`${store.server_domain}/recipes/random`)
    const data = await response.json()
    randomRecipes.value = data
  } catch (error) {
    console.error("Error loading random recipes:", error)
  }
}

const fetchLastWatched = async () => {
  try {
    const response = await fetch(`${store.server_domain}/recipes/lastWatched`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await response.json()
    lastWatchedRecipes.value = data
  } catch (error) {
    console.error("Error fetching last watched recipes:", error)
  }
}

onMounted(() => {
  loadNewRecipes()
  if (isLoggedIn.value) {
    fetchLastWatched()
  }
})
</script>
