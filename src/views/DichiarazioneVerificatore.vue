<template>
  <v-app>
    <!-- Header con Navbar in linea -->
    <v-app-bar app color="white" dark>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="80" height="80" />
      <v-spacer></v-spacer>
      <v-btn>
        <RouterLink to="/">Home</RouterLink>
      </v-btn>
      <v-btn>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
      </v-btn>
      <v-btn>
        <RouterLink to="/onboardingTab">Tabella</RouterLink>
      </v-btn>
      <v-btn>
        <RouterLink to="/storico">Storico</RouterLink>
      </v-btn>
    </v-app-bar>
    <v-main>
      <div>ciao</div>
    </v-main>

    <!-- Footer -->
    <v-footer class="pa-3" dark>
      <v-container>
        <p class="text-center white--text">&copy; 2024 Data Governance Web App</p>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script></script>

<style scoped>
.v-footer {
  text-align: center;
  background-color: #4caf50;
  color: white;
}
v-main {
  flex: 1; /* Per occupare lo spazio rimanente */
}
</style>
