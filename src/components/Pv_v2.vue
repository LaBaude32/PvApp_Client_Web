<template>
  <div>
    <v-card max-width="95%" class="mx-auto">
      <v-data-table :headers="MyHeaders" :items="MyItems" sort-by="position" sort-desc="true" :search="search">
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title v-if="pvDetails">Pv du {{ pvDetails.meetingDate | formatDate }} </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Chercher" single-line hide-details></v-text-field>
            <v-spacer></v-spacer>
            <v-dialog v-model="MyDialog" max-width="800px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Nouvel item</v-btn>
              </template>
              <v-card>
                <v-form v-model="MyValid">
                  <v-card-title>
                    <span class="text-h5">{{ MyFormTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="4" md="4">
                          <v-text-field
                            v-model="MyEditedItem.position"
                            label="Position"
                            min="1"
                            type="number"
                            :rules="standardRequirement"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="4" v-if="MyMeetingType == 'Chantier'">
                          <v-select
                            v-model="MyEditedItem.lotsToReturn"
                            :items="MyEditedItem.lots"
                            item-text="name"
                            return-object
                            label="Lot"
                            chips
                            multiple
                            deletable-chips
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-switch v-model="MyEditedItem.visible" label="Visible"></v-switch>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-textarea v-model="MyEditedItem.note" label="Note" counter auto-grow filled></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-textarea v-model="MyEditedItem.followUp" label="Suite à donner" counter auto-grow filled></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="MyEditedItem.resources" label="Ressources"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-select clearable v-model="MyEditedItem.completionToReturn" :items="MyEditedItem.completion" label="Echéance"></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-menu v-model="ItemModelDatePicker" :close-on-content-click="false" max-width="290">
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                :value="computedDateFormattedCompletion"
                                label="Date de l'echéance"
                                readonly
                                v-on="on"
                                clearable
                                @click:clear="MyCompletionDate = null"
                                prepend-icon="mdi-calendar"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="MyCompletionDate"
                              @change="ItemModelDatePicker = false"
                              locale="fr-fr"
                              show-current
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <!-- <div v-if="MyEditedItem.image && MyEditedIndex > 0"> -->
                          <!-- <div v-if="MyEditedItem.image != null"> -->
                          <div v-if="MyEditedItem.image == null || MyEditedItem.isImageChange">
                            <v-file-input label="Photo" accept="image/*" prepend-icon="mdi-camera" @change="onObjectSelected"></v-file-input>
                          </div>
                          <div v-else>
                            <p>
                              Photo :
                              <v-btn icon @click="removeImage(MyEditedItem)">
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </p>
                            <v-img max-height="300" max-width="700" :src="MyThumbnail(MyEditedItem.image)"></v-img>
                          </div>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Annuler</v-btn>
                    <v-btn :disabled="!MyValid" color="blue darken-1" text @click="save">Enregister</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.lots="{ item }">
          <v-chip v-for="lot in item.lots" :key="lot.id" class="ma-1" color="orange" dark>
            {{ lot.name }}
          </v-chip>
        </template>
        <template v-slot:item.visible="{ item }">
          <v-switch v-model="item.visible" role="switch" @change="changeVisible(item)"></v-switch>
        </template>
        <template v-slot:item.completionDate="{ item }">
          {{ item.completionDate | formatDateShortDayOnly }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:item.image="{ item }">
          <v-img v-if="item.image" max-width="150" :src="MyThumbnail(item.image)" @click="OpenImage(item.image)"></v-img>
        </template>
        <template v-slot:no-data>
          <p class="text-h5 font-weight-medium mt-3">Il n'y a pas encore d'item pour ce PV</p>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="MyImageDialog" max-width="800px">
      <v-card>
        <v-img contain max-height="750" :src="MyImageSrc"></v-img>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="MyImageDialog = false"> Fermer </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const imgURL = import.meta.env.VITE_BACKEND_IMAGE_URL;
export default {
  name: "Pv-V2",
  props: {
    dialog: Boolean,
    valid: Boolean,
    standardRequirement: Array,
    pvUsers: Array,
    items: Array,
    pvDetails: Object,
    meetingType: String,
    headers: Array,
    editedIndex: Number,
    editedItem: Object,
    defaultItem: Object,
    formTitle: String,
    formatedCompletionDate: String,
    computedDateFormattedCompletion: String,
    editItem: Function,
    deleteItem: Function,
    close: Function,
    save: Function,
    maxPosition: Function,
    changeVisible: Function
  },
  data() {
    return {
      ItemModelDatePicker: false,
      search: "",
      MyPvUsers: this.pvUsers,
      MyHeaders: this.headers,
      MyMeetingType: this.meetingType,
      MyDefaultItem: this.defaultItem,
      objectThumbnailFile: null,
      MyImageDialog: false,
      MyImageSrc: String
    };
  },
  watch: {
    MyDialog(val) {
      if (this.MyEditedIndex == -1) {
        if (this.maxPosition() > 0) {
          this.MyDefaultItem.position = this.maxPosition();
        } else {
          this.MyDefaultItem.position = 1;
        }
        this.MyEditedItem = Object.assign({}, this.MyDefaultItem);
      }
      val || this.close();
    }
  },

  computed: {
    MyCompletionDate: {
      get() {
        return this.formatedCompletionDate;
      },
      set(val) {
        this.$emit("update:formatedCompletionDate", val);
      }
    },
    MyFormTitle() {
      return this.formTitle;
    },
    MyDialog: {
      get() {
        return this.dialog;
      },
      set(val) {
        this.$emit("update:dialog", val);
      }
    },
    MyValid: {
      get() {
        return this.valid;
      },
      set(val) {
        this.$emit("update:valid", val);
      }
    },
    MyItems: {
      get() {
        return this.items;
      },
      set(val) {
        this.$emit("update:items", val);
      }
    },
    MyEditedItem: {
      get() {
        return this.editedItem;
      },
      set(val) {
        this.$emit("update:editedItem", val);
      }
    },
    MyEditedIndex: {
      get() {
        return this.editedIndex;
      },
      set(val) {
        this.$emit("update:editedIndex", val);
      }
    }
  },
  methods: {
    onObjectSelected(event) {
      this.objectThumbnailFile = event;
      this.MyEditedItem.image = this.objectThumbnailFile;
      this.MyEditedItem.isImageChange = true;
    },
    MyThumbnail(imageName) {
      return imgURL + imageName;
    },
    OpenImage(imageName) {
      this.MyImageSrc = imgURL + imageName;
      this.MyImageDialog = true;
    },
    removeImage(MyEditedItem) {
      MyEditedItem.image = null;
      MyEditedItem.isImageChange = true;
    }
  }
};
</script>
