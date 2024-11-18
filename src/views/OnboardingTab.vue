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
        <RouterLink to="/register">Registrati</RouterLink>
      </v-btn>
      <v-btn>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <h1 class="text-center">Elenco Utenti</h1>
        <v-data-table :headers="headers" :items="users" class="elevation-1" item-value="name">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Utenti Registrati</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>

          <template v-slot:no-data>
            <v-btn color="primary" @click="reloadUsers">Ricarica Utenti</v-btn>
          </template>
        </v-data-table>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app color="green" dark>
      <v-container>
        <p class="text-center">&copy; 2024 Data Governance Web App</p>
      </v-container>
    </v-footer>
  </v-app>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Array utenti
const users = ref<
  Array<{
    id: string | null
    name: string
    email: string
    role: string
    publicKey: string | null
    privateKey: string | null
  }>
>([])

// Intestazioni della tabella
const headers = [
  { text: 'Nome', value: 'name' },
  { text: 'Email', value: 'email' },
  { text: 'Ruolo', value: 'role' },
  { text: 'ID', value: 'id' }, // Nuova colonna per ID
  { text: 'Chiave Pubblica', value: 'publicKey' },
  { text: 'Chiave Privata', value: 'privateKey' },
]

// Recupera utenti salvati nel localStorage
const reloadUsers = () => {
  const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
  users.value = storedUsers
}

// Carica utenti all'avvio
onMounted(() => {
  reloadUsers()
})
</script>
<style scoped>
.v-footer {
  text-align: center;
  background-color: #4caf50;
  color: white;
}
.text-center {
  text-align: center;
}
</style>
