import { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'

import { prisma } from '../../../lib/prisma'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const isNotAuthorazedMethod = req.method !== 'POST'

  if (isNotAuthorazedMethod) {
    return res.status(405).end()
  }

  const { name, username } = req.body

  const foundUserByUsername = await prisma.user.findUnique({
    where: {
      username,
    },
  })
  const isUsernameInUse = Boolean(foundUserByUsername)

  if (isUsernameInUse) {
    return res.status(400).json({
      message: 'Username already taken.',
    })
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })

  return res.status(201).json(user)
}
