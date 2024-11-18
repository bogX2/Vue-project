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
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="vcData"
              label="Verifiable Credential JSON"
              outlined
              rows="10"
            ></v-textarea>
          </v-col>
          <v-col cols="12">
            <v-btn @click="verifySignature" color="primary">Verifica Firma</v-btn>
          </v-col>
          <v-col cols="12" v-if="verificationResult !== null">
            <v-alert :type="verificationResult ? 'success' : 'error'" dismissible>
              {{
                verificationResult
                  ? 'Firma verificata con successo!'
                  : 'La verifica della firma è fallita.'
              }}
            </v-alert>
          </v-col>
        </v-row>
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

<script>
import axios from 'axios'

export default {
  data() {
    return {
      vcData: '', // Dati della VC da verificare
      verificationResult: null, // Risultato della verifica
    }
  },
  methods: {
    async verifySignature() {
      try {
        // Codifica i dati VC in una stringa JSON
        const data = encodeURIComponent(JSON.stringify({ 'my-vc': JSON.parse(this.vcData) }))

        // Esegui la chiamata GET all'API
        const response = await axios.get(
          `https://apiroom.net/api/bogx2/verifica-firma?data=${data}`,
        )

        // Verifica la risposta della API
        if (response.data === 'true') {
          this.verificationResult = true // Firma valida
        } else {
          this.verificationResult = false // Firma non valida
        }
      } catch (error) {
        console.error('Errore nella verifica della firma:', error)
        this.verificationResult = false // Errore nella verifica
      }
    },
  },
}
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
