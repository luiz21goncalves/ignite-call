import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextInput } from '@ignite-ui/react'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { api } from '../../lib/axios'
import { Header } from './components/Header'

import * as S from './styles'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
    .regex(/^([a-z0-9\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras, numeros e hifens.',
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter pelo menos 3 letras.' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  useEffect(() => {
    const username = router.query?.username as string
    const hasUsername = Boolean(username)

    if (hasUsername) {
      setValue('username', username)
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    const { name, username } = data

    try {
      await api.post('/users', {
        name,
        username,
      })

      await router.push('/register/connect-calendar')
    } catch (error) {
      const isAxiosError = error instanceof AxiosError

      if (isAxiosError) {
        const message = error?.response?.data?.message
        const isKnownError = Boolean(message)

        if (isKnownError) {
          alert(message)
          return
        }
      }

      console.error(error)
    }
  }

  return (
    <S.Container>
      <Header
        multiStepSize={4}
        currentStep={1}
        title="Bem-vindo ao Ignite Call!"
        content="Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois."
      />

      <S.Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuario"
            {...register('username')}
          />

          {errors.username && (
            <S.FormError size="sm">{errors.username.message}</S.FormError>
          )}
        </label>

        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput placeholder="Seu nome" {...register('name')} />

          {errors.name && (
            <S.FormError size="sm">{errors.name.message}</S.FormError>
          )}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </S.Form>
    </S.Container>
  )
}
