import { Box, styled, Text } from '@ignite-ui/react'

export const Container = styled('main', {
  maxWidth: '572px',
  margin: '$20 auto $4',
  padding: '0 $4',
})

export const Form = styled(Box, {
  marginTop: '$6',
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',

  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
  },
})

export const FormError = styled(Text, {
  color: '#f75a68',
})
