<template>
  <v-app>
    <!-- Header con Navbar -->
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

    <!-- Main content area -->
    <v-main>
      <v-container>
        <!-- Selezione credenziale -->
        <v-card outlined class="mb-4">
          <v-card-title class="text-h6">Seleziona Credenziale</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedCredentialIndex"
              :items="credentialOptions"
              label="Scegli una credenziale"
            ></v-select>
          </v-card-text>
        </v-card>

        <!-- Card per credenziali -->
        <v-row>
          <!-- Prima card -->
          <v-col cols="12" md="6">
            <v-card outlined>
              <v-card-title v-if="selectedCredential" class="text-h6"
                >Prima Credenziale</v-card-title
              >
              <v-card-text v-if="selectedCredential">
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

                <v-btn @click="verifyFirstCredential" color="primary" class="mt-3">
                  Verifica Prima Credenziale
                </v-btn>
              </v-card-text>
              <v-card-text v-if="firstVerificationResult">
                <p><strong>Risultato Prima Verifica:</strong> {{ firstVerificationResult }}</p>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Seconda card -->
          <v-col
            cols="12"
            md="6"
            v-if="firstVerificationResult === 'Verifica riuscita' && secondCredential"
          >
            <v-card outlined>
              <v-card-title class="text-h6">Seconda Credenziale</v-card-title>
              <v-card-text>
                <p><strong>ID:</strong> {{ secondCredential.id }}</p>
                <p><strong>Nome:</strong> {{ secondCredential.credentialSubject.id }}</p>
                <p v-if="secondCredential.credentialSubject.cottonProductionKg">
                  <strong>Produzione di Cotone (Kg):</strong>
                  {{ secondCredential.credentialSubject.cottonProductionKg }}
                </p>
                <p v-if="secondCredential.credentialSubject.tshirtProduction">
                  <strong>Produzione di Magliette:</strong>
                  {{ secondCredential.credentialSubject.tshirtProduction }}
                </p>
                <p>
                  <strong>Data di Emissione:</strong>
                  {{ new Date(secondCredential.issuanceDate * 1000).toLocaleString() }}
                </p>
                <p><strong>Emittente:</strong> {{ secondCredential.issuer }}</p>

                <v-btn @click="verifySecondCredential" color="secondary" class="mt-3">
                  Verifica Seconda Credenziale
                </v-btn>
              </v-card-text>
              <v-card-text v-if="secondVerificationResult">
                <p><strong>Risultato Seconda Verifica:</strong> {{ secondVerificationResult }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Controllo logica di business -->
        <v-row
          v-if="
            firstVerificationResult === 'Verifica riuscita' &&
            secondVerificationResult === 'Verifica riuscita'
          "
        >
          <v-col cols="12">
            <v-card outlined>
              <v-card-title class="text-h6">Controllo Logica di Business</v-card-title>
              <v-card-text>
                <v-text-field
                  label="Minimo Kg di Cotone"
                  v-model.number="minCottonKg"
                  type="number"
                  required
                ></v-text-field>
                <v-text-field
                  label="Massimo Kg di Cotone"
                  v-model.number="maxCottonKg"
                  type="number"
                  required
                ></v-text-field>
                <v-text-field
                  label="Tasso di Conversione (Kg Cotone a Magliette)"
                  v-model.number="conversionRate"
                  type="number"
                  required
                ></v-text-field>

                <v-btn @click="verifyBusinessLogic" color="success" class="mt-3">
                  Verifica Logica di Business
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Risultato Verifica Logica di Business -->
        <v-row v-if="businessLogicResult">
          <v-col cols="12">
            <v-card class="mt-3 pa-4">
              <v-card-title class="text-h6">Risultato Verifica Logica di Business</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="4">
                    <strong>Produzione di Cotone:</strong> {{ businessLogicResult.cottonCheck }}
                  </v-col>
                  <v-col cols="12" sm="4">
                    <strong>Produzione di Magliette:</strong> {{ businessLogicResult.tshirtCheck }}
                  </v-col>
                  <v-col cols="12" sm="4">
                    <strong>Ordine Temporale:</strong> {{ businessLogicResult.timestampCheck }}
                  </v-col>
                </v-row>
              </v-card-text>

              <!-- Pulsante per emettere certificazione -->
              <v-btn
                v-if="
                  businessLogicResult &&
                  businessLogicResult.cottonCheck === 'Valido' &&
                  businessLogicResult.tshirtCheck === 'Valido' &&
                  businessLogicResult.timestampCheck === 'Valido'
                "
                color="success"
                class="mt-4"
                block
              >
                <RouterLink to="/certificazione" class="text-white"
                  >Emetti Certificazione</RouterLink
                >
              </v-btn>
            </v-card>
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
      credentialOptions: [],
      selectedCredentialIndex: null,
      firstVerificationResult: null, // Risultato della prima verifica
      secondVerificationResult: null, // Risultato della seconda verifica
      minCottonKg: 0,
      maxCottonKg: 0,
      conversionRate: 0,
      businessLogicResult: null,
    }
  },
  computed: {
    selectedCredential() {
      return this.credentialOptions[this.selectedCredentialIndex]?.fullCredential || null
    },
    secondCredential() {
      return this.credentialOptions.find(
        (_, index) =>
          index !== this.selectedCredentialIndex && this.selectedCredentialIndex !== null,
      )?.fullCredential
    },
  },
  created() {
    this.loadCredentials()
  },
  methods: {
    loadCredentials() {
      const rawCredentials = localStorage.getItem('userCredentials') || '[]'
      let parsedCredentials

      try {
        parsedCredentials = JSON.parse(rawCredentials)
      } catch (error) {
        console.error('Errore nel parsing delle credenziali:', error)
        parsedCredentials = []
      }

      this.credentialOptions = parsedCredentials
        .map((credential, index) => {
          const vc = credential['my-vc']
          return vc && vc.proof
            ? {
                label: `ID: ${vc.id} - Cotton: ${vc.credentialSubject.cottonProductionKg} Kg`,
                value: index,
                fullCredential: vc,
              }
            : null
        })
        .filter((option) => option !== null)
    },
    getIndex(selectedCredential) {
      return (
        this.credentialOptions.findIndex((option) => option.fullCredential === selectedCredential) +
        1
      )
    },

    async verifyFirstCredential() {
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
        this.firstVerificationResult = response.data.output[0]
          ? 'Verifica riuscita'
          : 'Verifica fallita'
      } catch (error) {
        console.error('Errore durante la verifica:', error)
        this.firstVerificationResult = 'Errore durante la verifica'
      }
    },

    async verifySecondCredential() {
      if (this.firstVerificationResult !== 'Verifica riuscita') {
        this.secondVerificationResult =
          'Non puoi verificare la seconda credenziale senza verificare la prima'
        return
      }

      const payload = {
        data: {
          'my-vc': this.secondCredential,
          Issuer: {
            'ecdh public key': this.secondCredential.proof.verificationMethod,
          },
        },
        keys: {},
      }

      try {
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
        this.secondVerificationResult = response.data.output[0]
          ? 'Verifica riuscita'
          : 'Verifica fallita'
      } catch (error) {
        console.error('Errore durante la verifica:', error)
        this.secondVerificationResult = 'Errore durante la verifica'
      }
    },

    verifyBusinessLogic() {
      const cottonKg = this.selectedCredential.credentialSubject.cottonProductionKg
      const tshirtProduction = this.secondCredential.credentialSubject.tshirtProduction
      const secondTimestamp = this.secondCredential.issuanceDate

      // Controllo se la produzione di cotone è nel range
      const cottonCheck =
        cottonKg >= this.minCottonKg && cottonKg <= this.maxCottonKg ? 'Valido' : 'Non Valido'

      // Calcolo del range per le magliette
      const minTshirts = Math.floor(this.minCottonKg * this.conversionRate)
      const maxTshirts = Math.ceil(this.maxCottonKg * this.conversionRate)

      // Controllo se la produzione di magliette è nel range
      const tshirtCheck =
        tshirtProduction >= minTshirts && tshirtProduction <= maxTshirts ? 'Valido' : 'Non Valido'

      // Controllo dell'ordine temporale
      const timestampCheck =
        this.selectedCredential.issuanceDate < secondTimestamp ? 'Valido' : 'Non Valido'

      // Salvataggio dei risultati
      this.businessLogicResult = {
        cottonCheck,
        tshirtCheck,
        timestampCheck,
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
