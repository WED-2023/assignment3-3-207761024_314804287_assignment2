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
  flex: 1; 
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 10px;
}

.recipe-list-container > .d-flex {
  flex: 1;
  flex-direction: column;
}

button.btn.btn-primary {
  background: linear-gradient(to right, #d46a6a, #c94c4c);
  border: none;
  font-weight: 600;
  padding: 0.6rem 1.4rem;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

button.btn.btn-primary:hover {
  background: linear-gradient(to right, #b83f3f, #a63131);
  transform: translateY(-1px);
}

</style>


