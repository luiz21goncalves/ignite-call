export function getWeekDays() {
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })
  const weekDaysIterator = Array(7).keys()

  const weekDaysMap = Array.from(weekDaysIterator).reduce(
    (weekDaysObject, day) => {
      const weekDay = formatter.format(new Date(Date.UTC(2021, 5, day)))
      const capitalizedWeekDay = weekDay
        .substring(0, 1)
        .toUpperCase()
        .concat(weekDay.substring(1))

      weekDaysObject[day] = capitalizedWeekDay

      return weekDaysObject
    },
    {} as Record<number, string>,
  )

  return weekDaysMap
}

export function getShortWeekDays() {
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
  const weekDaysIterator = Array(7).keys()

  const weekDaysMap = Array.from(weekDaysIterator).map((day) => {
    const weekDay = formatter.format(new Date(Date.UTC(2021, 5, day)))
    const capitalizedWeekDay = weekDay.toUpperCase()

    return capitalizedWeekDay
  })

  return weekDaysMap
}
