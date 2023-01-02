import { render, screen } from '@testing-library/react'

import Home from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {}
    },
  }
})

describe('Home page', () => {
  it('should be able to render a core elements', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: /agendamento descomplicado/i,
    })
    const text = screen.getByText(
      /conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre\./i,
    )
    const image = screen.getByRole('img', {
      name: /calendário simbolizando aplicação em funcionamento/i,
    })

    expect(heading).toBeInTheDocument()
    expect(text).toBeInTheDocument()
    expect(image).toBeInTheDocument()
  })
})
