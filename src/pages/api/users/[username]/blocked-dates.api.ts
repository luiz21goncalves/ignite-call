import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../../../lib/prisma'

type BlockedDatesRaw = {
  date: number
  amount: bigint
  size: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const isNotAuthorazedMethod = req.method !== 'GET'

  if (isNotAuthorazedMethod) {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { year, month } = req.query

  if (!year && !month) {
    return res.status(400).json({ message: 'Year or month not specified.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    where: {
      user_id: user.id,
    },
    select: {
      week_day: true,
    },
  })

  const blockedWeekDays = Array.from({ length: 7 })
    .map((_, index) => index)
    .filter((weekDay) => {
      return !availableWeekDays.some(
        (availableWeekDay) => availableWeekDay.week_day === weekDay,
      )
    })

  const blockedDatesRaw = await prisma.$queryRaw<BlockedDatesRaw[]>`
    SELECT
      EXTRACT(DAY FROM S.date) as date,
      COUNT(S.date) as amount,
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60) as size

    FROM schedulings S

    LEFT JOIN user_time_intervals UTI
      ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))

    WHERE S.user_id = ${user.id}
      AND DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month}`}

    GROUP BY EXTRACT(DAY FROM S.date),
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)

    HAVING amount >= size
  `

  const blockedDates = blockedDatesRaw.map((blockedDate) => blockedDate.date)

  return res.json({ blockedWeekDays, blockedDates })
}
