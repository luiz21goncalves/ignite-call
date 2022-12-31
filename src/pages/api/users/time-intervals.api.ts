import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession as unstableGetServerSession } from 'next-auth'
import { z } from 'zod'

import { prisma } from '../../../lib/prisma'

import { buildNExtAuthOptions } from '../auth/[...nextauth].api'

const timeIntervalsBodySchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number(),
        startTimeInMinutes: z.number(),
        endTimeInMinutes: z.number(),
      }),
    )
    .refine((intervais) => {
      return intervais.every(
        (interval) =>
          interval.endTimeInMinutes - interval.startTimeInMinutes >= 60,
      )
    }),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const isNotAuthorazedMethod = req.method !== 'POST'

  if (isNotAuthorazedMethod) {
    return res.status(405).end()
  }

  const session = await unstableGetServerSession(
    req,
    res,
    buildNExtAuthOptions(req, res),
  )

  const isNotAuthenticated = !session

  if (isNotAuthenticated) {
    return res.status(401).end()
  }

  const { intervals } = timeIntervalsBodySchema.parse(req.body)

  // TODO: use method createMany after changing DB provider
  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user_id: session.user.id,
        },
      })
    }),
  )

  return res.status(201).end()
}
