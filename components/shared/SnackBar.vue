<template>
  <v-snackbar
    bottom
    color="deep-purple accent-4"
    elevation="24"
    v-model="snackbar.show"
    :timeout="snackbar.timeout">
    {{ snackbar.text }}
    <template v-slot:action="{ attrs }">
      <v-btn
        @click="hideMessage"
        color="blue"
        text
        v-bind="attrs">
        Kapat
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Snackbar',
  data() {
    return {
      isShown: false,
    }
  },
  computed: {
    ...mapState('misc', {
      snackbar: state => state.snackbar
    })
  },
  methods: {
    ...mapActions('misc', {
      hideMessage: 'hideMessage'
    })
  },
  watch: {
    'snackbar.show': {
      handler(value) {
        console.log(value)
        this.isShown = value
      }
    }
  }
}
</script>

<style scoped>

</style>
