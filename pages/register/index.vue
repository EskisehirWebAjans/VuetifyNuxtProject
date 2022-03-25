<template>
  <v-layout
    align-center
    justify-center>
    <v-flex class="login-form text-center">
      <v-card light>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title class="headline">
              <v-icon
                large>
                mdi-account-plus
              </v-icon>
              Kaydol
            </v-list-item-title>
            <v-list-item-subtitle>
              Yönetim Paneline Erişebilmek İçin Kaydolun!
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-form @submit.prevent="signUp">
          <v-card-text>
            <v-text-field
              name="email"
              label="E-Posta"
              id="email"
              v-model="email"
              type="email"
              :error-messages="emailErrors"
              light
              prepend-icon="mdi-email"
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
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
              light
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
              required>
            </v-text-field>
            <v-text-field
              name="confirm"
              label="Şifre Tekrarla"
              id="confirm"
              counter="8"
              v-model="confirm"
              :type="showPassword ? 'text' : 'password'"
              :error-messages="confirmErrors"
              light
              prepend-icon="mdi-lock-reset"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              @input="$v.confirm.$touch()"
              @blur="$v.confirm.$touch()"
              required>
            </v-text-field>
            <v-text-field
              name="name"
              label="Ad"
              id="name"
              v-model="name"
              type="text"
              :error-messages="nameErrors"
              light
              prepend-icon="mdi-form-textbox"
              @input="$v.name.$touch()"
              @blur="$v.name.$touch()"
              required>
            </v-text-field>
            <v-text-field
              name="surname"
              label="Soyad"
              id="surname"
              v-model="surname"
              type="text"
              :error-messages="surnameErrors"
              light
              prepend-icon="mdi-form-textbox"
              @input="$v.surname.$touch()"
              @blur="$v.surname.$touch()"
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
              Kaydol
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
export default {
  name: 'Register',
  layout: 'auth',
  data() {
    return {
      email: null,
      password: null,
      confirm: null,
      name: null,
      surname: null,
      showPassword: false
    }
  },
  validations: {
    email: {
      required,
      email: email
    },
    password: {
      required,
      minLength: minLength(8)
    },
    confirm: {
      sameAsPassword: sameAs('password')
    },
    name: {
      required,
      minLength: minLength(2)
    },
    surname: {
      required,
      minLength: minLength(2)
    }
  },
  computed: {
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Geçerli bir e-mail adresi olmalı!')
      !this.$v.email.required && errors.push('E-mail gereklidir!')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Şifre gereklidir!')
      !this.$v.password.minLength && errors.push('Şifre en az 8 karakter uzunluğunda olmalı!')
      return errors
    },
    confirmErrors () {
      const errors = []
      if (!this.$v.confirm.$dirty) return errors
      !this.$v.confirm.sameAsPassword && errors.push('Şifreler uyuşmuyor!')
      return errors
    },
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('İsim zorunlu!')
      !this.$v.name.minLength && errors.push('İsim çok kısa!')
      return errors
    },
    surnameErrors () {
      const errors = []
      if (!this.$v.surname.$dirty) return errors
      !this.$v.surname.required && errors.push('Soyisim zorunlu!')
      !this.$v.surname.minLength && errors.push('Soyisim çok kısa!')
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
        setTimeout(() => this.$router.push("/dashboard"), 2000)
      }
    }
  },
  methods: {
    ...mapActions('auth', {
      onSignUp: 'onSignUp'
    }),
    signUp() {
      this.$v.$touch()
      if(!this.$v.$invalid) {
        let user = {
          email: this.email,
          password: this.password,
          name: this.name,
          surname: this.surname,
          admin: true,
          insertedAt: Date.now(),
          lastAccess: null,
          lastIp: null
        }
        this.onSignUp(user)
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
