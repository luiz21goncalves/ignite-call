import { Heading, MultiStep, Text } from '@ignite-ui/react'

import * as S from './styles'

type HeaderProps = {
  multiStepSize: number
  currentStep: number
}

export function Header(props: HeaderProps) {
  const { currentStep, multiStepSize } = props

  return (
    <S.Container>
      <Heading as="strong">Ben-vendo ao Ignite Call!</Heading>
      <Text>
        Precisamos de algumas informações para criar seu perfil! Ah, você pode
        editar essas informações depois.
      </Text>

      <MultiStep size={multiStepSize} currentStep={currentStep} />
    </S.Container>
  )
}
