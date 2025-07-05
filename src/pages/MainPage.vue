<template>
  <div class="main-page">
    <div class="container mt-4">
      <div class="row equal-height">
        <!-- Left column -->
        <div class="col-md-6 column-box">
          <h4>Explore these recipes</h4>
          <RecipePreviewList
            :recipes="randomRecipes"
          />
          <div class="text-center mt-3">
            <button class="load-btn" @click="loadNewRecipes">Load New</button>
          </div>
        </div>


        <!-- Right column -->
        <div class="col-md-6 column-box">
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


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.main-page {
  min-height: 100vh;
  background: url('@/assets/main-back.jpg') no-repeat center center fixed;
  background-size: cover;
  padding: 2rem 0;
}

.container {
  font-family: 'Poppins', sans-serif;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

::v-deep(.login-page) {
  background: transparent !important;
  padding: 0 !important;
}


h4, h2 {
  color: #3e2e2e;
  font-weight: 600;
}

.row.equal-height {
  display: flex;
  flex-wrap: wrap;
}

.column-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 1rem;
  min-height: 100%;
}

.column-box h4 {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  color: #4b2e2e;
}

.load-btn {
  background: linear-gradient(to right, #d46a6a, #c94c4c);
  color: white;
  font-weight: 600;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

.load-btn:hover {
  background: linear-gradient(to right, #b83f3f, #a63131);
  transform: translateY(-2px);
}


</style>

