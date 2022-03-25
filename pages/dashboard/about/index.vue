<template>
  <v-card
    :loading="loading"
    class="mx-auto my-12"
    width="100%"
    elevation="1"
    outlined
    tile>
    <v-card-title>
      Kurumsal
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
        max-width="800px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            class="mb-2"
            v-bind="attrs"
            v-on="on">
            Yeni İçerik
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
                    label="Başlık"
                    v-model="editedItem.title"
                    clearable
                    outlined
                    :error-messages="labelErrors"
                    @input="$v.editedItem.title.$touch()"
                    @blur="$v.editedItem.title.$touch()">
                  </v-text-field>
                </v-col>
                <v-col
                  cols="12">
                  <vue-editor
                    placeholder="İçerik"
                    v-model="editedItem.content"
                    @input="$v.editedItem.content.$touch()"
                    @blur="$v.editedItem.content.$touch()">
                  </vue-editor>
                </v-col>
                <v-col
                  cols="12">
                  <v-file-input
                    v-model="file"
                    accept="image/*"
                    outlined
                    clearable
                    :rules="fileRules"
                    prepend-icon="mdi-camera"
                    placeholder="Görsel Seç"
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
                  <v-row
                    class="text-center">
                    <v-btn
                      class="mx-2"
                      fab
                      x-small
                      color="pink"
                      @click="onDeletePhoto()">
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </v-row>
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
      <v-data-table
        no-data-text="Kayıt Yok!"
        :headers="headers"
        :items="about"
        :items-per-page="10"
        class="elevation-1"
        :search="search">
        <template v-slot:item.image="{ item }">
          <v-img
            width="100px"
            height="100px"
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
            class="mr-2"
            @click="onEditItem(item)">
            mdi-pencil
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
  name: 'about',
  layout: 'backend',
  data() {
    return {
      search: null,
      dialog: false,
      dialogDelete: false,
      file: null,
      photoPreview: null,
      uploading: false,
      headers: [
        {
          text: 'Başlık',
          align: 'start',
          value: 'title'
        },
        {
          text: 'Görsel',
          value: 'image'
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
        title: null,
        content: null,
        inserted: null,
      },
      defaultItem: {
        id: null,
        image: null,
        title: null,
        content: null,
        inserted: null,
      },
      fileRules: [
        v => !!v || 'Slider görseli gerekli!',
      ]
    }
  },
  async fetch({ store }) {
    await store.dispatch('about/onLoadAbout')
  },
  validations: {
    editedItem: {
      title: {
        required,
      },
      content: {
        required
      }
    }
  },
  computed: {
    ...mapGetters('about', {
      about : 'about',
      loading: 'loading'
    }),
    formTitle() {
      return this.editedIndex === -1 ? 'Yeni İçerik' : 'İçerik Düzenle'
    },
    labelErrors() {
      const errors = []
      if (!this.$v.editedItem.title.$dirty) return errors
      !this.$v.editedItem.title.required && errors.push('Başlık gerekli!')
      return errors
    },
    contentErrors() {
      const errors = []
      if (!this.$v.editedItem.content.$dirty) return errors
      !this.$v.editedItem.content.required && errors.push('İçerik gerekli!')
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
    ...mapActions('about', {
      onSaveAbout: 'onSaveAbout',
      onUpdateAbout: 'onUpdateAbout'
    }),
    ...mapActions('misc', {
      showMessage: 'showMessage',
      onPhotoRemove: 'onPhotoRemove'
    }),
    onCloseDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    onClose() {
      this.$v.$reset()
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.file = null
        this.photoPreview = null
      })
    },
    onEditItem(item) {
      this.editedIndex = this.about.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.srcToFile(this.editedItem.image, this.editedItem.image, 'image/*')
        .then((file) => {
          this.file = file
          console.log(file)
          this.photoPreview = this.editedItem.image
          this.dialog = true
        })
    },
    async srcToFile(src, fileName, mimeType) {
      return fetch(src)
        .then((res) => {
          return res.arrayBuffer()
        })
        .then((buf) => {
          return new File(  [buf], fileName, { type: mimeType })
        })
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
    async onSave() {
      this.$v.$touch()
      if(!this.$v.$invalid) {
        if(this.editedIndex > -1) {
          const data = JSON.stringify({ ...this.editedItem,  action: 'update' })
          const formData = new FormData()
          formData.append('file', this.file, this.file.name)
          formData.append('data', data)
          await this.onUpdateAbout(formData)
          this.onClose()
        } else {
          const data = JSON.stringify({ ...this.editedItem,  action: 'insert' })
          const formData = new FormData()
          formData.append('file', this.file, this.file.name)
          formData.append('data', data)
          await this.onSaveAbout(formData)
          this.onClose()
        }
      }
    }
  },

}
</script>

<style scoped>

</style>
