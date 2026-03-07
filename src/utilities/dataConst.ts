import type { Item, Participant } from './types'

export const DEFAULT_ITEM : Item = {
  position: null,
  lotsToReturn: [],
  lots: [],
  note: null,
  followUp: null,
  resources: null,
  completion: ['A faire', 'Urgent', 'Fait', 'En cours', 'Dès que possible'], //TODO: A mettre en Enum dans la BDD ?
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
  'Divers',
  'Coordonnateur SPS',
  'BET'
]

export const DEFAULT_PARTICIPANT: Participant = {
  userId: undefined,
  pvId: undefined,
  firstName: '',
  lastName: '',
  password: '',
  userGroup: '',
  userFunction: '',
  organism: '',
  organisationId: -1,
  email: '',
  phone: '',
  statusPAE: null,
  invitedCurrentMeeting: false,
  invitedNextMeeting: false,
  distribution: false,
  position: -1
}

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
  { title: 'Photo', value: 'image' },
  { title: 'Rappel', value: 'reminder', sortable: false },
  { title: 'Visible', value: 'visible' },
  { title: 'Actions', value: 'actions', sortable: false }
]

export const PARTICIPANT_HEADERS = [
  {
    title: 'Ordre',
    value: 'position'
  },
  {
    title: 'Prénom Nom',
    align: 'start',
    value: 'fullName'
  },
  {
    title: 'Groupe',
    value: 'userGroup'
  },
  { title: 'Fonction', value: 'userFunction' },
  { title: 'Organisme', value: 'organism' },
  { title: 'Mail', value: 'email' },
  { title: 'Téléphone', value: 'phone' },
  { title: 'Statut', value: 'statusPAE' },
  { title: 'C1', value: 'invitedCurrentMeeting' },
  { title: 'C2', value: 'invitedNextMeeting' },
  { title: 'Diffusion', value: 'distribution' },
  { title: 'Modifier', value: 'actions' }
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

export const EDITED_PARTICIPANT_ITEM: Participant = {
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

export const PARTICIPANT_STATUS_PAE = ['Présent', 'Absent', 'Excusé', 'Représenté', null]

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
