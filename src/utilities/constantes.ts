const routesCONST = {
  home: {
    path: '/homePage',
    name: 'HomePage'
  },
  board: {
    path: '/board',
    name: 'Board'
  },
  users: {
    path: '/users',
    name: 'Users'
  },
  settings: {
    path: '/settings',
    name: 'Settings'
  },
  about: {
    path: '/about',
    name: 'About'
  },
  login: {
    path: '/login',
    name: 'Login'
  },
  affair: {
    path: '/affair',
    name: 'Affair'
  },
  pv: {
    path: '/pv',
    name: 'Pv'
  },
  addAffair: {
    path: '/addAffair',
    name: 'AddAffair'
  },
  addPv: {
    path: '/addPv',
    name: 'AddPv'
  },
  addUser: {
    path: '/addUser',
    name: 'AddUser'
  },
  addLot: {
    path: '/addLot',
    name: 'AddLot'
  },
  finishedPv: {
    path: '/finishedPv',
    name: 'FinishedPv'
  },
  addHimSelfParticipant: {
    path: '/addHimSelfParticipant/pvId',
    name: 'AddHimSelfParticipant'
  },
  test: {
    path: '/test',
    name: 'Test'
  },
  myAccount: {
    path: '/myAccount',
    name: 'MyAccount'
  }
}

export const FormRequiredRulesMin3 = [
  (v: string) => !!v || 'Requis',
  (v: string) => (v && v.length >= 3) || 'Doit être supérieur à 3 caractères'
]
export const FormNameRules = [
  (v: string) => !!v || 'Requis',
  (v: string) => v.length >= 3 || 'Doit être supérieur à 3 caractères',
  (v: string) => v.length <= 35 || 'Doit être inferieur à 35 caractères'
]
export const FormDescriptionRules = [
  (v: string) => v?.length <= 100 || 'Doit être inferieur à 100 caractères'
]
export const FormMeetingRules = [
  (v: string) => !!v || 'Requis',
  (v: string) => v == 'Chantier' || v == 'Etude' || 'Choisir dans la liste'
]
export const FormStandardRules = [
  (v: string) => !!v || 'Requis',
  (v: string) => (v && v.length >= 3) || 'Doit être au moins de 3 caractères',
  (v: string) => (v && v.length <= 45) || 'Doit être au max 45 caractères'
]
export const FormAffairRules = [(v: string) => !!v || 'Requis']
export const FormEmailRules = [
  (v: string) => !!v || 'Requis',
  (v: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Le mail doit être valide'
]
export const FormPhoneRules = [
  (v: string) => !!v || 'Requis',
  (v: string) => /\d{10}/.test(v) || 'Doit être un numéro de téléphone valide'
]
export const FormRequiredRules = [(v: string) => !!v || 'Requis']
export const FormPasswordRules = [
  (v: string) => !!v || 'Requis',
  (v: string) => v?.length >= 10 || 'Il doit y avoir plus de 10 caracères',
  (v: string) => /(?=.*[A-Z])/.test(v) || 'Il faut une majuscule',
  (v: string) => /(?=.*\d)/.test(v) || 'Il faut un nombre',
  (v: string) => /([!@#$%])/.test(v) || 'Il faut un charactère spécial [!@#$%]'
]
export const FormOTPRules = [
  (v: string) => !!v || 'Requis',
  (v: string) => /\d/.test(v) || 'Doit être un code valide'
]
export const getRouteName = (name: string) => {
  return routesCONST[name].name
}

export const getRoutePath = (path: string) => {
  return routesCONST[path].path
}

export default routesCONST
