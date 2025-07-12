<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <h1 class="title">404 - Page Not Found</h1>
      <p class="message">
        There's nothing here... but you can always go back to the homepage.
      </p>
      <p class="message contact">
        If you believe this is a mistake, it's possible that our daily API key limit has been reached.
        Please contact the developers: 
        <br />
        <strong>Noam Tarshish:</strong>
        <a href="mailto:noamtars@post.bgu.ac.il"> noamtars@post.bgu.ac.il</a> |
        <strong>Shay Harush:</strong>
        <a href="mailto:shayhar@post.bgu.ac.il"> shayhar@post.bgu.ac.il</a>
      </p>
      <b-button variant="primary" class="home-btn" @click="goHome">Back to Home</b-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  background-color: #f9f5f0; 
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  background-color: #fffdf8;
  border-radius: 20px;
  padding: 3rem 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.title {
  font-size: 3rem;
  color: #4b2e2e;
  margin-bottom: 1rem;
}

.message {
  font-size: 1.2rem;
  color: #5c4033;
  margin-bottom: 2rem;
}

.contact a {
  color: #a96d49;
  text-decoration: none;
  font-weight: 500;
}

.contact a:hover {
  text-decoration: underline;
}

.home-btn {
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  background-color: #c08457;
  border-color: #c08457;
  color: #fff;
}

.home-btn:hover {
  background-color: #a96d49;
  border-color: #a96d49;
}
</style>
