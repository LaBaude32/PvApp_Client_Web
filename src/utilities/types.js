export const defaultItem = {
    position: null,
    lotsToReturn: [],
    lots: [],
    note: null,
    followUp: null,
    resources: null,
    completion: ['A faire', 'Urgent', 'Fait'],
    completionDate: '',
    completionDateDate: '',
    completionDateTime: '',
    image: null,
    visible: true,
    isImageChange: false,
    isNewImage: true
}

export const UserHeaders = [
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

export const ItemHeaders = [
    {
        title: 'Position',
        align: 'center',
        value: 'position'
    },
    { title: 'Note', value: 'note', sortable: false },
    { title: 'Suite à donner', value: 'followUp', sortable: false },
    { title: 'Ressource', value: 'resources', sortable: false },
    { title: 'Echeance', value: 'completion', sortable: false },
    { title: "Date d'echéance", value: 'completionDate' }
]