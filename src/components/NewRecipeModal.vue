<template>
  <b-modal
    v-model="show"
    title="Create a New Recipe"
    size="lg"
    hide-footer
    @hide="resetForm"
  >
    <form @submit.prevent="submitRecipe">
      <!-- Title -->
      <div class="form-group mb-3">
        <label>Title</label>
        <input v-model="recipe.title" class="form-control" required />
      </div>

      <!-- Image -->
      <div class="form-group mb-3">
        <label>Image URL</label>
        <input v-model="recipe.image" class="form-control" />
      </div>

      <!-- Time & Servings -->
      <div class="form-row mb-3">
        <div class="col">
          <label>Ready In Minutes</label>
          <input type="number" v-model.number="recipe.ready_in_minutes" class="form-control" required />
        </div>
        <div class="col">
          <label>Servings</label>
          <input type="number" v-model.number="recipe.servings" class="form-control" required />
        </div>
      </div>

      <!-- Summary -->
      <div class="form-group mb-3">
        <label>Summary</label>
        <textarea v-model="recipe.summary" class="form-control"></textarea>
      </div>

      <!-- Checkboxes -->
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" v-model="recipe.vegan" />
        <label class="form-check-label">Vegan</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" v-model="recipe.vegetarian" />
        <label class="form-check-label">Vegetarian</label>
      </div>
      <div class="form-check form-check-inline mb-3">
        <input class="form-check-input" type="checkbox" v-model="recipe.is_gluten_free" />
        <label class="form-check-label">Gluten-Free</label>
      </div>

      <hr />
      <!-- Ingredients -->
      <h5>Ingredients</h5>
      <div v-for="(ing, index) in recipe.ingredients" :key="index" class="form-row align-items-center mb-2">
        <div class="col"><input class="form-control" placeholder="Name" v-model="ing.name" required /></div>
        <div class="col"><input class="form-control" placeholder="Quantity" v-model="ing.quantity" required /></div>
        <div class="col"><input class="form-control" placeholder="Unit" v-model="ing.unit" /></div>
        <div class="col-auto">
          <button type="button" class="btn btn-danger" @click="removeIngredient(index)">X</button>
        </div>
      </div>
      <button type="button" class="btn btn-secondary mb-3" @click="addIngredient">+ Add Ingredient</button>

      <hr />
      <!-- Instructions -->
      <h5>Instructions</h5>
      <div v-for="(inst, index) in recipe.instructions" :key="index" class="form-group mb-2">
        <label>Step {{ index + 1 }}</label>
        <textarea class="form-control" v-model="inst.step" required></textarea>
        <button type="button" class="btn btn-sm btn-danger mt-1" @click="removeInstruction(index)">Remove</button>
      </div>
      <button type="button" class="btn btn-secondary mb-3" @click="addInstruction">+ Add Step</button>

      <div class="mt-3 text-end">
        <b-button variant="secondary" @click="resetForm">Reset</b-button>
        <b-button type="submit" variant="primary">Submit Recipe</b-button>
      </div>
    </form>
  </b-modal>
</template>

<script setup>
import { ref, reactive, defineExpose } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import store from '@/store'

const show = ref(false)
const router = useRouter()


function open() {
  show.value = true
}

defineExpose({ open })

const recipe = reactive({
  title: '',
  image: '',
  ready_in_minutes: null,
  summary: '',
  servings: null,
  vegan: false,
  vegetarian: false,
  is_gluten_free: false,
  ingredients: [{ name: '', quantity: '', unit: '' }],
  instructions: [{ step: '' }]
})

function resetForm() {
  recipe.title = ''
  recipe.image = ''
  recipe.ready_in_minutes = null
  recipe.summary = ''
  recipe.servings = null
  recipe.vegan = false
  recipe.vegetarian = false
  recipe.is_gluten_free = false
  recipe.ingredients = [{ name: '', quantity: '', unit: '' }]
  recipe.instructions = [{ step: '' }]
}

function addIngredient() {
  recipe.ingredients.push({ name: '', quantity: '', unit: '' })
}
function removeIngredient(index) {
  recipe.ingredients.splice(index, 1)
}
function addInstruction() {
  recipe.instructions.push({ step: '' })
}
function removeInstruction(index) {
  recipe.instructions.splice(index, 1)
}

async function submitRecipe() {
  if (!recipe.title || recipe.ingredients.length === 0 || recipe.instructions.length === 0) {
    alert('Please fill all required fields.')
    return
  }

  try {
    await axios.post(`${store.server_domain}/users/addNewRecipe`, {
      ...recipe,
      instructions: recipe.instructions.map(i => i.step)
    }, { withCredentials: true })

    alert('Recipe created successfully!')
    resetForm()
    show.value = false
    router.push('/my-recipes') // Redirect to My Recipes page
  } catch (err) {
    alert('Failed to create recipe: ' + err.message)
  }
}
</script>
