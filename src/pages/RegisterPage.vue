
<template>
  <div class="container">
    <h1 class="title">Register</h1>
    <b-form @submit.prevent="onRegister" @reset.prevent="onReset">
      <!-- Username -->
      <b-form-group label="Username:" label-for="username">
        <b-form-input
          id="username"
          v-model="form.username"
          :state="v$.form.username.$dirty ? !v$.form.username.$invalid : null"
          @blur="v$.form.username.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.form.username.$error">
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
        />
        <b-form-invalid-feedback v-if="v$.form.confirmedPassword.$error">
          <div v-if="!v$.form.confirmedPassword.required">Confirmation is required.</div>
          <div v-else-if="!v$.form.confirmedPassword.sameAsPassword">Passwords must match.</div>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="reset" variant="danger">Reset</b-button>
      <b-button type="submit" variant="primary">Register</b-button>

      <b-alert class="mt-2" v-if="submitError" variant="danger" dismissible show>
        Register failed: {{ submitError }}
      </b-alert>
    </b-form>
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
        console.error('Registration error:', error);
        submitError.value = error.response?.data?.message || 'Registration failed';
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
    };

    return { form, v$, submitError, countries: countryList, onRegister, onReset };
  },
};
</script>