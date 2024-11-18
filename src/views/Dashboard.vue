<template>
  <v-app>
    <!-- Navbar -->
    <v-app-bar app color="white" elevate-on-scroll>
      <v-toolbar-title>
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn>
        <RouterLink to="/onboardingTab">Tabella</RouterLink>
      </v-btn>
      <v-btn>
        <RouterLink to="/storico">Storico</RouterLink>
      </v-btn>
      <v-btn @click="logoutUser" color="error">Logout</v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <h1 class="text-center">Benvenuto, {{ user.name }}</h1>
        <p class="text-center mb-2">
          Accedi alla pagina di dichiarazione per firmare la tua dichiarazione.
        </p>

        <!-- Link alla pagina dichiarazione in base al ruolo (Dichiarazione o DichiarazioneVerificatore) -->
        <v-btn v-if="user.role === 'Coltivatore'" color="primary" class="mx-auto d-block">
          <RouterLink to="/dichiarazione" class="text-decoration-none" style="color: white">
            Vai alla dichiarazione
          </RouterLink>
        </v-btn>
        <v-btn v-if="user.role === 'Produttore'" color="primary" class="mx-auto d-block">
          <RouterLink
            to="/dichiarazioneProduttore"
            class="text-decoration-none"
            style="color: white"
          >
            Vai alla dichiarazione
          </RouterLink>
        </v-btn>
        <v-btn v-if="user.role === 'Verificatore'" color="primary" class="mx-auto d-block mt-3">
          <RouterLink
            to="/dichiarazioneVerificatore"
            class="text-decoration-none"
            style="color: white"
          >
            Vai alla dichiarazione
          </RouterLink>
        </v-btn>

        <v-btn color="secondary" class="mx-auto d-block mt-3">
          <RouterLink to="/storico" class="text-decoration-none" style="color: white">
            Visualizza Storico Credenziali
          </RouterLink>
        </v-btn>

        <!-- Dettagli utente -->
        <v-card class="mx-auto mt-5" max-width="500">
          <v-card-title>Dettagli Utente</v-card-title>
          <v-card-text>
            <p><strong>Nome:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Ruolo:</strong> {{ user.role }}</p>
            <p><strong>ID:</strong> {{ user.id }}</p>
            <p><strong>Chiave Pubblica:</strong> {{ user.publicKey }}</p>
            <p><strong>Chiave Privata:</strong> {{ user.privateKey }}</p>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer class="pa-3">
      <v-container>
        <p class="text-center white--text">&copy; 2024 Data Governance Web App</p>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Stato utente
const user = ref<{
  id: string | null
  name: string
  email: string
  role: string
  publicKey: string | null
  privateKey: string | null
}>({
  id: null,
  name: '',
  email: '',
  role: '',
  publicKey: null,
  privateKey: null,
})

// Protezione della Dashboard
onMounted(() => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
  console.log('Ruolo utente:', storedUser.role)
  if (!storedUser.name) {
    router.push('/login') // Redireziona se l'utente non è autenticato
  } else {
    user.value = storedUser
  }
})

// Funzione di logout
function logoutUser() {
  localStorage.removeItem('user') // Rimuove l'utente dal localStorage
  router.push('/login') // Redireziona alla pagina di login
}
</script>

<style scoped>
.v-footer {
  text-align: center;
  background-color: #4caf50;
  color: white;
}
.v-main {
  overflow-y: auto;
  height: calc(100vh - 64px); /* 64px per l'header */
}
</style>
