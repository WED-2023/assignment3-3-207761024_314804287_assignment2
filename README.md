# assignment3_3-frontend-main

A Vue.js-based recipe management application that allows users to:
- Browse and search for recipes.
- Register and log in to a personalized experience.
- Save favorite recipes and manage their own.
- Create and edit family recipes.
- Plan and track their meal progress.
- Enjoy beautiful visuals, engaging UI, and personal touches.

## Project Structure

```
src/
├── assets/                 # Images and static assets
├── components/             # Reusable components (Navbar, modals, previews)
├── pages/                  # Main views/routes (Login, Register, Recipes, etc.)
├── router/
│   └── routes.js           # Vue Router configuration
├── scss/
│   └── form-style.scss     # Custom stylesheets
├── store.js                # App-wide reactive state (Vue 3 composition)
├── main.js                 # App entry point
└── App.vue                 # Root component
```

## Features

- **Registration & Login**: Form validation, feedback, and persistence using cookies.
- **User Profile**: View favorites, own recipes, and meal plan.
- **Recipe View**: Supports API recipes and user-added ones with conditionally rendered images and tags.
- **New Recipe Modal**: Create recipes using a polished modal form.
- **Progress Tracking**: Dynamic meal planning page to track recipe completion.
- **Custom UI**: Uses a warm pastel palette, BootstrapVue components, and custom SCSS for styling.

## Project setup

```bash
npm install
```

## Compiles and hot-reloads for development

```bash
npm run serve
```

## Compiles and minifies for production

```bash
npm run build
```

## Lints and fixes files

```bash
npm run lint
```

## Customize Configuration

See [Configuration Reference](https://cli.vuejs.org/config/)

---

## Contact

- **Project Lead**: Noam Tarshish & Shay Harush    
- **Email**: Noamtars@post.bgu.ac.il & shayhar@post.bgu.ac.il 
- **Repository**: https://github.com/WED-2023/assignment3-2-207761024_314804287_assignment2  

Feel free to open an issue or submit a pull request if you find bugs or want to suggest improvements. Enjoy cooking!