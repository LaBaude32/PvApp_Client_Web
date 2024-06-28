<template>
  <TestComponent v-model:meetingDateDate="meetingDateDate" v-model:meetingDateTime="meetingDateTime" :validateForm="validate2" v-model:isFormValid="valid"/>
</template>

<script setup>
import { useDate } from 'vuetify'
import { ref, onMounted, computed } from 'vue'
import TestComponent from '../components/TestComponent.vue'

const valid = ref(false)
const date = useDate()
const meetingDateDate = ref()
const meetingDateTime = ref()

function validate2() {
  console.log(date.toISO(meetingDateDate.value))
  console.log(meetingDateTime.value)
}

// const userId = computed(() => store.state.userId)

const displayMeetingDate = computed(() => {
  return meeting_date_date.value ? date.format(meeting_date_date.value, 'fullDate') : null
})
</script>
