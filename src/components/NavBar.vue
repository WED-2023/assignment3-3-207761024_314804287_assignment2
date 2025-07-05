<template>
  <b-navbar toggleable="lg" class="custom-navbar">
    <b-navbar-brand to="/" tag="router-link">Recipes</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/search" tag="router-link">Search</b-nav-item>
        <b-nav-item to="/about" tag="router-link">About</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <template v-if="!isLoggedIn">
          <span class="hello-guest">Hello Guest</span>
          <b-nav-item to="/login" tag="router-link">Login</b-nav-item>
          <b-nav-item to="/register" tag="router-link">Register</b-nav-item>
        </template>

        <template v-else>
          <span class="hello-user-text mr-3 align-middle d-flex align-items-center">
            Hello, {{ username }}
          </span>

          <!-- Personal Area Dropdown -->
          <div class="dropdown" @click="toggleDropdown" @blur="hideDropdown" tabindex="0">
            <span class="dropdown-toggle">
              <i class="fas fa-user-circle mr-1"></i> Personal Area
            </span>
            <div v-show="showDropdown" class="dropdown-menu show custom-dropdown">
              <router-link class="dropdown-item" to="/favorites">My Favorites</router-link>
              <router-link class="dropdown-item" to="/my-recipes">My Recipes</router-link>
              <router-link class="dropdown-item" to="/family-recipes">My Family Recipes</router-link>
              <router-link class="dropdown-item" to="/my-meal">
                My Meal Plan <b-badge variant="primary">{{ mealCount }}</b-badge>
              </router-link>
            </div>
          </div>

          <b-button variant="outline-primary" class="ml-2" @click="logout">Logout</b-button>
          <b-button variant="success" class="ml-2" @click="openNewRecipeModal">New Recipe</b-button>
        </template>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>

  <!-- Modal Component -->
  <NewRecipeModal ref="modalRef" />
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import store from '@/store'
import NewRecipeModal from './NewRecipeModal.vue'

const router = useRouter()
const username = computed(() => store.username)
const isLoggedIn = computed(() => !!store.username)
const mealCount = ref(0)

// modal ref
const modalRef = ref(null)
function openNewRecipeModal() {
  modalRef.value?.open()
}

// dropdown logic
const showDropdown = ref(false)
function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}
function hideDropdown() {
  setTimeout(() => (showDropdown.value = false), 150)
}

// logout logic
function logout() {
  store.logout()
  router.push('/')
}

async function fetchMealCount() {
  try {
    const response = await axios.get(`${store.server_domain}/users/MyMeal`, {
      withCredentials: true,
    })
    mealCount.value = response.data.length
  } catch (err) {
    console.error('Failed to fetch meal count:', err)
  }
}

onMounted(fetchMealCount)
</script>

<style scoped>
.custom-navbar {
  background-color: var(--color-light-grey);
  padding: 0.8rem 1.5rem;
  border-bottom: 2px solid var(--color-primary);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.custom-navbar .navbar-brand,
.custom-navbar .nav-link,
.custom-navbar .dropdown-toggle,
.custom-navbar .navbar-text {
  color: var(--color-text) !important;
  font-weight: 500;
  transition: color 0.3s ease;
}

:deep(.nav-link) {
  font-size: 1.2rem;
  font-weight: bold;
  font-family: inherit;
  color: var(--color-text) !important;
  text-transform: none;
  letter-spacing: normal;
  line-height: 1.2;
}


:deep(.nav-link:hover) {
  color: var(--color-primary) !important;
  text-decoration: underline;
}

.custom-navbar .navbar-brand {
  font-size: 1.2rem;
  font-weight: bold;
  font-family: "Segoe UI", sans-serif; 
  color: var(--color-text);
  text-transform: none;
  letter-spacing: normal;
}


.custom-navbar .dropdown-toggle:hover {
  color: var(--color-primary) !important;
}

.custom-navbar .navbar-text {
  margin-left: 0.75rem;
}

.hello-user-text {
  color: var(--color-text);
  margin-right: 0.75rem;
  font-weight: 500;
}

.hello-guest {
  color: var(--color-text);
  margin-right: 0.75rem;
  font-weight: 600;
  font-size: 1.2rem; 
  display: flex;
  align-items: center;
  height: 100%; 
}


.custom-navbar {
  font-family: "Segoe UI", sans-serif; 
}

.custom-navbar .btn-outline-primary {
  color: var(--color-primary);
  border-color: var(--color-primary);
  font-weight: 600;
  background-color: transparent;
  transition: all 0.3s ease;
  margin-right: 0.75rem; 
}

.custom-navbar .btn-outline-primary:hover {
  background-color: var(--color-primary);
  color: white;
}

.custom-navbar .btn-success {
  background-color: var(--color-primary);
  border: none;
  font-weight: 600;
  color: white;
  transition: background-color 0.3s ease;
}

.custom-navbar .btn-success:hover {
  background-color: var(--color-primary-dark);
}

.ml-auto {
  margin-left: auto;
  align-items: center;

}

.dropdown {
  position: relative;
  cursor: pointer;
  padding: 0.5rem;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-weight: 600;
  cursor: pointer;
}

.custom-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  display: block;
  min-width: 10rem;
  background-color: var(--color-light-grey);
  border: 1px solid var(--color-accent);
  z-index: 1000;
  border-radius: 0.25rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.dropdown-menu .dropdown-item {
  padding: 0.5rem 1rem;
  color: var(--color-text);
  display: block;
  white-space: nowrap;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.dropdown-menu .dropdown-item:hover {
  background-color: var(--color-primary);
  color: white;
}
</style>

