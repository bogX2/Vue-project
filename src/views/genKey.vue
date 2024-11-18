<template>
  <v-app>
    <!-- Container centrato -->
    <v-container class="d-flex align-center justify-center fill-height">
      <v-card class="mx-auto" max-width="500">
        <v-card-title>Registrazione Utente</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isValid">
            <v-text-field v-model="formData.name" label="Nome Utente" required></v-text-field>

            <v-text-field
              v-model="formData.email"
              label="Email"
              type="email"
              :rules="[rules.required, rules.email]"
              required
            ></v-text-field>

            <v-select v-model="formData.role" :items="roles" label="Ruolo" required></v-select>

            <v-btn :disabled="!isValid" color="primary" @click="registerUser"> Registrati </v-btn>

            <v-btn color="secondary" @click="generateKeys"> Genera Chiavi </v-btn>
          </v-form>

          <!-- Visualizzazione chiavi generate -->
          <div v-if="generatedKeys" class="generated-keys">
            <h3>Chiavi Generate:</h3>
            <p><strong>Chiave Pubblica:</strong> {{ generatedKeys.ecdh_public_key }}</p>
            <p><strong>Keyring:</strong> {{ generatedKeys.keyring.ecdh }}</p>
          </div>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Footer -->
    <v-footer class="pa-3" color="green" dark>
      <v-container>
        <p class="text-center white--text">&copy; 2024 Data Governance Web App</p>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const form = ref()
const isValid = ref(false)

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
    console.log('Dati registrazione:', formData.value)
    localStorage.setItem('user', JSON.stringify(formData.value))
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
}
</style>
