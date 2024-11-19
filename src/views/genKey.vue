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
        <h1 class="text-center">Seleziona una Credenziale per la Verifica</h1>

        <!-- Selettore per scegliere la credenziale da verificare -->
        <v-select
          v-model="selectedCredentialIndex"
          :items="formattedCredentialsHistory"
          item-text="name"
          item-value="id"
          label="Seleziona Credenziale"
          return-object
        />

        <!-- Mostra i dettagli della credenziale selezionata -->
        <v-card v-if="selectedCredential">
          <v-card-title>Dettagli della Credenziale Selezionata</v-card-title>
          <v-card-text class="scrollable-card-text">
            <pre>{{ JSON.stringify(selectedCredential, null, 2) }}</pre>
          </v-card-text>
        </v-card>

        <!-- Pulsante per avviare la verifica della firma -->
        <v-btn color="primary" @click="verifyCredential">Verifica Firma</v-btn>

        <!-- Risultato della verifica -->
        <v-alert v-if="verificationResult" type="success" dismissible>
          Verifica completata con successo!<br />
          Risultato: {{ verificationResult }}
        </v-alert>

        <v-alert v-if="error" type="error" dismissible> Errore: {{ error }} </v-alert>
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
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// Dati delle credenziali storiche
const credentialsHistory = ref<any[]>([])

// Credenziale selezionata dall'utente
const selectedCredentialIndex = ref<any>(null)

// Risultati della verifica
const verificationResult = ref<string | null>(null)
const error = ref<string | null>(null)

// Funzione per caricare le credenziali dal localStorage all'avvio della pagina
onMounted(() => {
  const storedCredentials = JSON.parse(localStorage.getItem('userCredentials') || '[]')
  credentialsHistory.value = storedCredentials
})

// Formatta la lista di credenziali per visualizzarle nel selettore con un nome chiaro
const formattedCredentialsHistory = computed(() => {
  return credentialsHistory.value.map((cred, index) => ({
    id: cred.id,
    name: `Credenziale #${index + 1}: ${cred.id}`,
  }))
})

// Calcola la credenziale selezionata
const selectedCredential = computed(() => {
  return credentialsHistory.value.find((cred) => cred.id === selectedCredentialIndex.value?.id)
})

// Funzione per avviare la verifica della firma
const verifyCredential = async () => {
  if (!selectedCredential.value) {
    alert('Seleziona una credenziale valida per la verifica!')
    return
  }

  const myvc = selectedCredential.value // La credenziale selezionata
  // Chiamata all'API per verificare la firma
  try {
    const response = await axios.post(
      'https://apiroom.net/api/bogx2/verifica-firma-nokeys',
      {
        data: {
          myvc, // La credenziale selezionata
          Issuer: {
            'ecdh public key':
              'BIE5gnxbSlWRVJEzDr6Y4f19io481B2dY8USlE7smgjOMURFrw46fxu4ftR/y3ggevSfIN+/DAZd5EOIcmE6p64=', // Chiave pubblica dell'issuer
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      },
    )

    // Verifica se la risposta è una stringa 'true'
    const verificationStatus = response.data.output[0]
    if (verificationStatus === 'true') {
      verificationResult.value = 'Firma verificata con successo!'
    } else {
      verificationResult.value = 'La verifica della firma non è riuscita.'
    }
    error.value = null
  } catch (err) {
    // Gestisce gli errori
    verificationResult.value = null
  }
}
</script>

<style scoped>
.v-footer {
  text-align: center;
  background-color: #4caf50;
  color: white;
}

.scrollable-card-text {
  max-height: 600px; /* Imposta un'altezza massima per le credenziali */
  overflow-y: auto; /* Permette lo scroll verticale */
  background-color: #f5f5f5; /* Colore di sfondo per migliorare la leggibilità */
  padding: 10px;
  border-radius: 5px;
}
</style>
