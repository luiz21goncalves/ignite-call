import { CaretLeft, CaretRight } from 'phosphor-react'
import { useId } from 'react'

import { getShortWeekDays } from '../../../utils/get-week-days'
import * as S from './style'

const shortWeekDays = getShortWeekDays()

export function Calendar() {
  const id = useId()

  return (
    <S.CalendarContainer>
      <S.CalendarHeader>
        <S.CalendarTitle>
          Janeiro <span>2023</span>
        </S.CalendarTitle>

        <S.CalendarActions>
          <button>
            <CaretLeft />
          </button>

          <button>
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
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <S.CalendarDay>1</S.CalendarDay>
            </td>
            <td>
              <S.CalendarDay>2</S.CalendarDay>
            </td>
            <td>
              <S.CalendarDay>3</S.CalendarDay>
            </td>
          </tr>
          <tr>
            <td>
              <S.CalendarDay>1</S.CalendarDay>
            </td>
            <td>
              <S.CalendarDay>1</S.CalendarDay>
            </td>
            <td>
              <S.CalendarDay>1</S.CalendarDay>
            </td>
            <td>
              <S.CalendarDay>1</S.CalendarDay>
            </td>
            <td>
              <S.CalendarDay>1</S.CalendarDay>
            </td>
            <td>
              <S.CalendarDay>2</S.CalendarDay>
            </td>
            <td>
              <S.CalendarDay>3</S.CalendarDay>
            </td>
          </tr>
        </tbody>
      </S.CalendarBody>
    </S.CalendarContainer>
  )
}
