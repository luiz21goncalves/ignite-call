import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const isNotAuthorazedMethod = req.method !== 'GET'

  if (isNotAuthorazedMethod) {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { date } = req.query

  if (!date) {
    return res.status(400).json({ message: 'Date not provided.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return res.json({ availableTimes: [], possibleTimes: [] })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({ availableTimes: [], possibleTimes: [] })
  }

  const {
    time_start_in_minutes: timeStartInMinutes,
    time_end_in_minutes: timeEndInMinutes,
  } = userAvailability

  const startHour = timeStartInMinutes / 60
  const endHour = timeEndInMinutes / 60

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, index) => {
      return startHour + index
    },
  )

  const blockedTimes = await prisma.scheduling.findMany({
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
    select: {
      date: true,
    },
  })

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTimes) => blockedTimes.date.getHours() === time,
    )

    const isTimeInPast = referenceDate.set('hour', time).isBefore(new Date())

    return !isTimeBlocked && !isTimeInPast
  })

  return res.json({ availableTimes, possibleTimes })
}
