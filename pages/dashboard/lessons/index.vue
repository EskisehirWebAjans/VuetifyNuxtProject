<template>
  <v-card
    :loading="loading"
    class="mx-auto my-12"
    width="100%"
    elevation="1"
    outlined
    tile>
    <v-card-title>
      Dersler
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
            Yeni Ders
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
                    placeholder="Açıklama"
                    v-model="editedItem.description"
                    @input="$v.editedItem.description.$touch()"
                    @blur="$v.editedItem.description.$touch()">
                  </vue-editor>
                </v-col>
                <v-col
                  cols="12">
                  <v-text-field
                    v-model="url"
                    label="Ders Videoları"
                    clearable
                    outlined
                    @click:append-outer="onAddLink"
                    append-outer-icon="mdi-link-variant-plus">
                  </v-text-field>
                </v-col>
                <v-col
                  v-for="(video, i) in editedItem.videos"
                  :key="i"
                  cols="4"
                  class="d-flex flex-column">
                  <v-row>
                    <v-img
                      :src="video.thumb"
                      :lazy-src="video.thumb"
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
                      @click="onDeleteVideo(video.thumb, i)">
                      <v-icon>mdi-trash-can</v-icon>
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
            <v-toolbar-title>Ders Sil</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <h5 class="headline ma-8">Ders silinecek. Emin misiniz?</h5>
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
        :items="lessons"
        :items-per-page="5"
        class="elevation-1"
        :search="search">
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
import slugify from 'slugify'

export default {
  layout: 'backend',
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      search: '',
      url: null,
      headers: [
        {
          text: 'Ders Başlığı',
          align: 'start',
          value: 'title',
        },
        {
          text: 'Açıklama',
          value: 'description',
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
        title: null,
        slug: null,
        description: null,
        videos: []
      },
      defaultItem: {
        id: null,
        title: null,
        slug: null,
        description: null,
        videos: []
      },
    }
  },
  validations: {
    editedItem: {
      title: {
        required
      },
      description: {
        required
      },
      videos: {
        required
      }
    }
  },
  async fetch({ store, route }) {
    await store.dispatch('lesson/onLoadLessons')
  },
  computed: {
    ...mapGetters({
      lessons: 'lesson/lessons',
      loading: 'lesson/loading'
    }),
    labelErrors() {
      const errors = []
      if (!this.$v.editedItem.title.$dirty) return errors
      !this.$v.editedItem.title.required && errors.push('Ders başlığı gerekli!')
      return errors
    },
    descErrors() {
      const errors = []
      if (!this.$v.editedItem.description.$dirty) return errors
      !this.$v.editedItem.description.required && errors.push('Ders açıklaması gerekli!')
      return errors
    },
    videoErrors() {
      const errors = []
      if (!this.$v.editedItem.videos.$dirty) return errors
      !this.$v.editedItem.videos.required && errors.push('Ders videosu gerekli!')
      return errors
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Yeni Ders' : 'Ders Düzenle'
    },
  },
  watch: {
    dialog(val) {
      val || this.onClose()
    },
    dialogDelete(val) {
      val || this.onCloseDelete()
    },
  },
  methods: {
    ...mapActions({
      onSaveLesson: 'lesson/onSaveLesson',
      onUpdateLesson: 'lesson/onUpdateLesson',
      onDeleteLesson: 'lesson/onDeleteLesson',
      showMessage: 'misc/showMessage',
    }),
    onClose() {
      this.$v.$reset()
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedItem.videos = []
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
      this.editedIndex = this.lessons.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    async onDeleteItemConfirm() {
      await this.onDeleteLesson({ lesson: this.editedItem, index: this.editedIndex })
      this.onCloseDelete()
    },
    onEditItem(item) {
      this.editedIndex = this.lessons.indexOf(item)
      this.editedItem = Object.assign({}, this.lessons[this.editedIndex])
      this.dialog = true
    },
    async onSave() {
      this.$v.$touch()
      if(!this.$v.$invalid) {
        this.editedItem.slug = slugify(this.editedItem.title, {
          replacement: '-',
          remove: /[$*_+~.()'"!?\-:@]/g,
          lower: true
        })
        if(this.editedIndex > -1) {
          await this.onUpdateLesson({ lesson: this.editedItem, index: this.editedIndex })
          this.onClose()
        } else {
          let lesson = {
            title: this.editedItem.title,
            description: this.editedItem.description,
            inserted: Date.now(),
            videos: this.editedItem.videos,
            slug: this.editedItem.slug
          }
          await this.onSaveLesson(lesson)
          this.onClose()
        }
      } else {
        this.showMessage('Error in form!')
      }
    },
    onAddLink() {
      if(this.url) {
        this.editedItem.videos.push({
          url: this.url,
          thumb: this.getThumb(this.url, 'small')
        })
        console.log(this.editedItem.videos)
        this.url = null
      }
     },
    onDeleteVideo(thumb, i) {
      this.editedItem.videos.splice(i, 1)
      console.log(this.editedItem.videos)
    },
    getThumb(url, size) {
      if (url === null) {
        return
      }
      size = (size === null) ? 'big' : size
      const results = url.match('[\\?&]v=([^&#]*)')
      const video = (results === null) ? url : results[1]

      if (size === 'small') {
        return 'http://img.youtube.com/vi/' + video + '/mqdefault.jpg'
      }
      return 'http://img.youtube.com/vi/' + video + '/0.jpg'
    }
  }
}
</script>

<style scoped>

</style>
