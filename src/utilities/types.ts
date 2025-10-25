import type { DateInstance } from 'vuetify/dist/vuetify.js'

export interface userDataForLogin {
  email: string
  password: string
}

export interface User {
  userId?: number
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  userGroup?: string
  userFunction?: string
  organism?: string
}

export interface Lot {
  lotId?: number
  pvId?: number
  name: string
  affairId?: number
  color?: string
}

export interface Affair {
  affairId: number
  name: string
  meetingType: 'Chantier' | 'Etude'
  address: string
  description: string
  lots?: Lot[]
}

export interface Agenda {
  agendaId: number
  position: number
  title: string
  pvId: number
}

export interface Pv {
  meetingDateDate: DateInstance
  meetingDateTime: string
  meetingNextDateDate: DateInstance | string
  meetingNextDateTime?: string
  meetingPlace: string
  meetingNextPlace?: string
  affairId: number
  state: string
}

export interface Schedule {
  scheduleId: number
  position: number
  description: string
  deadline: string
  pvId: number
  lotId: number
}

export interface Progress {
  progressId: number
  position: number
  description: string
  progress: string
  pvId: number
  lotId: number
}
