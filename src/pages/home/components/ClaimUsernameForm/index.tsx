import { Button, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'

import * as S from './styles'

export function ClaimUsenameForm() {
  return (
    <S.Form as="form">
      <TextInput size="sm" prefix="ignite.com/" placeholder="Seu usuário" />

      <Button size="sm" type="submit">
        Reservar
        <ArrowRight />
      </Button>
    </S.Form>
  )
}
