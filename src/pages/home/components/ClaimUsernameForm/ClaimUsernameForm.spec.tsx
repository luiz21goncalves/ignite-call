import { render, screen } from '@testing-library/react'
import { faker } from '@faker-js/faker'
import userEvent from '@testing-library/user-event'
import { RouterContext } from 'next/dist/shared/lib/router-context'

import { createMockRouter } from '../../../../../test/utils/createMockRouter'
import { ClaimUsenameForm } from '.'

describe('ClaimUsernameForm component', () => {
  it('should be able to render core elements', () => {
    render(
      <RouterContext.Provider value={createMockRouter()}>
        <ClaimUsenameForm />
      </RouterContext.Provider>,
    )

    const inputElement = screen.getByRole('textbox')
    const buttomElement = screen.getByRole('button', { name: /reservar/i })
    const formAnottationElement = screen.getByText(
      /digite o nome de usuário desejado/i,
    )

    expect(inputElement).toBeInTheDocument()
    expect(buttomElement).toBeInTheDocument()
    expect(formAnottationElement).toBeInTheDocument()
  })

  it('should be able to fill out the form and redirect the user', async () => {
    const randomUsername = faker.random.alphaNumeric(8)
    const pushMock = jest.fn()

    render(
      <RouterContext.Provider value={createMockRouter({ push: pushMock })}>
        <ClaimUsenameForm />
      </RouterContext.Provider>,
    )

    const inputElement = screen.getByRole('textbox')
    const buttomElement = screen.getByRole('button', { name: /reservar/i })

    await userEvent.type(inputElement, randomUsername)
    await userEvent.click(buttomElement)

    expect(pushMock).toHaveBeenCalledWith({
      pathname: '/register',
      query: {
        username: randomUsername,
      },
    })
  })

  it('should not be able to redirect a user if the usename is less then 3 characters', async () => {
    const randomUsername = faker.random.alphaNumeric(2)
    const pushMock = jest.fn()

    render(
      <RouterContext.Provider value={createMockRouter({ push: pushMock })}>
        <ClaimUsenameForm />
      </RouterContext.Provider>,
    )

    const inputElement = screen.getByRole('textbox')
    const buttomElement = screen.getByRole('button', { name: /reservar/i })

    await userEvent.type(inputElement, randomUsername)
    await userEvent.click(buttomElement)

    const formAnottationElement = await screen.findByText(
      /o usuário precisa ter pelo menos 3 letras/i,
    )

    expect(pushMock).not.toHaveBeenCalled()
    expect(formAnottationElement).toBeInTheDocument()
  })

  it('should not be able to redirect a user if the usename has invalid characters', async () => {
    const invalidUsername = 'john@doe'
    const pushMock = jest.fn()

    render(
      <RouterContext.Provider value={createMockRouter({ push: pushMock })}>
        <ClaimUsenameForm />
      </RouterContext.Provider>,
    )

    const inputElement = screen.getByRole('textbox')
    const buttomElement = screen.getByRole('button', { name: /reservar/i })

    await userEvent.type(inputElement, invalidUsername)
    await userEvent.click(buttomElement)

    const formAnottationElement = await screen.findByText(
      /o usuário pode ter apenas letras, numeros e hifens/i,
    )

    expect(pushMock).not.toHaveBeenCalled()
    expect(formAnottationElement).toBeInTheDocument()
  })
})
