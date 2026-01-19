<template>
  <v-data-table :headers="headers" :items="desserts" v-sortable-data-table>
    <template v-slot:item.ordering>
      <v-icon class="handle">mdi-sort</v-icon>
    </template>
    <template v-slot:item.name="{ item }">
      <div>{{ item.name }} lulu</div>
    </template></v-data-table
  >
</template>

<script setup lang="ts">
import Sortable from 'sortablejs'
import { ref } from 'vue'

interface Item {
  id: number
  name: string
  calories: number
}

const headers = ref([
  { title: 'Réorgansier', value: 'ordering' },
  { title: 'Nom', value: 'name' },
  { title: 'Calories', value: 'calories' }
  // Ajoutez d'autres en-têtes selon vos besoins
])

const desserts = ref<Item[]>([
  { id: 1, name: 'Frozen Yogurt', calories: 159 },
  { id: 2, name: 'Ice cream sandwich', calories: 237 },
  { id: 3, name: 'Eclair', calories: 262 }
  // Ajoutez d'autres items selon vos besoins
])

function saveOrder(event) {
  console.log(event)
}

const vSortableDataTable = {
  mounted(el: HTMLElement, binding, vnode) {
    const options = {
      animation: 150,
      handle: '.handle',
      onUpdate: function (event: any) {
        const item = desserts.value[event.oldIndex]
        desserts.value.splice(event.oldIndex, 1)
        desserts.value.splice(event.newIndex, 0, item)
      },
      onEnd: function (event: any) {
        const item = desserts.value[event.newIndex]
        console.log(event.newIndex) // la nouvelle position
        saveOrder(item)
      }
    }
    const tbody = el.getElementsByTagName('tbody')[0]
    Sortable.create(tbody, options)
  }
}
</script>
