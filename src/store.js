import { reactive } from 'vue';

const store = reactive({
  username: localStorage.getItem('username'),
  server_domain: "http://localhost",
  // server_domain: "https://shay-noam."

  login(username) {
    localStorage.setItem('username', username);
    this.username = username;
    console.log("login", this.username);
  },

  logout() {
    console.log("logout");
    localStorage.removeItem('username');
    this.username = undefined;
  }
});

export default store;
