<template>
  <v-navigation-drawer
    v-model="drawer.show"
    app>
    <v-toolbar flat dark class="toolbar">
      <v-list-item
        v-if="user"
        three-line
        class="px-2">
        <v-list-item-avatar
          color="primary"
          size="56">
          <v-img :src="user.avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ user.name }} {{ user.surname }}
          </v-list-item-title>
          <v-list-item-subtitle
            class="d-flex flex-column">
            <span class="subtitle-2">
              {{ isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı' }}
            </span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-toolbar>
    <v-divider></v-divider>
    <v-list
      dense
      nav>
      <v-list-item
        v-for="(item, index) in menuItems"
        :key="index"
        nuxt
        exact
        :to="{ path: item.path }">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn block @click="logout">
          Çıkış
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters('misc', {
      drawer: 'drawer',
      menuItems: 'menuItems',
      timeConverted: 'timeConverted'
    }),
    ...mapGetters('auth', {
      user: 'user',
      isAdmin: 'isAdmin'
    })
  },
  methods: {
    ...mapActions('auth', {
      logout: 'onLogout'
    })
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
