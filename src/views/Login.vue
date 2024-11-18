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
        <RouterLink to="/onboardingTab">Tabella</RouterLink>
      </v-btn>
      <v-btn>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-card class="mx-auto" max-width="500">
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="isValid">
              <v-text-field
                v-model="loginData.name"
                label="Nome Utente"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-btn color="primary" @click="loginUser">Login</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
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

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isValid = ref(false)

const loginData = ref({
  name: '',
})

const rules = {
  required: (value) => !!value || 'Campo obbligatorio',
}

function loginUser() {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const user = users.find((u) => u.name === loginData.value.name)

  if (user) {
    // Memorizza l'utente attivo
    localStorage.setItem('user', JSON.stringify(user))
    router.push('/dashboard') // Redireziona alla dashboard
  } else {
    alert('Nome utente non trovato. Registrati prima.')
  }
}
</script>
<style scoped>
.v-footer {
  text-align: center;
  background-color: #4caf50;
  color: white;
}
</style>
