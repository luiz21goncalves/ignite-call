import { Avatar, Heading, Text } from '@ignite-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'

import { prisma } from '../../../lib/prisma'
import { ScheduleForm } from './ScheduleForm'
import * as S from './styles'

type ScheduleProps = {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function Schedule(props: ScheduleProps) {
  const { user } = props

  return (
    <S.Container>
      <S.UserHeader>
        <Avatar src={user.avatarUrl} />
        <Heading>{user.name}</Heading>
        <Text>{user.bio}</Text>
      </S.UserHeader>

      <ScheduleForm />
    </S.Container>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avataUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  }
}
