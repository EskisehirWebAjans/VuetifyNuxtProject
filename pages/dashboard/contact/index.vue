<template>
  <v-card
    :loading="loading"
    class="mx-auto my-12"
    width="100%"
    elevation="1"
    outlined
    tile>
    <v-card-title>
      İletişim Bilgileri
    </v-card-title>
    <v-divider class="mx-4"></v-divider>
    <v-card-text>
      <v-col>
        <v-text-field
          hide-details
          outlined
          label="Facebook"
          v-model="facebook"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          hide-details
          outlined
          label="Twitter"
          v-model="twitter"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          hide-details
          outlined
          label="Instagram"
          v-model="instagram"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          hide-details
          outlined
          label="YouTube"
          v-model="youtube"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          hide-details
          outlined
          label="E-Posta"
          v-model="email"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          hide-details
          outlined
          label="Adres"
          v-model="address"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          hide-details
          outlined
          label="Telefon"
          v-model="phone"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          hide-details
          outlined
          label="Whatsapp"
          v-model="whatsapp"></v-text-field>
      </v-col>
      <v-col>
        <v-textarea
          hide-details
          counter
          outlined
          label="Hakkımızda"
          v-model="about">
        </v-textarea>
      </v-col>
      <v-col>
        <v-btn
          color="warning"
          @click="updateInfo">
          Güncelle
        </v-btn>
      </v-col>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  layout: 'backend',
  data() {
    return {
      contactItem: {
        facebook: null,
        twitter: null,
        instagram: null,
        youtube: null,
        whatsapp: null,
        phone: null,
        address: null,
        about: null
      }
    }
  },
  computed: {
    ...mapGetters('contact', {
      contact: 'contact',
      loading: 'loading'
    }),
    facebook: {
      set(facebook) {
        this.contact.facebook = facebook
      },
      get() {
        return this.contact.facebook
      }
    },
    twitter: {
      set(twitter) {
        this.contact.twitter = twitter
      },
      get() {
        return this.contact.twitter
      }
    },
    instagram: {
      set(instagram) {
        this.contact.instagram = instagram
      },
      get() {
        return this.contact.instagram
      }
    },
    youtube: {
      set(youtube) {
        this.contact.youtube = youtube
      },
      get() {
        return this.contact.youtube
      }
    },
    address: {
      set(address) {
        this.contact.address = address
      },
      get() {
        return this.contact.address
      }
    },
    email: {
      set(email) {
        this.contact.email = email
      },
      get() {
        return this.contact.email
      }
    },
    phone: {
      set(phone) {
        this.contact.phone = phone
      },
      get() {
        return this.contact.phone
      }
    },
    whatsapp: {
      set(whatsapp) {
        this.contact.whatsapp = whatsapp
      },
      get() {
        return this.contact.whatsapp
      }
    },
    about: {
      set(about) {
        this.contact.about = about
      },
      get() {
        return this.contact.about
      }
    }
  },
  async fetch({ store }) {
    await store.dispatch('contact/onLoadContact')
  },
  methods: {
    ...mapActions('contact', {
      onUpdateInfo: 'onUpdateInfo',
      onLoadContact: 'onLoadContact'
    }),
    updateInfo() {
      console.log(this.contact)
      this.onUpdateInfo(this.contact)
    }
  }
}
</script>

<style scoped>

</style>
