import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useId, useMemo, useState } from 'react'

import { api } from '../../lib/axios'
import { getShortWeekDays } from '../../utils/get-week-days'
import * as S from './style'

const shortWeekDays = getShortWeekDays()

type CalendarWeek = {
  week: number
  days: Array<{ date: dayjs.Dayjs; disabled: boolean }>
}

type CalendarWeeks = CalendarWeek[]

type CalendarProps = {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}

type BlockedDates = {
  blockedWeekDays: number[]
  blockedDates: number[]
}

export function Calendar(props: CalendarProps) {
  const { onDateSelected } = props

  const id = useId()
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const router = useRouter()

  const username = String(router.query.username)

  const { data: blockedDates } = useQuery(
    [
      'blocked-dates',
      currentDate.get('year'),
      currentDate.format('MM'),
      username,
    ],
    async () => {
      const response = await api.get<BlockedDates>(
        `/users/${username}/blocked-dates`,
        {
          params: {
            year: currentDate.get('year'),
            month: currentDate.format('MM'),
          },
        },
      )
      return response.data
    },
    {
      enabled: Boolean(username),
    },
  )

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'months')

    setCurrentDate(previousMonthDate)
  }

  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, 'months')

    setCurrentDate(nextMonthDate)
  }

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, index) => {
      return currentDate.set('date', index + 1)
    })

    const firstWeekDay = currentDate.get('day')

    const previousMonthFillArray = Array.from({ length: firstWeekDay })
      .map((_, index) => {
        return currentDate.subtract(index + 1, 'day')
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )
    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, index) => {
      return lastDayInCurrentMonth.add(index + 1, 'day')
    })

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonthArray.map((date) => {
        const isPastDate = date.endOf('day').isBefore(new Date())
        const isBlockedDate =
          blockedDates.blockedWeekDays.includes(date.get('day')) ||
          blockedDates.blockedDates.includes(date.get('date'))

        return {
          date,
          disabled: isPastDate || isBlockedDate,
        }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const formatedCalendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, index, original) => {
        const isNewWeek = index % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: index / 7 + 1,
            days: original.slice(index, index + 7),
          })
        }

        return weeks
      },
      [],
    )

    return formatedCalendarWeeks
  }, [currentDate, blockedDates])

  return (
    <S.CalendarContainer>
      <S.CalendarHeader>
        <S.CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </S.CalendarTitle>

        <S.CalendarActions>
          <button onClick={handlePreviousMonth} title="Previous month">
            <CaretLeft />
          </button>

          <button onClick={handleNextMonth} title="Next moth">
            <CaretRight />
          </button>
        </S.CalendarActions>
      </S.CalendarHeader>

      <S.CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekday) => {
              return <th key={`${id}-${weekday}`}>{weekday}</th>
            })}
          </tr>
        </thead>

        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  function handleSelectDate() {
                    onDateSelected(date.toDate())
                  }

                  return (
                    <td key={date.toString()}>
                      <S.CalendarDay
                        disabled={disabled}
                        onClick={handleSelectDate}
                      >
                        {date.get('date')}
                      </S.CalendarDay>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </S.CalendarBody>
    </S.CalendarContainer>
  )
}
