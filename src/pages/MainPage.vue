<template>
  <div class="container mt-4">
    <div class="row">
      <!-- Left column -->
      <div class="col-md-7">
        <RecipePreviewList
          title="Explore these recipes"
          :recipes="randomRecipes"
          :showLoadButton="true"
          @load="loadNewRecipes"
        />
      </div>

      <!-- Right column -->
      <div class="col-md-5">
        <div v-if="isLoggedIn">
          <h4>Last Watched</h4>
          <RecipePreviewList :recipes="lastWatchedRecipes.slice(0, 3)" />
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
import axios from 'axios'
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
    const response = await axios.get(
      `${store.server_domain}/users/LastViewedRecipes`,
      { withCredentials: true }
    );
    lastWatchedRecipes.value = response.data;
  } catch (error) {
    console.error("Error fetching last viewed recipes:", error);
  }
};


onMounted(() => {
  loadNewRecipes()
  if (isLoggedIn.value) {
    fetchLastWatched()
  }
})
</script>
