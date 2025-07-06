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

      <!-- Image Upload -->
      <div class="form-group mb-3">
        <label class="custom-upload-btn">
          Upload Image
        <input type="file" accept="image/*" @change="onImageUpload" hidden />
        </label>
      </div>

      <!-- Preview -->
      <div v-if="recipe.image" class="mb-3">
        <img :src="recipe.image" alt="Preview" class="img-preview" />
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
          <button type="button" class="btn btn-danger" @click="removeIngredient(index)">Remove</button>
        </div>
      </div>
      <button type="button" class="btn btn-add mb-3" @click="addIngredient">+ Add Ingredient</button>

      <hr />
      <!-- Instructions -->
      <h5>Instructions</h5>
      <div v-for="(inst, index) in recipe.instructions" :key="index" class="form-group mb-2">
        <label>Step {{ index + 1 }}</label>
        <textarea class="form-control" v-model="inst.step" required></textarea>
        <button type="button" class="btn btn-sm btn-danger mt-1" @click="removeInstruction(index)">Remove</button>
      </div>
      <button type="button" class="btn btn-add mb-3" @click="addInstruction">+ Add Step</button>

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

function onImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    recipe.image = reader.result; 
  };
  reader.readAsDataURL(file);
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


<style scoped>
form {
  font-family: 'Poppins', sans-serif;
  color: #3e2e2e;
  background: url('@/assets/try.jpg') no-repeat center center fixed;
  background-color: #ffeedd;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

::v-deep .modal-content {
  background-color: rgba(0, 0, 0, 0.45); 
  backdrop-filter: blur(6px);
  padding: 1.5rem;
  border-radius: 20px;
}

::v-deep .modal-title {
  font-weight: 600;
  font-size: 1.4rem;
  color: #4b2e2e;
}

input.form-control,
textarea.form-control {
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 0.5rem 0.75rem;
  background-color: #fffaf5;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input.form-control:focus,
textarea.form-control:focus {
  border-color: #c9945c;
  box-shadow: 0 0 6px rgba(201, 148, 92, 0.3);
  outline: none;
}

label {
  font-weight: 500;
  margin-bottom: 4px;
}

.form-check {
  margin-right: 1rem;
  margin-bottom: 1rem;
}

.form-check-label {
  margin-left: 6px;
  font-size: 0.95rem;
}

::v-deep .btn-secondary {
  background: linear-gradient(to right, #d46a6a, #c94c4c);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  margin: 0 0.5rem;
}

::v-deep .btn-secondary:hover {
  background: linear-gradient(to right, #b83f3f, #a63131);
}

::v-deep .btn-primary {
  background-color: #d7c1aa;
  color: #4b2e2e;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  transition: background 0.3s ease;
}

::v-deep .btn-primary:hover {
  background-color: #c2a68e;
}

.btn-add {
  background-color: #d7c1aa;
  color: #4b2e2e;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  padding: 6px 16px;
}

.btn-add:hover {
  background-color: #c2a68e;
}

.btn-danger {
  background: linear-gradient(to right, #d46a6a, #c94c4c);;
  color: #781f1f;
  font-weight: bold;
  border: none;
  border-radius: 8px;
}

.btn-danger:hover {
  background-color: #e06b6b;
}

h5 {
  font-weight: 600;
  margin-top: 1.5rem;
  color: #4b2e2e;
}

.form-group,
.form-row {
  margin-bottom: 1rem;
}

hr {
  border-top: 1px solid #e8d8c2;
  margin: 1.5rem 0;
}

.form-row.align-items-center {
  gap: 10px;
}

.img-preview {
  max-width: 100%;
  max-height: 200px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-top: 10px;
}

.custom-upload-btn {
  display: inline-block;
  background-color: #d7c1aa;
  color: #4b2e2e;
  font-weight: bold;
  padding: 8px 18px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.custom-upload-btn:hover {
  background-color: #c2a68e;
}




</style>

