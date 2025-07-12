import Main from "../pages/MainPage.vue";
import NotFound from "../pages/NotFoundPage.vue";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/RegisterPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/LoginPage.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../pages/SearchPage.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../pages/AboutPage.vue"), 
  },
  {
    path: "/favorites",
    name: "favorites",
    component: () => import("../pages/FavoritesPage.vue"), 
  },
  {
    path: "/my-recipes",
    name: "my-recipes",
    component: () => import("../pages/MyRecipesPage.vue"), 
  },
  {
    path: "/family-recipes",
    name: "family-recipes",
    component: () => import("../pages/FamilyRecipesPage.vue"), 
  },
  {
    path: "/recipe/:recipeId",
    name: "recipe",
    component: () => import("../pages/RecipeViewPage.vue"),
  },
  {
    path: '/progress/:recipeId',
    name: 'RecipeProgressPage',
    component:  () => import("../pages/RecipeProgressPage.vue"),
  },
  {
    path: "/my-meal",
    name: "my-meal",
    component: () => import("../pages/MyMealPage.vue"),
  },
  {
  path: '/login-required',
  name: 'LoginRequired',
  component: () => import('../pages/LoginRequiredPage.vue')
  },
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: NotFound,
  },

  
];

export default routes;
