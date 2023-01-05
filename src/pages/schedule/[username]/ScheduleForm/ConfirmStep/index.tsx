import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import * as S from './styles'

const confirmScheduleFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome precisa do mínimo de 3 caracteres' }),
  email: z.string().email({ message: 'Digite um e-mail válido' }),
  observations: z.string().nullable(),
})

type ConfirmScheduleFormData = z.infer<typeof confirmScheduleFormSchema>

export function ConfirmStep() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmScheduleFormData>({
    resolver: zodResolver(confirmScheduleFormSchema),
  })

  function handleConfirmScheduling(data: ConfirmScheduleFormData) {
    console.log(data)
  }

  return (
    <S.Form as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <S.FormHeader>
        <Text>
          <CalendarBlank />
          22 setembro de 2022
        </Text>

        <Text>
          <Clock />
          18:00h
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
        <Button type="button" variant="tertiary">
          Cancelar
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </S.FormActions>
    </S.Form>
  )
}
