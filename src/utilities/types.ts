export interface userDataForLogin {
  email: string
  password: string
}

export interface User {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  userGroup?: string
  userFunction?: string
  organism?: string
  userId: Number
}
