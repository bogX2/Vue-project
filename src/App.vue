<script setup lang="ts">
import { useRoute, RouterLink, RouterView } from 'vue-router'
localStorage.clear()
</script>

<template>
  <v-app class="fill-height">
    <!-- Header visibile solo nella pagina iniziale -->
    <v-container
      v-if="useRoute().path === '/'"
      class="d-flex flex-column align-center justify-center"
      fluid
    >
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
      <v-card elevation="2" class="pa-6 mt-5 text-center" max-width="800">
        <h1>Benvenuto nella Web App di Data Governance</h1>
        <p>Gestisci le tue credenziali in modo sicuro e trasparente.</p>

        <v-btn-group class="mt-4">
          <RouterLink to="/register">
            <v-btn variant="text">Registrazione</v-btn>
          </RouterLink>
          <RouterLink to="/dashboard">
            <v-btn variant="text">Dashboard</v-btn>
          </RouterLink>
          <RouterLink to="/onboardingTab">
            <v-btn variant="text">Onboarding</v-btn>
          </RouterLink>
          <RouterLink to="/storico">
            <v-btn variant="text">Storico</v-btn>
          </RouterLink>
        </v-btn-group>
      </v-card>
    </v-container>

    <!-- Mostra il contenuto dinamico della route corrente -->
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
.fill-height {
  height: 100vh; /* L'app riempie tutta la finestra */
  display: flex;
  flex-direction: column;
}

v-container {
  flex: 1; /* Assicura che il contenitore riempia lo spazio disponibile */
}

v-main {
  flex: 1; /* Per occupare lo spazio rimanente */
}
</style>
