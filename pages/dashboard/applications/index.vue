<template>
  <v-card
    :loading="loading"
    class="mx-auto my-12"
    width="100%"
    elevation="1"
    outlined
    tile>
    <v-card-title>
      Ön Kayıt Başvuruları
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        dark
        class="mb-2"
        @click="onUpdate">
        Güncelle
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-dialog
        persistent
        v-model="dialog"
        width="800px">
        <v-card>
          <v-toolbar
            dark
            color="primary">
            <v-btn
              icon
              dark
              @click="onClose">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12">
                  <v-text-field
                    label="Ad-Soyad"
                    v-model="editedItem.name"
                    outlined
                    disabled>
                  </v-text-field>
                </v-col>
                <v-col
                  cols="12">
                  <v-text-field
                    label="Telefon"
                    v-model="editedItem.phone"
                    outlined
                    disabled>
                  </v-text-field>
                </v-col>
                <v-col
                  cols="12">
                  <v-text-field
                    label="E-Posta"
                    v-model="editedItem.email"
                    outlined
                    disabled>
                  </v-text-field>
                </v-col>
                <v-col
                  cols="12">
                  <v-textarea
                    label="Açıklama"
                    v-model="editedItem.request"
                    outlined
                    disabled>
                  </v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              @click="onClose">
              Kapat
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-data-table
        no-data-text="Kayıt Yok!"
        :headers="headers"
        :items="applications"
        :items-per-page="10"
        class="elevation-1"
        :search="search">
        <template v-slot:item.actions="{ item }">
          <v-icon
            @click="onDeleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'

export default {
  layout: 'backend',
  data() {
    return {
      dialog: false,
      search: null,
      headers: [
        {
          text: 'Ad-Soyad',
          align: 'start',
          value: 'name'
        },
        {
          text: 'Telefon',
          value: 'phone'
        },
        {
          text: 'E-Posta',
          value: 'email'
        },
        {
          text: 'Tarih',
          value: 'inserted'
        },
        {
          text: 'Açıklama',
          value: 'request'
        },
        {
          text: 'İşlemler',
          value: 'actions',
          sortable: false
        }
      ],
      editedIndex: -1,
      editedItem: {
        id: null,
        name: null,
        phone: null,
        email: null,
        request: null,
        inserted: null,
      }
    }
  },
  async fetch({ store }) {
    await store.dispatch('application/onLoadApplications')
  },
  computed: {
    ...mapGetters('application', [
      'applications',
      'loading'
    ]),
    formTitle() {
      return 'Ön Kayıt Başvuru'
    },
  },
  methods: {
    ...mapActions('application', {
      onLoadApplications: 'onLoadApplications',
      onDeleteApplication: 'onDeleteApplication',
    }),
    onUpdate() {
      this.onLoadApplications()
    },
    onClose() {
      this.$v.$reset()
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    async onDeleteItem(item) {
      const index = this.applications.indexOf(item)
      await this.onDeleteApplication({register: item, index })
    },
  }
}
</script>

<style>

</style>
