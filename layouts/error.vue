<template>
    <v-layout
      align-center
      justify-center>
      <v-flex xs12 sm8 md4 lg4>
        <v-card
          class="elevation-1 pa-10">
          <v-card-text>
            <div class="layout column align-center">
              <img src="logo.png" alt="Haller Sürücü Kursu Yönetim Paneli" width="180" height="180">
              <h1 v-if="error.statusCode === 404" class="flex my-4 red--text">
                {{ pageNotFound }}
              </h1>
              <h1 v-else class="flex my-4 red--text">
                {{ otherError }}
              </h1>
              <NuxtLink to="/">
                <h1>Anasayfaya Git</h1>
              </NuxtLink>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
</template>

<script>
export default {
  layout: 'auth',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: 'Sayfa Bulunamadı!',
      otherError: 'Bir Hata Oluştu!'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
