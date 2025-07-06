import { reactive } from 'vue';
import axios from 'axios';

const store = reactive({
  username: localStorage.getItem('username'),
  server_domain: "http://localhost",
  // server_domain: "https://shay-noam."
  mealCount: 0,

  async login(username) {
    localStorage.setItem('username', username);
    this.username = username;
    console.log("login", this.username);

    try {
    const response = await axios.get(`${this.server_domain}/users/MyMeal`, {
      withCredentials: true,
    });
    this.setMealCount(response.data.length);
  } catch (err) {
    console.error("Failed to fetch meal count on login:", err);
  }


  },

  logout() {
    console.log("logout");
    localStorage.removeItem('username');
    this.username = undefined;
  },

  setMealCount(count) {
    this.mealCount = count;
  }
});

export default store;
