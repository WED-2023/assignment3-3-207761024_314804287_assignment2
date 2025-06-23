<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-center">About This Project</h2>

    <section class="mb-5">
      <h4>Project Overview</h4>
      <p>
        This full-stack web application was developed as part of the "Web Development Environments" course at Ben-Gurion University.
        The system enables users to discover, save, and manage recipes, including personal, public, and family recipes, while tracking cooking progress in real-time.
      </p>
      <p>
        The development process was divided into three key parts:
      </p>
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
          <img src="@/assets/noam.jpg" alt="Noam Tarshish" class="rounded-circle mb-2" style="width: 150px; height: 150px;" />
          <h5>Noam Tarshish</h5>
          <p class="mb-1"><strong>Role:</strong> Frontend Developer</p>
          <p class="mb-1">Email: <a href="mailto:noamtar@post.bgu.ac.il">noamtar@post.bgu.ac.il</a></p>
          <p>Software & Information Systems Engineering Student, Ben-Gurion University.<br />
             Passionate about UX, visual design, and performance optimization.</p>
        </div>
        <div class="col-md-6 text-center mb-4">
          <img src="@/assets/shay.jpg" alt="Shay Harush" class="rounded-circle mb-2" style="width: 150px; height: 150px;" />
          <h5>Shay Harush</h5>
          <p class="mb-1"><strong>Role:</strong> Backend Developer</p>
          <p class="mb-1">Email: <a href="mailto:shayhar@post.bgu.ac.il">shayhar@post.bgu.ac.il</a></p>
          <p>Software & Information Systems Engineering Student, Ben-Gurion University.<br />
             Focused on building scalable, secure, and efficient server-side systems.</p>
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
      <p>If you encounter any issues or have suggestions, feel free to contact us. We’re happy to hear your feedback and answer any questions about the system or its features.</p>
    </section>
  </div>
</template>

<style scoped>
h4 {
  margin-top: 20px;
}
</style>

