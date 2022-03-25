<template>
  <v-app id="login" class="secondary">
    <v-main>
      <v-container fluid fill-height>
        <nuxt/>
        <SnackBar/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SnackBar from "~/components/shared/SnackBar"
export default {
  components: {
    SnackBar
  }
}
</script>

<style scoped>
  #login {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
  .secondary {
    background-color: #424242 !important;
    border-color: #424242 !important;
  }
</style>
