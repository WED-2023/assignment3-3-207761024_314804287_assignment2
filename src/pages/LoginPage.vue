<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="title">Login</h1>

      <b-form @submit.prevent="onLogin">
        <!-- Username -->
        <b-form-group label="Username:" label-for="username">
          <b-form-input
            id="username"
            v-model="form.username"
            :state="usernameNotFound ? false : (v$.form.username.$dirty ? !v$.form.username.$invalid : null)"
            @blur="v$.form.username.$touch()"
            class="custom-input"
          />
          <b-form-invalid-feedback v-if="usernameNotFound">
            Username not found. Please try again.
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-else-if="v$.form.username.$error">
            Username is required.
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Password -->
        <b-form-group label="Password:" label-for="password">
          <b-form-input
            id="password"
            type="password"
            v-model="form.password"
            :state="wrongPassword ? false : (v$.form.password.$dirty ? !v$.form.password.$invalid : null)"
            @blur="v$.form.password.$touch()"
            class="custom-input"
          />
          <b-form-invalid-feedback v-if="wrongPassword">
            Incorrect password. Please try again.
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-else-if="v$.form.password.$error">
            <div v-if="!v$.form.password.required">Password is required.</div>
            <div v-else-if="!v$.form.password.minLength">Password too short.</div>
            <div v-else-if="!v$.form.password.maxLength">Password too long.</div>
            <div v-else-if="!v$.form.password.hasDigit">Must include at least one number.</div>
            <div v-else-if="!v$.form.password.hasSpecial">Must include special character.</div>
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Submit button -->
        <b-button type="submit" class="login-btn w-100">Login</b-button>

        <!-- Error alert -->
        <b-alert
          class="mt-3"
          variant="danger"
          dismissible
          v-if="submitError"
          show
        >
          {{ submitError }}
        </b-alert>

        <!-- Register link -->
        <div class="mt-3 text-center register-text">
          Don’t have an account?
          <router-link to="/register">Register here</router-link>
        </div>
      </b-form>
    </div>
  </div>
</template>


<script>
import { reactive, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import axios from 'axios';
import store from '../store';

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const form = reactive({
      username: '',
      password: '',
    });

    const rules = {
      form: {
        username: { required },
        password: {
          required,
          minLength: minLength(5),
          maxLength: maxLength(10),
          hasDigit: (value) => /\d/.test(value),
          hasSpecial: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
        },
      },
    };

    const v$ = useVuelidate(rules, { form });
    const submitError = ref(null);
    const usernameNotFound = ref(false);
    const wrongPassword = ref(false);


    const onLogin = async () => {
      console.log('Login function called');
      v$.value.$touch();
      usernameNotFound.value = false;
      wrongPassword.value = false;
      submitError.value = null;

      if (v$.value.$invalid) {
        console.log('Form is invalid');
        return;
      }

      console.log('Form is valid, sending login request');

      try {
        const response = await axios.post(`${store.server_domain}/Login`, {
          username: form.username,
          password: form.password
        }, { withCredentials: true });

        console.log('Login successful:', response);
        store.login(form.username);
        router.push('/');
      } catch (error) {
        console.error('Login error:', error);
        const msg = error.response?.data?.message?.toLowerCase() || 'login failed';

        submitError.value = msg;

        if (msg.includes('username')) {
          usernameNotFound.value = true;
        } else if (msg.includes('password')) {
          wrongPassword.value = true;
        }
      }
    };

    return { form, v$, submitError, onLogin, usernameNotFound, wrongPassword };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.login-page {
  min-height: 100vh;
  background: url('@/assets/back.jpg') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
}




.login-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.1),
    0 16px 40px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 420px;
}

.login-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.8rem;
  color: #333;
}

.custom-input {
  border-radius: 10px;
  padding: 0.6rem 0.9rem;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.custom-input:focus {
  border-color: #c9945c;
  box-shadow: 0 0 6px rgba(201, 148, 92, 0.4);
  outline: none;
}

.login-btn {
  width: 100%;
  margin-top: 1rem;
  background: linear-gradient(to right, #c9945c, #dba76c);
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  transition: background 0.3s ease;
}

.login-btn:hover {
  background: linear-gradient(to right, #b47e45, #cd9756);
}

.register-text {
  font-size: 0.95rem;
  color: #444;
}

.register-text a {
  color: #c35c5c;
  font-weight: 600;
  margin-left: 4px;
  transition: color 0.3s;
  text-decoration: none;
}

.register-text a:hover {
  color: #a64545;
  text-decoration: underline;
}
</style>
