import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { api } from '../../../../../lib/axios'
import * as S from './styles'

const confirmScheduleFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome precisa do mínimo de 3 caracteres' }),
  email: z.string().email({ message: 'Digite um e-mail válido' }),
  observations: z.string().nullable(),
})

type ConfirmScheduleFormData = z.infer<typeof confirmScheduleFormSchema>

type ConfirmStepProps = {
  schedulingDate: Date
  onCancelConfirmation: () => void
}

type SchedulingBody = {
  name: string
  email: string
  observations: string | null
  date: Date
}

export function ConfirmStep(props: ConfirmStepProps) {
  const { schedulingDate, onCancelConfirmation } = props

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmScheduleFormData>({
    resolver: zodResolver(confirmScheduleFormSchema),
  })

  const router = useRouter()

  const username = String(router.query.username)

  const { mutate } = useMutation<unknown, unknown, SchedulingBody>({
    mutationFn: ({ date, email, name, observations }) =>
      api.post(`/users/${username}/schedule`, {
        date,
        email,
        name,
        observations,
      }),
  })

  async function handleConfirmScheduling(data: ConfirmScheduleFormData) {
    const { email, name, observations } = data

    mutate(
      {
        date: schedulingDate,
        email,
        name,
        observations,
      },
      {
        onSuccess: async () => {
          onCancelConfirmation()
        },
      },
    )
  }

  const describeDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const describeTime = dayjs(schedulingDate).format('HH:mm[h]')

  return (
    <S.Form as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <S.FormHeader>
        <Text>
          <CalendarBlank />
          {describeDate}
        </Text>

        <Text>
          <Clock />
          {describeTime}
        </Text>
      </S.FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu nome" {...register('name')} />
        {errors.name && (
          <S.FormError size="sm">{errors.name.message}</S.FormError>
        )}
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput
          type="email"
          placeholder="johndoe@example.com"
          {...register('email')}
        />
        {errors.email && (
          <S.FormError size="sm">{errors.email.message}</S.FormError>
        )}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register('observations')} />
      </label>

      <S.FormActions>
        <Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
          Cancelar
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </S.FormActions>
    </S.Form>
  )
}
