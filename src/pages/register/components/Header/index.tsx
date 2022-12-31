import { Heading, MultiStep, Text } from '@ignite-ui/react'

import * as S from './styles'

type HeaderProps = {
  multiStepSize: number
  currentStep: number
  title: string
  content: string
}

export function Header(props: HeaderProps) {
  const { currentStep, multiStepSize, content, title } = props

  return (
    <S.Container>
      <Heading as="strong">{title}</Heading>
      <Text>{content}</Text>

      <MultiStep size={multiStepSize} currentStep={currentStep} />
    </S.Container>
  )
}
