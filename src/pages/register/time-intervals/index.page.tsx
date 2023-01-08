import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Checkbox, Text, TextInput } from '@ignite-ui/react'
import { useMutation } from '@tanstack/react-query'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import { api } from '../../../lib/axios'
import { convertTimeStringToMinutes } from '../../../utils/convert-time-string-to-minutes'
import { getWeekDays } from '../../../utils/get-week-days'
import { Header } from '../components/Header'
import { Container } from '../styles'
import * as S from './styles'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana!',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        }
      })
    })
    .refine(
      (intervais) => {
        return intervais.every(
          (interval) =>
            interval.endTimeInMinutes - interval.startTimeInMinutes >= 60,
        )
      },
      {
        message:
          'O horário de término deve ser pelo menos 1h distante do início.',
      },
    ),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  })
  const { fields } = useFieldArray({ name: 'intervals', control })

  const { mutate } = useMutation<unknown, unknown, TimeIntervalsFormOutput>({
    mutationFn: ({ intervals }) =>
      api.post('/users/time-intervals', { intervals }),
  })

  const router = useRouter()

  async function handleSetTimeIntervals(data: any) {
    const { intervals } = data as TimeIntervalsFormOutput

    mutate(
      { intervals },
      {
        onSuccess: async () => {
          await router.push('/register/update-profile')
        },
      },
    )
  }

  const intervals = watch('intervals')

  const weekDays = getWeekDays()

  return (
    <>
      <NextSeo title="Selecione sua disponibilidade | Ignite Call" noindex />

      <Container>
        <Header
          multiStepSize={4}
          currentStep={3}
          title="Quase lá"
          content="Defina o intervalo de horários que você está disponível em cada dia da semana."
        />

        <S.IntervalBox
          as="form"
          onSubmit={handleSubmit(handleSetTimeIntervals)}
        >
          <S.IntervalsContainer>
            {fields.map((field, index) => {
              return (
                <S.IntervalItem key={field.id}>
                  <S.IntervalDay>
                    <Controller
                      name={`intervals.${index}.enabled`}
                      control={control}
                      render={({ field }) => {
                        return (
                          <Checkbox
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                            checked={field.value}
                          />
                        )
                      }}
                    />
                    <Text>{weekDays[field.weekDay]}</Text>
                  </S.IntervalDay>

                  <S.IntervalInputs>
                    <TextInput
                      size="sm"
                      type="time"
                      step={60}
                      disabled={intervals[index].enabled === false}
                      {...register(`intervals.${index}.startTime`)}
                    />
                    <TextInput
                      size="sm"
                      type="time"
                      step={60}
                      disabled={intervals[index].enabled === false}
                      {...register(`intervals.${index}.endTime`)}
                    />
                  </S.IntervalInputs>
                </S.IntervalItem>
              )
            })}
          </S.IntervalsContainer>

          {errors.intervals && (
            <S.FormError size="sm">{errors.intervals.message}</S.FormError>
          )}

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </S.IntervalBox>
      </Container>
    </>
  )
}
