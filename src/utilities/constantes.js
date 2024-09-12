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
  (v) => (v && v.length <= 50) || 'Doit être inferieur à 50 caractères',
  (v) => (v && v.length >= 3) || 'Doit être supérieur à 3 caractères'
]
export const FormDescriptionRules = [(v) => v?.length <= 100 || 'Doit être inferieur à 100 caractères']
export const FormMeetingRules = [(v) => !!v || 'Requis', (v) => v == 'Chantier' || v == 'Etude' || 'Choisir dans la liste']
export const FormStandardRules = [
  (v) => !!v || 'Requis',
  (v) => (v && v.length >= 3) || 'Doit être au moins de 3 caractères',
  (v) => (v && v.length <= 45) || 'Doit être au max 45 caractères'
]
export const FormAffairRules = [(v) => !!v || 'Requis']
export const FormEmailRules = [(v) => !!v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Le mail doit être valide']
export const FormPhoneRules = [(v) => !!v || /\d{10}/.test(v) || 'Doit être un numéro de téléphone valide']
export const FormRequiredRules = [(v) => !!v || 'Requis']

export const getRouteName = name => {
  return routesCONST[name].name;
};

export const getRoutePath = path => {
  return routesCONST[path].path;
};

export default routesCONST;
