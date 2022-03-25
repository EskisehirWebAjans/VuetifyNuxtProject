<template>
  <v-app-bar app dark>
    <v-app-bar-nav-icon
      @click="setDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title>{{ barTitle }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-bell</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-menu left bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          @click="() => {}">
          <v-list-item-title>Profil</v-list-item-title>
        </v-list-item>
        <v-list-item
          @click="() => {}">
          <v-list-item-title>Ayarlar</v-list-item-title>
        </v-list-item>
        <v-list-item
          @click="() => {}">
          <v-list-item-title>Çıkış</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: "AppBar",
  computed: {
    ...mapGetters('misc', {
      barTitle: 'barTitle'
    })
  },
  methods: {
    ...mapActions('misc', {
      setDrawer: 'setDrawer'
    })
  }
}
</script>

<style scoped>

</style>
