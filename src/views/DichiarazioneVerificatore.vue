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
    </v-app-bar>

    <!-- Main content area (scrollable) -->
    <v-main>
      <v-container>
        <v-card>
          <v-card-title class="text-h6">Seleziona Credenziale</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedCredentialIndex"
              :items="credentialOptions"
              label="Scegli una credenziale"
            ></v-select>

            <div v-if="selectedCredential">
              <v-card-title>Credenziale #{{ getIndex(selectedCredential) }}</v-card-title>
              <p><strong>ID:</strong> {{ selectedCredential.id }}</p>
              <p><strong>Nome:</strong> {{ selectedCredential.credentialSubject.id }}</p>
              <p v-if="selectedCredential.credentialSubject.cottonProductionKg">
                <strong>Produzione di Cotone (Kg):</strong>
                {{ selectedCredential.credentialSubject.cottonProductionKg }}
              </p>
              <p v-if="selectedCredential.credentialSubject.tshirtProduction">
                <strong>Produzione di Magliette:</strong>
                {{ selectedCredential.credentialSubject.tshirtProduction }}
              </p>
              <p>
                <strong>Data di Emissione:</strong>
                {{ new Date(selectedCredential.issuanceDate * 1000).toLocaleString() }}
              </p>
              <p><strong>Emittente:</strong> {{ selectedCredential.issuer }}</p>

              <v-btn @click="verifyCredential" color="primary" class="mt-3">
                Verifica Credenziale
              </v-btn>
            </div>
          </v-card-text>

          <v-card-text v-if="verificationResult">
            <p><strong>Risultato Verifica:</strong> {{ verificationResult }}</p>
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

<script>
import axios from 'axios'

export default {
  data() {
    return {
      credentialOptions: [],
      selectedCredentialIndex: null,
      verificationResult: null,
    }
  },
  computed: {
    selectedCredential() {
      return this.credentialOptions[this.selectedCredentialIndex]?.fullCredential || null
    },
  },
  created() {
    this.loadCredentials()
  },
  methods: {
    loadCredentials() {
      const credentials = JSON.parse(localStorage.getItem('userCredentials') || '[]')

      this.credentialOptions = credentials.map((credential, index) => {
        const vc = credential['my-vc']
        return {
          label: `ID: ${vc.id} - Cotton: ${vc.credentialSubject.cottonProductionKg} Kg`, // Stringa semplice
          value: index,
          fullCredential: vc,
        }
      })
    },
    getIndex(selectedCredential) {
      return (
        this.credentialOptions.findIndex((option) => option.fullCredential === selectedCredential) +
        1
      )
    },

    // Verifica firma credenziale
    async verifyCredential() {
      const payload = {
        data: {
          'my-vc': this.selectedCredential,
          Issuer: {
            'ecdh public key': this.selectedCredential.proof.verificationMethod,
          },
        },
        keys: {},
      }

      try {
        // Chiamata API per la verifica della credenziale con axios
        const response = await axios.post(
          'https://apiroom.net/api/bogx2/verifica-firma-nokeys',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        )
        //salva il risulato dal array di output
        this.verificationResult = response.data.output[0]
      } catch (error) {
        console.error('Errore durante la verifica:', error)
        this.verificationResult = 'Errore durante la verifica'
      }
    },
  },
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
  height: calc(100vh - 64px);
}

.v-card-title {
  font-weight: bold;
}

.v-btn {
  min-width: 0;
  padding: 6px 10px;
}

.logo {
  margin-right: 10px;
}

.v-app-bar {
  box-shadow: none;
}
</style>
