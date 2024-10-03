const routesCONST = {
  home: {
    path: "/homePage",
    name: "HomePage"
  },
  board: {
    path: "/board",
    name: "Board"
  },
  users: {
    path: "/users",
    name: "Users"
  },
  settings: {
    path: "/settings",
    name: "Settings"
  },
  about: {
    path: "/about",
    name: "About"
  },
  login: {
    path: "/login",
    name: "Login"
  },
  affair: {
    path: "/affair",
    name: "Affair"
  },
  pv: {
    path: "/pv",
    name: "Pv"
  },
  addAffair: {
    path: "/addAffair",
    name: "AddAffair"
  },
  addPv: {
    path: "/addPv",
    name: "AddPv"
  },
  addUser: {
    path: "/addUser",
    name: "AddUser"
  },
  addLot: {
    path: "/addLot",
    name: "AddLot"
  },
  finishedPv: {
    path: "/finishedPv",
    name: "FinishedPv"
  },
  test: {
    path: "/test",
    name: "Test"
  }
};

export const FormAddressRules = [(v) => !!v || 'Requis', (v) => (v && v.length >= 10) || 'Doit être supérieur à 10 caractères']
export const FormNameRules = [
  (v) => !!v || 'Requis',
  (v) => v.length >= 3 || 'Doit être supérieur à 3 caractères',
  (v) => v.length <= 35 || 'Doit être inferieur à 35 caractères'
]
export const FormDescriptionRules = [(v) => v?.length <= 100 || 'Doit être inferieur à 100 caractères']
export const FormMeetingRules = [(v) => !!v || 'Requis', (v) => v == 'Chantier' || v == 'Etude' || 'Choisir dans la liste']
export const FormStandardRules = [
  (v) => !!v || 'Requis',
  (v) => (v && v.length >= 3) || 'Doit être au moins de 3 caractères',
  (v) => (v && v.length <= 45) || 'Doit être au max 45 caractères'
]
export const FormAffairRules = [(v) => !!v || 'Requis']
export const FormEmailRules = [
  (v) => !!v || 'Requis',
  (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Le mail doit être valide'
]
export const FormPhoneRules = [
  (v) => !!v || 'Requis',
  (v) => /\d{10}/.test(v) || 'Doit être un numéro de téléphone valide'
]
export const FormRequiredRules = [(v) => !!v || 'Requis']
export const FormPasswordRules = [
  (v) => !!v || 'Requis',
  (v) => v?.length >= 10 || 'Il doit y avoir plus de 10 caracères',
  (v) => /(?=.*[A-Z])/.test(v) || 'Il faut une majuscule',
  (v) => /(?=.*\d)/.test(v) || 'Il faut un nombre',
  (v) => /([!@#$%])/.test(v) || 'Il faut un charactère spécial [!@#$%]'
]
export const getRouteName = name => {
  return routesCONST[name].name;
};

export const getRoutePath = path => {
  return routesCONST[path].path;
};

export default routesCONST;
