import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, Button, Text, TextArea } from '@ignite-ui/react'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { unstable_getServerSession as unstableGetServerSession } from 'next-auth'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'

import { Header } from '../components/Header'
import { Container } from '../styles'
import { buildNextAuthOptions } from '../../api/auth/[...nextauth].api'
import * as S from './styles'
import { api } from '../../../lib/axios'

const updateProfileSchema = z.object({
  bio: z.string(),
})

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const { mutate } = useMutation<unknown, unknown, UpdateProfileFormData>({
    mutationFn: ({ bio }) =>
      api.put('/users/update-profile', {
        bio,
      }),
  })

  const session = useSession()
  const router = useRouter()

  async function handleUpdateProfile(data: UpdateProfileFormData) {
    const { bio } = data
    mutate(
      { bio },
      {
        onSuccess: async () => {
          await router.push(`/schedule/${session.data?.user.username}`)
        },
      },
    )
  }

  return (
    <Container>
      <Header
        currentStep={4}
        multiStepSize={4}
        title="Atualize seu perfil"
        content="Por último, uma breve descrição e uma foto de perfil."
      />

      <S.ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          {/* TODO: add feature upload image */}
          <Text size="sm">Foto de perfil</Text>
          <Avatar
            src={session.data?.user.avatar_url}
            alt={session.data?.user.name}
          />
        </label>

        <label>
          <Text size="sm">Sobre você</Text>

          <TextArea {...register('bio')} />

          <S.FormAnnotation size="sm">
            Fale um pouco sobre você. Isto será exibido em sua página pessoal.
          </S.FormAnnotation>
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Finalizar <ArrowRight />
        </Button>
      </S.ProfileBox>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstableGetServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  return {
    props: {
      session,
    },
  }
}
