<template>
  <v-card
    :loading="loading"
    class="mx-auto my-12"
    width="100%"
    elevation="1"
    outlined
    tile>
    <v-card-title>
      S.S.S.
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Ara..."
        single-line
        hide-details>
      </v-text-field>
    </v-card-title>
    <v-card-text>
      <v-dialog
        persistent
        v-model="dialog"
        width="800px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            class="mb-2"
            v-bind="attrs"
            v-on="on">
            Yeni Soru
          </v-btn>
        </template>
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
                    label="Soru"
                    v-model="editedItem.question"
                    clearable
                    outlined
                    :error-messages="labelErrors"
                    @input="$v.editedItem.question.$touch()"
                    @blur="$v.editedItem.question.$touch()">
                  </v-text-field>
                </v-col>
                <v-col
                  cols="12">
                  <vue-editor
                    placeholder="Cevap"
                    v-model="editedItem.answer"
                    @input="$v.editedItem.answer.$touch()"
                    @blur="$v.editedItem.answer.$touch()">
                  </vue-editor>
                </v-col>
                <v-col
                  cols="12">
                  <v-checkbox
                    v-model="editedItem.shown"
                    label="Göster/Gizle">
                  </v-checkbox>
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
            <v-btn
              color="primary"
              @click="onSave">
              Kaydet
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        persistent
        v-model="dialogDelete"
        max-width="500px">
        <v-card>
          <v-toolbar
            dark
            dense
            color="error">
            <v-btn
              icon
              dark
              @click="onCloseDelete">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Soru Sil</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <h5 class="headline ma-8">Soru silinecek. Emin misiniz?</h5>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="white--text"
              color="green"
              @click="onCloseDelete">
              İptal
            </v-btn>
            <v-btn
              class="white--text"
              color="error"
              @click="onDeleteItemConfirm">
              Tamam
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-data-table
        no-data-text="Kayıt Yok!"
        :headers="headers"
        :items="faqs"
        :items-per-page="10"
        class="elevation-1"
        :search="search">
        <template v-slot:item.answer="{ item }">
          {{ item.answer | striphtml }}
        </template>
        <template v-slot:item.shown="{ item }">
          <v-icon
            color="red"
            v-if="!item.shown">
            mdi-close-circle
          </v-icon>
          <v-icon
            color="green"
            v-else>
            mdi-checkbox-marked-circle
          </v-icon>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            class="mr-2"
            @click="onEditItem(item)">
            mdi-pencil
          </v-icon>
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
      dialogDelete: false,
      search: null,
      headers: [
        {
          text: 'Soru',
          align: 'start',
          value: 'question'
        },
        {
          text: 'Cevap',
          value: 'answer'
        },
        {
          text: 'Göster/Gizle',
          value: 'shown'
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
        question: null,
        answer: null,
        inserted: null,
        shown: null,
      },
      defaultItem: {
        id: null,
        question: null,
        answer: null,
        inserted: null,
        shown: null,
      }
    }
  },
  validations: {
    editedItem: {
      question: {
        required,
      },
      answer: {
        required
      }
    }
  },
  async fetch({ store }) {
    await store.dispatch('faq/onLoadFaqs')
  },
  computed: {
    ...mapGetters('faq', [
      'faqs',
      'loading'
    ]),
    formTitle() {
      return this.editedIndex === -1 ? 'Yeni Soru' : 'Soru Düzenle'
    },
    labelErrors() {
      const errors = []
      if (!this.$v.editedItem.question.$dirty) return errors
      !this.$v.editedItem.question.required && errors.push('Soru gerekli!')
      return errors
    },
    contentErrors() {
      const errors = []
      if (!this.$v.editedItem.answer.$dirty) return errors
      !this.$v.editedItem.answer.required && errors.push('Cevap gerekli!')
      return errors
    },
  },
  watch: {
    dialog(val) {
      if(val && this.editedIndex > -1) {

      }
      val || this.onClose()
    },
    dialogDelete(val) {
      val || this.onCloseDelete()
    },
  },
  methods: {
    ...mapActions('faq', {
      onSaveFaq: 'onSaveFaq',
      onUpdateFaq: 'onUpdateFaq',
      onDeleteFaq: 'onDeleteFaq',
    }),
    ...mapActions('misc', {
      showMessage: 'showMessage',
    }),
    onClose() {
      this.$v.$reset()
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    onCloseDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    onDeleteItem(item) {
      this.editedIndex = this.faqs.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    async onDeleteItemConfirm() {
      await this.onDeleteFaq({faq: this.editedItem, index: this.editedIndex })
      this.onCloseDelete()
    },
    onEditItem(item) {
      this.editedIndex = this.faqs.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    async onSave() {
      this.$v.$touch()
      if(!this.$v.$invalid) {
        if(this.editedIndex > -1) {
          await this.onUpdateFaq({faq: this.editedItem, index: this.editedIndex })
          this.onClose()
        } else {
          let faq = {
            question: this.editedItem.question,
            answer: this.editedItem.answer,
            shown: this.editedItem.shown
          }
          await this.onSaveFaq(faq)
          this.onClose()
        }
      } else {
        this.showMessage('Formda hata var!')
      }
    },
  }
}
</script>

<style>

</style>
