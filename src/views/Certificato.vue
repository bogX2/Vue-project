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
          <v-card-title class="text-h6">Creazione Certificazione</v-card-title>

          <v-card-text>
            <!-- Pulsante per generare la certificazione -->
            <v-btn
              color="primary"
              class="mt-3"
              @click="generaCertificazione"
              v-if="!isCertificationGenerated"
            >
              Genera Certificazione
            </v-btn>

            <!-- Pulsante per firmare la certificazione -->
            <v-btn
              color="primary"
              class="mt-3 ml-3"
              @click="firmaCertificazione"
              v-if="certificazione && !isCertificationSigned"
            >
              Firma Certificazione
            </v-btn>

            <!-- JSON stampato -->
            <v-card class="mt-3" v-if="certificazione">
              <v-card-title>Certificazione Generata</v-card-title>
              <v-card-text>
                <pre>{{ certificazione }}</pre>
              </v-card-text>
            </v-card>

            <!-- Stampa dell'output della chiamata API -->
            <v-card class="mt-3" v-if="certificationResponse">
              <v-card-title>Risultato della Firma</v-card-title>
              <v-card-text>
                <pre>{{ certificationResponse }}</pre>
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
      certificazione: '' as string,
      certificationResponse: '' as string,
      isCertificationGenerated: false,
      isCertificationSigned: false,
      issuanceTimestamp: Math.floor(Date.now() / 1000), // Timestamp attuale
      credentialId: '', // ID della credenziale
    }
  },
  methods: {
    // Funzione per generare la certificazione
    generaCertificazione() {
      const currentTimestamp = Math.floor(Date.now() / 1000) // UNIX timestamp

      // Recupera l'ID dell'utente dal localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
      const verifierId = storedUser.id || 'did:supplychain:verificatore001' // Fallback se non è trovato
      // Genera un ID univoco per la credenziale
      this.credentialId = `http://example.supplychain/credentials/${Math.floor(Math.random() * 1000)}`

      const certificazione = {
        'my-vc': {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://www.w3.org/2018/credentials/examples/v1',
          ],
          id: this.credentialId,
          type: ['VerifiableCredential', 'AuditCredential'],
          issuer: verifierId, // Usa l'ID del verificatore
          issuanceDate: currentTimestamp,
          credentialSubject: {
            id: ['did:supplychain:coltivatore1', 'did:supplychain:produttore1'],
            sustainabilityClaim: {
              status: 'Certified',
              details:
                'La produzione di cotone è stata verificata come sostenibile secondo gli standard della filiera',
              verificationDate: currentTimestamp,
            },
          },
        },
      }

      this.certificazione = JSON.stringify(certificazione, null, 2) // Stampa il JSON in modo leggibile

      // Modifica lo stato per nascondere il pulsante di generazione e mostrare quello di firma
      this.isCertificationGenerated = true
    },

    // Funzione per firmare la dichiarazione certificazione di sostenibilita
    async firmaCertificazione() {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
      const verifierId = storedUser.id || 'did:supplychain:verificatore001' // Fallback se non è trovato

      if (storedUser && storedUser.publicKey && storedUser.privateKey) {
        const credential = {
          'my-vc': {
            '@context': [
              'https://www.w3.org/2018/credentials/v1',
              'https://www.w3.org/2018/credentials/examples/v1',
            ],
            id: this.credentialId,
            type: ['VerifiableCredential', 'AuditCredential'],
            issuer: verifierId, // Usa l'ID del verificatore
            issuanceDate: this.issuanceTimestamp,
            credentialSubject: {
              id: ['did:supplychain:coltivatore1', 'did:supplychain:produttore1'],
              verifiedCredential: 'http://example.supplychain/credentials/001', // Puoi modificarlo per fare riferimento alla credenziale verificata
              sustainabilityClaim: {
                status: 'Certified',
                details:
                  'La produzione di cotone è stata verificata come sostenibile secondo gli standard della filiera',
                verificationDate: this.issuanceTimestamp,
              },
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
          // Chiamata API per firmare la certificazione
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
          this.certificationResponse = JSON.stringify(response.data, null, 2)

          console.log('Certificazione firmata:', response.data)
          alert('Certificazione firmata con successo!')

          // Nasconde il pulsante di firma
          this.isCertificationSigned = true

          // Recupera le credenziali esistenti dal localStorage o inizializza un array vuoto
          let userCredentials = JSON.parse(localStorage.getItem('userCredentials') || '[]')

          // Aggiungi la nuova credenziale all'array
          userCredentials.push(response.data)

          // Salva l'array aggiornato nel localStorage
          localStorage.setItem('userCredentials', JSON.stringify(userCredentials))
        } catch (error) {
          console.error('Errore durante la firma:', error)
          alert('Errore durante la firma della certificazione.')
        }
      } else {
        alert('Chiavi non trovate nel localStorage!')
      }
    },
  },
})
</script>

<style scoped>
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
