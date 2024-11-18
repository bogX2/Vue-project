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
        <RouterLink to="/onboardingTab">Tabella</RouterLink>
      </v-btn>
      <v-btn>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
      </v-btn>
    </v-app-bar>

    <!-- Main content area (scrollable) -->
    <v-main>
      <v-container>
        <v-card class="mx-auto" max-width="500">
          <v-card-title>Registrazione Utente</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="isValid">
              <v-text-field
                v-model="formData.name"
                label="Nome Utente"
                :rules="[rules.required]"
                required
              >
              </v-text-field>

              <v-text-field
                v-model="formData.email"
                label="Email"
                type="email"
                :rules="[rules.required, rules.email]"
                required
              >
              </v-text-field>

              <v-select
                v-model="formData.role"
                :items="roles"
                label="Ruolo"
                :rules="[rules.required]"
                required
              >
              </v-select>

              <v-btn
                :disabled="!isValid || !generatedKeys"
                color="primary"
                class="mr-5"
                @click="registerUser"
              >
                Registrati
              </v-btn>

              <v-btn color="secondary" @click="generateKeys"> Genera Chiavi </v-btn>
            </v-form>

            <!-- Visualizzazione chiavi generate -->
            <div v-if="generatedKeys" class="generated-keys">
              <h3>Chiavi Generate:</h3>
              <p><strong>Chiave Pubblica:</strong> {{ generatedKeys.ecdh_public_key }}</p>
              <p><strong>Chiave Privata:</strong> {{ generatedKeys.keyring.ecdh }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer class="pa-3" dark>
      <v-container>
        <p class="text-center white--text">&copy; 2024 Data Governance Web App</p>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const form = ref()
const isValid = ref(false)
const router = useRouter()

const formData = ref({
  name: '',
  email: '',
  role: '',
})

const roles = ['Coltivatore', 'Produttore', 'Rivenditore', 'Verificatore']

const rules = {
  required: (value: string) => !!value || 'Campo obbligatorio',
  email: (value: string) => /.+@.+\..+/.test(value) || 'Email non valida',
}

const generatedKeys = ref<null | { ecdh_public_key: string; keyring: { ecdh: string } }>(null)

async function generateKeys() {
  try {
    const response = await axios.get(
      'https://apiroom.net/api/bogx2/genera-la-coppia-di-chiavi--prendndo-in-input-il-nome',
      {
        params: {
          data: JSON.stringify({ myName: formData.value.name }),
        },
      },
    )
    generatedKeys.value = response.data[formData.value.name]
  } catch (error) {
    console.error('Errore nella generazione delle chiavi:', error)
  }
}

function registerUser() {
  if (form.value.validate()) {
    const users = JSON.parse(localStorage.getItem('users') || '[]')

    // Ottieni il ruolo selezionato
    const role = formData.value.role

    // Recupera il contatore del ruolo dal localStorage, inizializza a 1 se non esiste
    const roleCounters = JSON.parse(localStorage.getItem('roleCounters') || '{}')
    const currentCounter = roleCounters[role] || 1

    // Crea un nuovo ID progressivo basato sul ruolo
    const newId = `${role}${currentCounter}`

    // Aggiorna il contatore per il ruolo
    roleCounters[role] = currentCounter + 1
    localStorage.setItem('roleCounters', JSON.stringify(roleCounters))

    // Crea il nuovo oggetto utente con l'ID progressivo
    const newUser = {
      ...formData.value,
      id: newId, // Aggiungi l'ID generato
      publicKey: generatedKeys.value?.ecdh_public_key,
      privateKey: generatedKeys.value?.keyring.ecdh,
    }

    // Aggiungi l'utente alla lista degli utenti e salva nel localStorage
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    // Aggiorna l'utente attivo
    localStorage.setItem('user', JSON.stringify(newUser))

    // Reindirizza alla dashboard
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.generated-keys {
  margin-top: 20px;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
}

.fill-height {
  height: 100vh;
}

.v-footer {
  text-align: center;
  background-color: #4caf50;
  color: white;
}

/* Impostazioni di overflow per evitare che il contenuto si sovrapponga */
.v-main {
  overflow-y: auto;
  height: calc(100vh - 64px); /* 64px per l'header */
}
</style>
