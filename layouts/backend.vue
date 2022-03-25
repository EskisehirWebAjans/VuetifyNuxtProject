<template>
  <v-app id="inspire">
    <Drawer/>
    <AppBar/>
    <v-main>
      <v-container fluid>
        <nuxt/>
        <SnackBar/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import AppBar from '~/components/shared/AppBar'
import Drawer from '~/components/shared/Drawer'
import SnackBar from '~/components/shared/SnackBar'

export default {
  components: {
    AppBar,
    Drawer,
    SnackBar
  },
  computed: {
    ...mapGetters('auth', {
      isAuthenticated: 'isAuthenticated'
    })
  },
}
</script>

<style scoped>

</style>
