<template>
  <v-layout
    align-center
    justify-center>
    <v-flex xs12 sm8 md4 lg4>
      <v-card class="elevation-1 pa-3">
        <v-card-text>
          <div class="layout column align-center">
            <img src="logo.png" alt="Haller Sürücü Kursu Yönetim Paneli" width="180" height="180">
            <h1 class="flex my-4 primary--text">Haller Sürücü Kursu Yönetim Paneli</h1>
          </div>
        </v-card-text>
        <v-form @submit.prevent="onLogin">
          <v-card-text>
            <v-text-field
              name="username"
              label="Kullanıcı Adı"
              v-model="username"
              type="email"
              :error-messages="usernameErrors"
              append-icon="mdi-account"
              @input="$v.username.$touch()"
              @blur="$v.username.$touch()"
              required>
            </v-text-field>
            <v-text-field
              name="password"
              label="Şifre"
              id="password"
              counter="8"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :error-messages="passwordErrors"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
              required>
            </v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              block
              color="primary"
              elevation="2"
              :loading="loading"
              type="submit">
              Giriş
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, minLength, email } from 'vuelidate/lib/validators'
export default {
  data() {
    return {
      username: null,
      password: null,
      showPassword: false
    }
  },
  layout: 'auth',
  validations: {
    username: {
      required,
      minLength: minLength(5)
    },
    password: {
      required,
      minLength: minLength(8)
    }
  },
  computed: {
    usernameErrors () {
      const errors = []
      if (!this.$v.username.$dirty) return errors
      !this.$v.username.minLength && errors.push('Kullanıcı adı çok kısa!')
      !this.$v.username.required && errors.push('Kullanıcı adı gerekli!')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Şifre gerekli!')
      !this.$v.password.minLength && errors.push('Şifre en az 8 karakter olmalı!')
      return errors
    },
    ...mapGetters('auth', {
        loading : 'loading',
        isAuthenticated: 'isAuthenticated'
    })
  },
  watch: {
    isAuthenticated(value) {
      if(value) {
        setTimeout(() => {
          this.setLoading(false)
          this.$router.push("/dashboard")
        }, 2000)
      }
    }
  },
  async fetch({ store, redirect }) {
    await store.dispatch('auth/setLoading', true)
    if(store.getters['auth/isAuthenticated']) {
      setTimeout(() => {
        store.dispatch('auth/setLoading', false)
        redirect('/dashboard')
      }, 2000)
    }
    await store.dispatch('auth/setLoading', false)
  },
  methods: {
    ...mapActions('auth', {
      onSignIn: 'onSignIn',
      setLoading: 'setLoading'
    }),
    ...mapActions('misc', {
      showMessage: 'showMessage'
    }),
    onLogin() {
      this.$v.$touch()
      if(!this.$v.$invalid) {
        let user = {
          username: this.username,
          password: this.password
        }
        this.onSignIn(user)
      }
    }
  }
}
</script>

<style scoped>
.login-form {
  max-width: 500px;
}
</style>
