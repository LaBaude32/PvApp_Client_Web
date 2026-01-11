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

// Règles de validation pour CompanyInfoTab
export const FormCompanyNameRules = [
  (value: string) => !!value || "Le nom de l'entreprise est requis",
  (value: string) =>
    (value && value.length >= 2) || "Le nom de l'entreprise doit contenir au moins 2 caractères"
]

export const FormSiretRules = [
  (value: string) => !!value || 'Le numéro SIRET est requis',
  (value: string) => /^\d{14}$/.test(value) || 'Le numéro SIRET doit contenir 14 chiffres'
]

export const FormAddressRules = [
  (value: string) => !!value || "L'adresse est requise",
  (value: string) =>
    (value && value.length >= 10) || "L'adresse doit contenir au moins 10 caractères"
]

export const FormVatNumberRules = [
  (value: string) =>
    !value ||
    /^FR[0-9]{2}[0-9]{9}$/.test(value) ||
    "Le numéro de TVA n'est pas valide (format FRxxXXXXXXXX)"
]

export const FormContactFirstNameRules = [
  (value: string) => !!value || 'Le prénom du contact est requis',
  (value: string) => (value && value.length >= 2) || 'Le prénom doit contenir au moins 2 caractères'
]

export const FormContactLastNameRules = [
  (value: string) => !!value || 'Le nom du contact est requis',
  (value: string) => (value && value.length >= 2) || 'Le nom doit contenir au moins 2 caractères'
]

export const FormContactEmailRules = [
  (value: string) => !!value || "L'adresse email du contact est requise",
  (value: string) => /\S+@\S+\.\S+/.test(value) || "L'adresse email n'est pas valide"
]

export const FormContactPhoneRules = [
  (value: string) =>
    !!value ||
    /^[\+]?[0-9\s\-\(\)]{10,}$/.test(value) ||
    "Le numéro de téléphone du contact n'est pas valide"
]

// Règles de validation pour PersonalInfoTab
export const FormNameMin2Rules = [
  (value: string) => !!value || 'Le nom est requis',
  (value: string) => (value && value.length >= 2) || 'Le nom doit contenir au moins 2 caractères'
]

export const FormFirstNameRules = [
  (value: string) => !!value || 'Le prénom est requis',
  (value: string) => (value && value.length >= 2) || 'Le prénom doit contenir au moins 2 caractères'
]

export const FormLastNameRules = [
  (value: string) => !!value || 'Le nom de famille est requis',
  (value: string) =>
    (value && value.length >= 2) || 'Le nom de famille doit contenir au moins 2 caractères'
]

export const FormEmailSimpleRules = [
  (value: string) => !!value || "L'adresse email est requise",
  (value: string) => /\S+@\S+\.\S+/.test(value) || "L'adresse email n'est pas valide"
]

export const FormPhoneSimpleRules = [
  (value: string) =>
    !value || /^[\+]?[0-9\s\-\(\)]{10,}$/.test(value) || "Le numéro de téléphone n'est pas valide"
]

export const FormPasswordMin8Rules = [
  (value: string) =>
    !value || value.length >= 8 || 'Le mot de passe doit contenir au moins 8 caractères'
]

export const FormPasswordComplexRules = [
  (value: string) =>
    !value || value.length >= 8 || 'Le nouveau mot de passe doit contenir au moins 8 caractères',
  (value: string) =>
    !value ||
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value) ||
    'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
]


export const FormCountryRules = [
  (value: string) => !!value || 'Le pays est requis',
  (value: string) => value.length >= 2 || 'Le pays doit contenir au moins 2 caractères'
]

export const FormPostalCodeRules = [
  (v: string) => !!v || 'Le code postal est requis',
  (v: string) => /^\d{5}$/.test(v) || 'Le code postal doit contenir 5 chiffres'
]

export const FormCityRules = [
  (v: string) => !!v || 'La ville est requise',
  (v: string) => v.length >= 2 || 'La ville doit contenir au moins 2 caractères'
]

export const getRouteName = (name: string) => {
  return routesCONST[name].name
}

export const getRoutePath = (path: string) => {
  return routesCONST[path].path
}

export default routesCONST
