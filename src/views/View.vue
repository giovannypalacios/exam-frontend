<template>
  <div>
    <b-navbar
      toggleable="lg"
      type="dark"
      variant="primary"
    >
      <b-navbar-brand to="/">Exam Test</b-navbar-brand>
      <router-link to="/">Inicio</router-link>
      <router-link to="/clientes">Customers</router-link>
    </b-navbar>
    <main class="container">
      <router-view />
    </main>
  </div>
</template>
