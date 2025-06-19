<template>
  <div class="recipe-list-container">
    <h3 v-if="title" class="mb-4 text-center">{{ title }}</h3>

    <div class="d-flex flex-column gap-3">
      <RecipePreview
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>

    <div v-if="showLoadButton" class="text-center mt-3">
      <button class="btn btn-primary" @click="$emit('load')">
        Load New
      </button>
    </div>
  </div>
</template>


<script setup>
import { defineProps } from 'vue'
import RecipePreview from './RecipePreview.vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  recipes: {
    type: Array,
    required: true
  },
  showLoadButton: {
    type: Boolean,
    default: false
  }
})

defineEmits(['load'])
</script>

<style scoped>
.recipe-list-container {
  min-height: 400px;
  padding: 0 10px;
}
</style>


