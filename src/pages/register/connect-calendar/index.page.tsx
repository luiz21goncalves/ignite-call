import { Button, Text } from '@ignite-ui/react'
import { signIn, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { ArrowRight, Check } from 'phosphor-react'

import { Header } from '../components/Header'
import { Container } from '../styles'
import * as S from './styles'

export default function ConnetCalendar() {
  const session = useSession()
  const router = useRouter()

  async function handleConnetCalendar() {
    await signIn('google')
  }

  async function handleRedirectToTimeIntervals() {
    await router.push('/register/time-intervals')
  }

  const hasAuthError = Boolean(router.query?.error)
  const isSignedIn = session.status === 'authenticated'

  return (
    <>
      <NextSeo title="Conecte seu agenda do Google | Ignite Call" noindex />

      <Container>
        <Header
          multiStepSize={4}
          currentStep={2}
          title="Conecte sua agenda!"
          content="Conecte o seu calendário para verificar automaticamente as horas ocupadas e os novos eventos à medida em que são agendados."
        />

        <S.ConnectBox>
          <S.ConnectItem>
            <Text>Google Calendar</Text>
            {isSignedIn ? (
              <Button size="sm" disabled>
                Connectado <Check />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleConnetCalendar}
                disabled={isSignedIn}
              >
                Conectar
                <ArrowRight />
              </Button>
            )}
          </S.ConnectItem>

          {hasAuthError && (
            <S.AuthError size="sm">
              Falha ao se conectar ao Google, verifique se você habilitou as
              permissões de acessos ao Google Calendar
            </S.AuthError>
          )}

          <Button
            type="submit"
            disabled={!isSignedIn}
            onClick={handleRedirectToTimeIntervals}
          >
            Próximo passo
            <ArrowRight />
          </Button>
        </S.ConnectBox>
      </Container>
    </>
  )
}
