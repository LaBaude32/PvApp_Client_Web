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
  progress: number
  alreadyDone?: string
  affairId?: number
}

export interface Affair {
  affairId: number
  name: string
  meetingType: 'Chantier' | 'Etude'
  address: string
  progress: number
  description: string
  lots?: Lot[]
}

export interface Agenda {
  agendaId: number
  position: number
  title: string
  pvId: number
}
