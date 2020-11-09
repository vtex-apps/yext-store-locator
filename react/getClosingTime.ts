import { SpecificationGroup } from './typings/store'

export const getClosingTime = (group: SpecificationGroup): string | null => {
  const today = new Date()

  today.setHours(0, 0, 0, 0)
  const day = today.getDay()

  const holidayHours = group.holidayHours.find(
    (e) => new Date(e.date).getTime() === today.getTime()
  )

  const hours =
    holidayHours ?? group.businessHours.find((e) => e.dayOfWeek === day)

  return hours ? hours.closingTime : null
}
