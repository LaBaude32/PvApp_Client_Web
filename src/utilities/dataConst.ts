export const DEFAULT_ITEM = {
  position: null,
  lotsToReturn: [],
  lots: [],
  note: null,
  followUp: null,
  resources: null,
  completion: ['A faire', 'Urgent', 'Fait', 'En cours'], //TODO: A mettre en Enum dans la BDD ?
  completionDate: null,
  image: null,
  visible: true,
  isImageChange: false
}

export const USER_HEADERS = [
  {
    title: 'Prénom Nom',
    align: 'start',
    value: 'fullName'
  },
  {
    title: 'Groupe',
    value: 'userGroup'
  },
  { title: 'Fonction', value: 'function' },
  { title: 'Organisme', value: 'organism' },
  { title: 'Mail', value: 'email', sortable: false },
  { title: 'Téléphone', value: 'phone', sortable: false },
  { title: 'Statut', value: 'statusPAE' }
]

export const USER_GROUPE_ITEMS = [
  "Maîtrise d'ouvrage",
  "Assistance à la maîtrise d'ouvrage",
  "Maîtrise d'oeuvre",
  'Entreprise',
  'Concessionnaire',
  'Personne public associée',
  'COPIL',
  'COTEC',
  'Divers'
]

export const ITEM_HEADERS = [
  {
    title: 'Position',
    align: 'center',
    value: 'position'
  },
  { title: 'Note', value: 'note', sortable: false },
  { title: 'Suite à donner', value: 'followUp', sortable: false },
  { title: 'Ressource', value: 'resources', sortable: false },
  { title: 'Echeance', value: 'completion', sortable: false },
  { title: "Date d'echéance", value: 'completionDate' },
  { title: 'Photo', value: 'image' }
]

export const PV_DATA = {
  meetingDateDate: null,
  meetingDateTime: null,
  meetingNextDateDate: null,
  meetingNextDateTime: null,
  meetingPlace: null,
  meetingNextPlace: null,
  affairId: null,
  state: 'En cours'
}

export const EDITED_ITEM = {
  fullName: '',
  userGroupToReturn: '',
  userGroup: [],
  userFunction: '',
  organism: '',
  email: '',
  phone: '',
  statusPAE: undefined,
  invitedCurrentMeeting: undefined,
  invitedNextMeeting: undefined,
  distribution: undefined,
  firstName: '',
  lastName: ''
}

export const PARTICIPANT_STATUS_PAE = ['Présent', 'Absent', 'Excusé', null]

export const LOT_DEFAULT = ['MOA', 'AMO', 'MOE', 'PPA', 'SPS', 'CONCES']

export const AGENDA_HEARDERS = [
  {
    title: 'Ordre du jour',
    value: 'title'
  }
]

export const SCHEDULE_HEARDERS = [
  {
    title: 'Lot',
    value: 'lotName'
  },
  {
    title: 'Prévisionnel',
    value: 'description'
  },
  {
    title: 'Echéance',
    value: 'deadline'
  }
]

export const PROGRESS_HEARDERS = [
  {
    title: 'Lot',
    value: 'lotName'
  },
  {
    title: 'Descriptif',
    value: 'description'
  },
  {
    title: 'Avancement',
    value: 'progress'
  }
]
