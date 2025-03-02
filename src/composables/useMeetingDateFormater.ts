import { useDate, type DateInstance } from 'vuetify'

export function useMeetingDateFormater(meetingDate: string) {
  const date = useDate()
  const meetingDateDate = date.parseISO(meetingDate.slice(0, 10)) as DateInstance
  const meetingDateTime = meetingDate.slice(-8, -3)

  return { meetingDateDate, meetingDateTime }
}
