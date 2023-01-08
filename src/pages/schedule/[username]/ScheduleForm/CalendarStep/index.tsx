import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { Calendar } from '../../../../../components/Calendar'
import { api } from '../../../../../lib/axios'
import * as S from './styles'

type Availability = {
  possibleTimes: number[]
  availableTimes: number[]
}

type CalendarStepProps = {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep(props: CalendarStepProps) {
  const { onSelectDateTime } = props

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()
  const username = String(router.query.username)

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availability } = useQuery(
    ['availability', selectedDateWithoutTime, username],
    async () => {
      const response = await api.get<Availability>(
        `/users/${username}/availability`,
        {
          params: {
            date: selectedDateWithoutTime,
          },
        },
      )

      return response.data
    },
    {
      enabled: !!(selectedDateWithoutTime && username),
    },
  )

  const isDateSelected = Boolean(selectedDate)

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()

    onSelectDateTime(dateWithTime)
  }

  return (
    <S.Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <S.TimePicker>
          <S.TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </S.TimePickerHeader>

          <S.TimePickerList>
            {availability?.possibleTimes.map((hour) => {
              return (
                <S.TimePickerItem
                  key={hour}
                  disabled={!availability.availableTimes.includes(hour)}
                  onClick={() => handleSelectTime(hour)}
                >
                  {String(hour).padStart(2, '0')}:00h
                </S.TimePickerItem>
              )
            })}
          </S.TimePickerList>
        </S.TimePicker>
      )}
    </S.Container>
  )
}
