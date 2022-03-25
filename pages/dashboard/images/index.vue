<template>
  <v-card
    :loading="loading"
    class="mx-auto my-12"
    width="100%"
    elevation="1"
    outlined
    tile>
    <v-card-title>
      Bizden Kareler
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
            Yeni Fotoğraf
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
            <v-toolbar-title>Yeni Fotoğraf</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12">
                  <v-form
                    width="100%"
                    ref="form"
                    v-model="valid"
                    lazy-validation>
                    <v-col
                      cols="12">
                      <v-file-input
                        v-model="file"
                        accept="image/*"
                        outlined
                        clearable
                        :rules="fileRules"
                        prepend-icon="mdi-camera"
                        placeholder="Fotoğraf Seç"
                        @change="onPhotoSelect">
                        <template v-slot:selection="{ text }">
                          <v-chip
                            small
                            label
                            color="primary">
                            {{ text }}
                          </v-chip>
                        </template>
                      </v-file-input>
                    </v-col>
                    <v-col
                      cols="12"
                      v-if="photoPreview"
                      class="d-flex flex-column">
                      <v-row>
                        <v-img
                          :src="photoPreview"
                          class="grey lighten-2">
                          <template v-slot:placeholder>
                            <v-row
                              class="fill-height ma-0"
                              align="center"
                              justify="center">
                              <v-progress-circular
                                indeterminate
                                color="grey lighten-5">
                              </v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </v-row>
                      <v-spacer></v-spacer>
                      <v-row>
                        <v-btn
                          class="mx-2"
                          fab
                          x-small
                          color="pink"
                          @click="onDeletePhoto()">
                          <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-form>
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
            <v-toolbar-title>Fotoğraf Sil</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <h5 class="headline ma-8">Fotoğraf silinecek. Emin misiniz?</h5>
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
        :items="images"
        :items-per-page="10"
        class="elevation-1">
        <template v-slot:item.image="{ item }">
          <v-img
            width="150px"
            height="150px"
            :src="item.image"
            class="grey lighten-2">
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5">
                </v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </template>
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
import { required, requiredIf} from 'vuelidate/lib/validators'
import {storage} from "~/plugins/firebase";

export default {
  layout: 'backend',
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      file: null,
      photoPreview: null,
      valid: true,
      headers: [
        {
          text: 'Görsel',
          align: 'start',
          value: 'image',
          sortable: false
        },
        {
          text: 'Tarih',
          value: 'inserted'
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
        image: null,
        inserted: null,
      },
      defaultItem: {
        id: null,
        image: null,
        inserted: null,
      },
      fileRules: [
        v => !!v || 'Fotoğraf gerekli!',
      ]
    }
  },
  computed: {
    ...mapGetters('image', [
      'images',
      'loading'
    ]),
  },
  async fetch({ store }) {
    await store.dispatch('image/onLoadImages')
  },
  methods: {
    ...mapActions('image', {
      onSaveImage: 'onSaveImage',
      onDeleteImage: 'onDeleteImage'
    }),
    ...mapActions('misc', {
      showMessage: 'showMessage',
      onPhotoRemove: 'onPhotoRemove'
    }),
    onClose() {
      this.$refs.form.resetValidation()
      // this.$refs.form.reset()
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.file = null
        this.photoPreview = null
      })
    },
    onCloseDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.file = null
      })
    },
    onDeleteItem(item) {
      this.editedIndex = this.images.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    async onDeleteItemConfirm() {
      let image = {
        id: this.editedItem.id,
        action: 'delete'
      }
      image = JSON.stringify(image)
      const formData = new FormData()
      formData.append('data', image)
      await this.onDeleteImage({ image: formData, index: this.editedIndex })
      this.onCloseDelete()
    },
    onPhotoSelect(photo) {
      if(photo) {
        let reader = new FileReader()
        reader.readAsDataURL(photo)
        reader.onload = e => {
          this.photoPreview = e.target.result
          this.file = photo
        }
      }
    },
    onDeletePhoto() {
      this.photoPreview = null
      this.editedItem.image = null
      this.file = null
    },
    onSave() {
      this.valid = this.$refs.form.validate()
      if(this.valid) {
        let data = {
          action: 'insert'
        }
        data = JSON.stringify(data)
        const formData = new FormData()
        formData.append('file', this.file, this.file.name)
        formData.append('data', data)
        this.onSaveImage(formData)
        this.onClose()
      } else {
        this.showMessage('Formda hata var!')
      }
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
}
</script>

<style>

</style>
