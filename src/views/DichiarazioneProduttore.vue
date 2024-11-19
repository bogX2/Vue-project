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
    <!-- Main content area (scrollable) -->
    <v-main>
      <v-container>
        <!-- Titolo della pagina -->
        <v-card class="pa-5">
          <v-card-title class="text-h6">Creazione Credenziale Verificabile</v-card-title>

          <v-card-text>
            <!-- Input per la quantità di magliette prodotte -->
            <v-text-field
              label="Quantità di magliette prodotte"
              v-model.number="tshirtProduction"
              type="number"
              min="0"
              required
            ></v-text-field>

            <!-- Pulsante per generare la credenziale -->
            <v-btn
              color="primary"
              class="mt-3"
              @click="generaCredenziale"
              v-if="!isCredentialGenerated"
            >
              Genera Credenziale
            </v-btn>

            <!-- Pulsante per firmare la dichiarazione -->
            <v-btn
              color="primary"
              class="mt-3 ml-3"
              @click="firmaDichiarazione"
              v-if="verifiableCredential"
            >
              Firma la Dichiarazione
            </v-btn>

            <!-- JSON stampato -->
            <v-card class="mt-3" v-if="verifiableCredential">
              <v-card-title>Credenziale Generata</v-card-title>
              <v-card-text>
                <pre>{{ verifiableCredential }}</pre>
              </v-card-text>
            </v-card>

            <!-- Stampa dell'output della chiamata API -->
            <v-card class="mt-3" v-if="apiResponse">
              <v-card-title>Risultato della Firma</v-card-title>
              <v-card-text>
                <pre>{{ apiResponse }}</pre>
              </v-card-text>
            </v-card>
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

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

export default defineComponent({
  data() {
    return {
      tshirtProduction: 0, // Quantità di magliette prodotte inserita dall'utente
      verifiableCredential: '' as string, // JSON stampato
      apiResponse: '' as string, // Risultato della chiamata API
      credentialId: '', // ID della credenziale
      issuanceTimestamp: Math.floor(Date.now() / 1000), // Timestamp attuale
      isCredentialGenerated: false, // Variabile per tracciare se la credenziale è stata generata
    }
  },
  methods: {
    // Funzione per generare la credenziale
    generaCredenziale() {
      const currentTimestamp = this.issuanceTimestamp // UNIX timestamp

      // Recupera l'ID dell'utente dal localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
      const issuerId = storedUser.id || 'did:supplychain:default' // Fallback se non è trovato

      // Genera un ID univoco per la credenziale
      this.credentialId = `http://example.supplychain/credentials/${Math.floor(Math.random() * 1000)}`

      const credenziale = {
        'my-vc': {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://www.w3.org/2018/credentials/examples/v1',
          ],
          id: this.credentialId, // Usa l'ID univoco
          type: ['VerifiableCredential', 'TshirtProductionCredential'], // Cambiato per riflettere il tipo 'TshirtProductionCredential'
          issuer: issuerId, // Usa l'ID dell'utente dinamicamente
          issuanceDate: currentTimestamp,
          credentialSubject: {
            id: issuerId, // Uguale all'issuer
            tshirtProduction: this.tshirtProduction, // Cambio nome campo per riflettere la produzione di magliette
          },
        },
      }

      this.verifiableCredential = JSON.stringify(credenziale, null, 2) // Stampa il JSON in modo leggibile

      // Modifica lo stato per nascondere il pulsante di generazione e mostrare quello di firma
      this.isCredentialGenerated = true
    },

    // Funzione per firmare la dichiarazione
    async firmaDichiarazione() {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')

      if (storedUser && storedUser.publicKey && storedUser.privateKey) {
        const credential = {
          'my-vc': {
            '@context': [
              'https://www.w3.org/2018/credentials/v1',
              'https://www.w3.org/2018/credentials/examples/v1',
            ],
            id: this.credentialId, // Usa lo stesso ID della credenziale generata
            type: ['VerifiableCredential', 'TshirtProductionCredential'], // Cambiato per riflettere il tipo 'TshirtProductionCredential'
            issuer: `did:supplychain:${storedUser.id}`, // ID dinamico dell'issuer
            issuanceDate: this.issuanceTimestamp, // Usa il timestamp
            credentialSubject: {
              id: `did:supplychain:${storedUser.id}`, // ID dinamico dell'issuer
              tshirtProduction: this.tshirtProduction, // Cambiato per riflettere la produzione di magliette
            },
          },
          Issuer: {
            keyring: {
              ecdh: storedUser.privateKey,
            },
            PublicKeyUrl: storedUser.publicKey,
          },
        }

        try {
          // Chiamata API per firmare la dichiarazione
          const response = await axios.post(
            'https://apiroom.net/api/bogx2/firma-nokeys',
            {
              data: credential,
              keys: {},
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            },
          )

          // Memorizza il risultato della chiamata API
          this.apiResponse = JSON.stringify(response.data, null, 2)

          console.log('Credenziale firmata:', response.data)
          alert('Dichiarazione firmata con successo!')

          // Recupera le credenziali esistenti dal localStorage o inizializza un array vuoto
          let userCredentials = JSON.parse(localStorage.getItem('userCredentials') || '[]')

          // Aggiungi la nuova credenziale all'array
          userCredentials.push(response.data)

          // Salva l'array aggiornato nel localStorage
          localStorage.setItem('userCredentials', JSON.stringify(userCredentials))
        } catch (error) {
          console.error('Errore durante la firma:', error)
          alert('Errore durante la firma della dichiarazione.')
        }
      } else {
        alert('Chiavi non trovate nel localStorage!')
      }
    },
  },
})
</script>

<style scoped>
/* Styling semplice */
.v-card {
  border-radius: 8px;
}

pre {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  font-size: 14px;
  overflow-x: auto;
}
.v-footer {
  text-align: center;
  background-color: #4caf50;
  color: white;
}
</style>
