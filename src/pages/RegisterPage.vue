<template>
  <div class="register-page">
    <div class="info-text">
      <h1>Discover 15,000+ Recipes</h1>
      <p>
        Search for recipes, create your own recipes, build your personal meal plan, save family recipes, and share your favorites with the world.
      </p>
    </div>
    <div class="form-wrapper">
        <h2 class="form-title">Register</h2>
        <b-form @submit.prevent="onRegister" @reset.prevent="onReset">
          <!-- Username -->
          <b-form-group label="Username:" label-for="username">
            <b-form-input
              id="username"
              v-model="form.username"
              :state="usernameTaken ? false : (v$.form.username.$dirty ? !v$.form.username.$invalid : null)"
              @blur="v$.form.username.$touch()"
              placeholder="Choose a username"
            />
            <b-form-invalid-feedback v-if="usernameTaken">
              This username is already taken. Please choose another.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="v$.form.username.$error">
              <div v-if="!v$.form.username.required">Username is required.</div>
              <div v-else-if="!v$.form.username.minLength">Minimum 3 characters.</div>
              <div v-else-if="!v$.form.username.maxLength">Maximum 8 characters.</div>
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- First Name -->
          <b-form-group label="First Name:" label-for="firstName">
            <b-form-input
              id="firstName"
              v-model="form.firstName"
              :state="v$.form.firstName.$dirty ? !v$.form.firstName.$invalid : null"
              @blur="v$.form.firstName.$touch()"
              placeholder="Your first name"
            />
            <b-form-invalid-feedback v-if="v$.form.firstName.$error">
              <div v-if="!v$.form.firstName.required">First name is required.</div>
              <div v-else-if="!v$.form.firstName.alpha">Only letters allowed.</div>
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- Last Name -->
          <b-form-group label="Last Name:" label-for="lastName">
            <b-form-input
              id="lastName"
              v-model="form.lastName"
              :state="v$.form.lastName.$dirty ? !v$.form.lastName.$invalid : null"
              @blur="v$.form.lastName.$touch()"
              placeholder="Your last name"
            />
            <b-form-invalid-feedback v-if="v$.form.lastName.$error">
              <div v-if="!v$.form.lastName.required">Last name is required.</div>
              <div v-else-if="!v$.form.lastName.alpha">Only letters allowed.</div>
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- Email -->
          <b-form-group label="Email:" label-for="email">
            <b-form-input
              id="email"
              type="email"
              v-model="form.email"
              :state="v$.form.email.$dirty ? !v$.form.email.$invalid : null"
              @blur="v$.form.email.$touch()"
              placeholder="name@example.com"
            />
            <b-form-invalid-feedback v-if="v$.form.email.$error">
              <div v-if="!v$.form.email.required">Email is required.</div>
              <div v-else-if="!v$.form.email.email">Invalid email format.</div>
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- Country -->
          <b-form-group label="Country:" label-for="country">
            <b-form-select
              id="country"
              v-model="form.country"
              :options="countries"
              :state="v$.form.country.$dirty ? !v$.form.country.$invalid : null"
              @change="v$.form.country.$touch()"
            />
            <b-form-invalid-feedback v-if="v$.form.country.$error">Country is required.</b-form-invalid-feedback>
          </b-form-group>

          <!-- Password -->
          <b-form-group label="Password:" label-for="password">
            <b-form-input
              id="password"
              type="password"
              v-model="form.password"
              :state="v$.form.password.$dirty ? !v$.form.password.$invalid : null"
              @blur="v$.form.password.$touch()"
              placeholder="••••••••"
            />
            <b-form-invalid-feedback v-if="v$.form.password.$error">
              <div v-if="!v$.form.password.required">Password is required.</div>
              <div v-else-if="!v$.form.password.minLength">Password too short.</div>
              <div v-else-if="!v$.form.password.maxLength">Password too long.</div>
              <div v-else-if="!v$.form.password.hasDigit">Must include at least one number.</div>
              <div v-else-if="!v$.form.password.hasSpecial">Must include special character.</div>
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- Confirm Password -->
          <b-form-group label="Confirm Password:" label-for="confirmedPassword">
            <b-form-input
              id="confirmedPassword"
              type="password"
              v-model="form.confirmedPassword"
              :state="v$.form.confirmedPassword.$dirty ? !v$.form.confirmedPassword.$invalid : null"
              @blur="v$.form.confirmedPassword.$touch()"
              placeholder="Repeat password"
            />
            <b-form-invalid-feedback v-if="v$.form.confirmedPassword.$error">
              <div v-if="!v$.form.confirmedPassword.required">Confirmation is required.</div>
              <div v-else-if="!v$.form.confirmedPassword.sameAsPassword">Passwords must match.</div>
            </b-form-invalid-feedback>
          </b-form-group>

          <div class="d-flex justify-content-between mt-4">
            <b-button type="reset" variant="danger">Reset</b-button>
            <b-button type="submit" variant="primary" class="submit-btn">Register</b-button>
          </div>

          <b-alert class="mt-3" v-if="submitError" variant="danger" dismissible show>
            Register failed: {{ submitError }}
          </b-alert>
        </b-form>
      </div>
    </div>
</template>


<script>
import { computed,reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import useVuelidate from '@vuelidate/core';
import { required, minLength, maxLength, sameAs, alpha,email } from '@vuelidate/validators';
import axios from 'axios';
import store from '../store';
import countries from '../assets/countries';


export default {
  name: 'RegisterPage',
  setup() {

    const router = useRouter(); 
    const form = reactive({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      country: "",
      password: "",
      confirmedPassword: "",
    });

    const usernameTaken = ref(false);
    const passwordComputed = computed(() => form.password);

    const rules = {
      form: {
        username: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(8),
        },
        firstName: { required, alpha },
        lastName: { required, alpha },
        email: { required, email },
        country: { required },
        password: {
          required,
          minLength: minLength(5),
          maxLength: maxLength(10),
          hasDigit: (value) => /\d/.test(value),
          hasSpecial: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
        },
        confirmedPassword: {
          required,
          sameAsPassword: sameAs(passwordComputed)
        },
      },
    };

    const v$ = useVuelidate(rules, { form });
    const submitError = ref(null);
    const countryList = [{ value: null, text: "", disabled: true }].concat(countries);

    const onRegister = async () => {
      console.log('Register function called');
      v$.value.$touch(); 
      usernameTaken.value = false;
      submitError.value = null;
      
      if (v$.value.$invalid) {
        console.log('Form is invalid');
        return;
      }

      console.log('Form is valid, sending registration request...');

      try {
        const response = await axios.post(`${store.server_domain}/Register`, {
          username: form.username,
          firstname: form.firstName,
          lastname: form.lastName,
          country: form.country,
          password: form.password,
          email: form.email
        }, {withCredentials: true});
        
        console.log('Registration successful:', response);
        router.push('/login'); 
        
      } catch (error) {
        const msg = error.response?.data?.message || 'Registration failed';
        submitError.value = msg;

        if (msg.toLowerCase().includes('username')) {
          usernameTaken.value = true;
          v$.value.form.username.$touch(); 
        }
      }
    };

    const onReset = () => {
      Object.assign(form, {
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        password: "",
        confirmedPassword: "",
      });
      v$.value.$reset();
      submitError.value = null;
      usernameTaken.value = false;
    };

    return { form, v$, submitError, countries: countryList, onRegister, onReset, usernameTaken };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

body {
  font-family: 'Poppins', sans-serif;
}

.register-page {
  background: url('@/assets/back.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 2rem;
  position: relative;
}

.info-text {
  position: absolute;
  left: 23%;
  top: 31%;
  color: rgb(0, 0, 0);
  max-width: 400px;
  text-shadow: 2px 2px 5px rgba(0,0,0,0.4);
  z-index: 1;
}

.info-text h1 {
  font-size: 2.5rem;
  font-weight: bold;
}

.info-text p {
  font-size: 1.2rem;
  margin-top: 1rem;
}

.form-wrapper {
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;

  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.4); 
  
  box-shadow:
    0 8px 32px 0 rgba(31, 38, 135, 0.2),
    0 12px 48px -8px rgba(0, 0, 0, 0.15); 
  
  padding: 3rem 2.5rem;
  animation: fadeInUp 0.8s ease-out both;
  transition: all 0.3s ease-in-out;
  position: relative;
}

.form-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 5px;
  border-top-left-radius: 32px;
  border-bottom-left-radius: 32px;
  background: linear-gradient(to bottom, #c9945c, #ffe0b2);
}


.form-wrapper input,
.form-wrapper select {
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
}

.form-wrapper input:focus,
.form-wrapper select:focus {
  border-color: #c9945c;
  box-shadow: 0 0 6px rgba(201, 148, 92, 0.4);
  outline: none;
}



.submit-btn {
  background-color: #c9945c;
  border: none;
  font-weight: bold;
  transition: 0.3s ease-in-out;
}

.submit-btn:hover {
  background-color: #b47e45;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>


