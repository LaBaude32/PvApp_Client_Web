import { DateTime, Settings } from 'luxon'
Settings.defaultLocale = 'fr'

function formatDate(value: string) {
  if (value) {
    return DateTime.fromSQL(value).toFormat('ff')
  }
}

function formatDateWithA(value: string) {
  if (value) {
    return DateTime.fromSQL(value).toFormat('ccc d LLL yyyy à T')
  }
}

function formatDateShortDayOnly(value: string) {
  if (value) {
    return DateTime.fromSQL(value).toFormat('ccc d LLL y')
  }
}

export default {
  formatDate,
  formatDateWithA,
  formatDateShortDayOnly
}
