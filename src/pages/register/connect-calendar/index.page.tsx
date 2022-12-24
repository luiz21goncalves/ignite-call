import { Button, Text } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'

import { Header } from '../components/Header'
import { Container } from '../styles'

import * as S from './styles'

export default function ConnetCalendar() {
  return (
    <Container>
      <Header multiStepSize={4} currentStep={2} />

      <S.ConnectBox>
        <S.ConnectItem>
          <Text>Google Calendar</Text>
          <Button variant="secondary" size="sm">
            Conectar
            <ArrowRight />
          </Button>
        </S.ConnectItem>

        <Button type="submit">
          Próximo passo
          <ArrowRight />
        </Button>
      </S.ConnectBox>
    </Container>
  )
}
