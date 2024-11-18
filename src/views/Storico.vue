<template>
  <v-app>
    <v-app-bar app color="white" dark>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="80" height="80" />
      <v-spacer></v-spacer>
      <v-btn>
        <RouterLink to="/">Home</RouterLink>
      </v-btn>
      <v-btn>
        <RouterLink to="/register">Registrazione</RouterLink>
      </v-btn>
      <v-btn>
        <RouterLink to="/onboardingTab">Tabella</RouterLink>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <h1 class="text-center">Storico delle Credenziali</h1>

        <!-- Griglia per mostrare due card per riga -->
        <v-row dense>
          <v-col v-for="(credentials, index) in credentialsHistory" :key="index" cols="12" md="6">
            <v-card class="my-3" outlined>
              <v-card-title>Credenziali #{{ index }}</v-card-title>
              <!-- +1 per iniziare da 1 -->
              <v-card-text>
                <pre>{{ JSON.stringify(credentials, null, 2) }}</pre>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer class="pa-3" dark>
      <v-container>
        <p class="text-center white--text">&copy; 2024 Data Governance Web App</p>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Dati delle credenziali storiche
const credentialsHistory = ref<any[]>([])

onMounted(() => {
  // Recupera le credenziali dell'utente dal localStorage
  const storedCredentials = JSON.parse(localStorage.getItem('userCredentials') || '[]')
  credentialsHistory.value = storedCredentials
})
</script>

<style scoped>
.v-footer {
  text-align: center;
  background-color: #4caf50;
  color: white;
}
</style>
