import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

import { PrismaAdapter } from '../../../lib/auth/prisma-adapter'

export function buildNExtAuthOptions(
  req: NextApiRequest,
  res: NextApiResponse,
): NextAuthOptions {
  return {
    adapter: PrismaAdapter(req, res),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        authorization: {
          params: {
            scope:
              'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar',
          },
        },
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            name: profile.name,
            avatar_url: profile.picture,
            email: profile.email,
            username: '',
          }
        },
      }),
    ],

    callbacks: {
      async signIn({ account }) {
        const hasCalendarPermission = account?.scope?.includes(
          'https://www.googleapis.com/auth/calendar',
        )

        if (hasCalendarPermission) {
          return true
        }

        return '/register/connect-calendar?error=permissions'
      },
    },
  }
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await NextAuth(req, res, buildNExtAuthOptions(req, res))
}
