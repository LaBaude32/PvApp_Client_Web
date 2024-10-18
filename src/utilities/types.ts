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
  name: string
  progress: number
  alreadyDone?: string
  affairId?: number
}

export interface Affair {
  affairId: number
  name: string
  meetingType: 'Chantier' | 'Etude'
  adresse: string
  progress: number
  lots?: Lot[]
}
