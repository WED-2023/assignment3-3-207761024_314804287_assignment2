<template>
  <div class="about-page">
    <div class="container mt-4 about-container">
      <h2 class="mb-4 text-center">About This Project</h2>

      <section class="mb-5">
        <h4>Project Overview</h4>
        <p>
          This full-stack web application was developed as part of the "Web Development Environments" course at Ben-Gurion University.
          The system enables users to discover, save, and manage recipes, including personal, public, and family recipes, while tracking cooking progress in real-time.
        </p>
        <p>The development process was divided into three key parts:</p>
        <ul>
          <li><strong>3.1 - API Design:</strong> A full specification of all server endpoints was created to serve as a contract between frontend and backend.</li>
          <li><strong>3.2 - Backend:</strong> Implemented using Node.js, Express, and MySQL. It supports authentication, user management, recipe CRUD operations, and integration with Spoonacular's API.</li>
          <li><strong>3.3 - Frontend:</strong> Built using Vue.js with Bootstrap-Vue for styling and responsiveness. The system includes user registration/login, recipe search, personal area, favorites, family recipes, and bonus pages for recipe preparation and meal planning.</li>
        </ul>
      </section>

      <section class="mb-5">
        <h4>Our Team</h4>
        <div class="row">
          <div class="col-md-6 text-center mb-4">
            <img src="@/assets/noam.jpg" alt="Noam Tarshish" class="team-img mb-2" />
            <h5>Noam Tarshish</h5>
            <p class="mb-1"><strong>Role:</strong> Frontend Developer</p>
            <p class="mb-1">Email: <a href="mailto:noamtars@post.bgu.ac.il">noamtars@post.bgu.ac.il</a></p>
            <p>
              Software & Information Systems Engineering Student, Ben-Gurion University.<br />
              Passionate about UX, visual design, and performance optimization.
            </p>
          </div>
          <div class="col-md-6 text-center mb-4">
            <img src="@/assets/shay.jpg" alt="Shay Harush" class="team-img mb-2" />
            <h5>Shay Harush</h5>
            <p class="mb-1"><strong>Role:</strong> Backend Developer</p>
            <p class="mb-1">Email: <a href="mailto:shayhar@post.bgu.ac.il">shayhar@post.bgu.ac.il</a></p>
            <p>
              Software & Information Systems Engineering Student, Ben-Gurion University.<br />
              Focused on building scalable, secure, and efficient server-side systems.
            </p>
          </div>
        </div>
      </section>

      <section class="mb-4">
        <h4>Useful Links</h4>
        <ul>
          <li>
            <a href="https://github.com/WED-2023/assignment3-2-207761024_314804287_assignment2" target="_blank">
              Backend Repository (Part 3.2)
            </a>
          </li>
          <li>
            <a href="https://github.com/WED-2023/assignment3-3-207761024_314804287_assignment2" target="_blank">
              Frontend Repository (Part 3.3)
            </a>
          </li>
        </ul>
      </section>

      <section class="mt-5 text-center">
        <p>
          If you encounter any issues or have suggestions, feel free to contact us.
          We’re happy to hear your feedback and answer any questions about the system or its features.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.about-page {
  min-height: 100vh;
  background: url('@/assets/back.jpg') no-repeat center center fixed;
  background-size: cover;
  padding: 3rem 1rem;
  font-family: 'Poppins', sans-serif;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.about-container {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  max-width: 960px;
  width: 100%;
  color: #222;
}

h2 {
  font-size: 2.2rem;
  font-weight: 600;
}

h4 {
  margin-top: 2rem;
  font-weight: 600;
  color: #333;
}

p, li {
  font-size: 1.05rem;
  line-height: 1.6;
}

.team-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffffffaa;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

a {
  color: #a94442;
  text-decoration: none;
}

a:hover {
  color: #872b2b;
  text-decoration: underline;
}
</style>
