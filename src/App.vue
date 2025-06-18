<template>
  <div id="app">
    <div id="nav">
      <router-link :to="{ name: 'main' }">Vue Recipes</router-link> |
      <router-link :to="{ name: 'search' }">Search</router-link> |
      <span v-if="!store.username">
        Guest:
        <router-link :to="{ name: 'register' }">Register</router-link> |
        <router-link :to="{ name: 'login' }">Login</router-link> |
      </span>
      <span v-else>
        {{ store.username }}:
        <button @click="onLogout" class="btn btn-link p-0">Logout</button> |
      </span>
    </div>
    <router-view />
  </div>
</template>

<script>
// import { getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import store from './store'; 

export default {
  name: "App",
  setup() {
    const router = useRouter();
    // const internalInstance = getCurrentInstance();
    // const store = internalInstance.appContext.config.globalProperties.store;
    // const toast = internalInstance.appContext.config.globalProperties.toast;
    // const router = internalInstance.appContext.config.globalProperties.$router;

    const onLogout = async () => {
      store.logout();
      // toast("Logout", "User logged out successfully", "success");
      await router.push("/").catch(() => {});
    };

    console.log('Logout successful');


    return { store, onLogout };
  }
}
</script>

<style lang="scss">
@import "@/scss/form-style.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
