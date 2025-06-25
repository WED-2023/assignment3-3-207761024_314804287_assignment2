<template>
  <b-navbar toggleable="lg" type="light" variant="light">
    <b-navbar-brand to="/" tag="router-link">Recipes</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/search" tag="router-link">Search</b-nav-item>
        <b-nav-item to="/about" tag="router-link">About</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <template v-if="!isLoggedIn">
          <b-navbar-text class="align-middle d-flex align-items-center">Hello Guest</b-navbar-text>
          <b-nav-item to="/login" tag="router-link">Login</b-nav-item>
          <b-nav-item to="/register" tag="router-link">Register</b-nav-item>
        </template>

        <template v-else>
          <b-navbar-text class="mr-3 align-middle d-flex align-items-center">
            Hello, {{ username }}
          </b-navbar-text>

          <!-- Personal Area Dropdown -->
          <div class="dropdown" @click="toggleDropdown" @blur="hideDropdown" tabindex="0">
            <span class="dropdown-toggle">Personal Area</span>
            <div v-show="showDropdown" class="dropdown-menu show custom-dropdown">
              <router-link class="dropdown-item" to="/favorites">My Favorites</router-link>
              <router-link class="dropdown-item" to="/my-recipes">My Recipes</router-link>
              <router-link class="dropdown-item" to="/family-recipes">My Family Recipes</router-link>
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import store from '@/store'
import NewRecipeModal from './NewRecipeModal.vue'

const router = useRouter()
const username = computed(() => store.username)
const isLoggedIn = computed(() => !!store.username)

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
</script>

<style scoped>
.ml-auto {
  margin-left: auto;
}

.dropdown {
  position: relative;
  cursor: pointer;
  padding: 0.5rem;
}

.custom-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  display: block;
  min-width: 10rem;
  background-color: white;
  border: 1px solid #ccc;
  z-index: 1000;
  border-radius: 0.25rem;
}

.dropdown-toggle {
  color: #007bff;
  text-decoration: underline;
}

.dropdown-menu .dropdown-item {
  padding: 0.5rem 1rem;
  color: #212529;
  display: block;
  white-space: nowrap;
}
.dropdown-menu .dropdown-item:hover {
  background-color: #f8f9fa;
}
</style>
