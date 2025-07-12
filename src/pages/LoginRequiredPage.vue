<template>
  <div class="login-required-page">
    <div class="login-required-content">
      <h1 class="title">Login Required</h1>
      <p class="message">
        This feature is available only for registered and logged-in users.
      </p>

      <div class="btn-group">
        <button class="custom-btn primary" @click="goToLogin">Login</button>
        <button class="custom-btn outline" @click="goToRegister">Register</button>
      </div>

      <div v-if="fromRecipeId" class="back-link">
        <button class="custom-btn back" @click="goBackToRecipe">View Recipe Anyway</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();

const fromRecipeId = route.query.from;

const goToLogin = () => router.push('/login');
const goToRegister = () => router.push('/register');
const goBackToRecipe = () => router.push(`/recipe/${fromRecipeId}`);
</script>

<style scoped>
.login-required-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  background-color: #f9f5f0;
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
}

.login-required-content {
  text-align: center;
  background-color: #fffdf8;
  border-radius: 20px;
  padding: 3rem 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.title {
  font-size: 2.8rem;
  color: #4b2e2e;
  margin-bottom: 1rem;
}

.message {
  font-size: 1.15rem;
  color: #5c4033;
  margin-bottom: 2rem;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.custom-btn {
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.custom-btn.primary {
  background-color: #c08457;
  border-color: #c08457;
  color: #fff;
}

.custom-btn.primary:hover {
  background-color: #a96d49;
  border-color: #a96d49;
}

.custom-btn.outline {
  background-color: transparent;
  border: 2px solid #c08457;
  color: #c08457;
}

.custom-btn.outline:hover {
  background-color: #f7e8dd;
}

.custom-btn.back {
  background-color: #fff;
  border: 2px dashed #c08457;
  color: #c08457;
  margin-top: 1rem;
}

.custom-btn.back:hover {
  background-color: #fff8f3;
}

.back-link {
  margin-top: 1rem;
}
</style>