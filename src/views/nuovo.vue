<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <!-- Titolo della pagina -->
        <v-card class="pa-4" outlined>
          <v-card-title class="headline"
            >Firma della dichiarazione di produzione cotone</v-card-title
          >

          <!-- Modulo per inserire la dichiarazione -->
          <v-form @submit.prevent="inviaDichiarazione">
            <v-text-field
              v-model="cottonProductionKg"
              label="Quantità di cotone prodotta (Kg)"
              type="number"
              required
            />

            <v-btn type="submit" color="primary" block> Firma la dichiarazione </v-btn>
          </v-form>
        </v-card>

        <!-- Mostra la VC firmata -->
        <v-card v-if="signedVC" class="mt-4" outlined>
          <v-card-title class="headline">Credenziale Verificabile Firmata</v-card-title>
          <v-card-text>
            <pre>{{ signedVC }}</pre>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      cottonProductionKg: '', // Quantità di cotone prodotta
      signedVC: null, // VC firmata
      publicKey: '', // Chiave pubblica per la verifica
      privateKey: '', // Chiave privata per la firma
    }
  },
  methods: {
    // Funzione per inviare la dichiarazione alla API per la firma
    async inviaDichiarazione() {
      // Creazione della VC senza firma
      const myVC = {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://www.w3.org/2018/credentials/examples/v1',
        ],
        id: 'http://example.supplychain/credentials/001',
        type: ['VerifiableCredential', 'CottonProductionCredential'],
        issuer: 'did:supplychain:coltivatore123',
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          id: 'did:supplychain:coltivatore123',
          cottonProductionKg: this.cottonProductionKg,
        },
      }

      // Ottenere chiavi (chiave pubblica e privata) dal sistema di onboarding
      const keys = await this.getKeyPair()

      // Chiamata API per firmare la VC
      try {
        const response = await axios.get(
          'https://apiroom.net/api/bogx2/Alice-(contadino)-firma-la-sua-dichiarazione',
          {
            params: {
              data: JSON.stringify({ 'my-vc': myVC }), // VC non firmata
              keys: JSON.stringify({ ecdh: keys.privateKey, w3c: this.publicKey }), // Chiavi private e pubbliche
            },
          },
        )

        // Ricevere la VC firmata dalla risposta
        this.signedVC = response.data['my-vc']
      } catch (error) {
        console.error('Errore durante la firma della dichiarazione:', error)
      }
    },

    // Funzione per ottenere la coppia di chiavi (simulata)
    async getKeyPair() {
      return {
        privateKey: 'LA_TUA_CHIAVE_PRIVATA', // Sostituisci con la tua chiave privata
        publicKey: 'LA_TUA_CHIAVE_PUBBLICA', // Sostituisci con la tua chiave pubblica
      }
    },
  },
}
</script>

<style scoped>
/* Personalizza il tema e l'aspetto */
.v-btn {
  margin-top: 20px;
}
</style>
