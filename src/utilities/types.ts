export interface userDataForLogin {
  email: string
  password: string
}

export interface User {
  userId?: Number
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  userGroup?: string
  userFunction?: string
  organism?: string
}
