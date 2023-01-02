import { ComponentMeta, ComponentStory } from '@storybook/react'
import { within, userEvent } from '@storybook/testing-library'

import Register from './index.page'

type RegisterProps = typeof Register

export default {
  title: 'Pages/Register',
  component: Register,
  parameters: {
    nextRouter: {
      query: {
        username: 'john-doe',
      },
    },
  },
} as ComponentMeta<RegisterProps>

const Template: ComponentStory<RegisterProps> = () => <Register />

export const Default = Template.bind({})

export const Filled = Template.bind({})
Filled.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const nameInput = canvas.getByRole('textbox', { name: /nome completo/i })
  const submitButton = canvas.getByRole('button')

  await userEvent.type(nameInput, 'John Doe', { delay: 100 })
  await userEvent.click(submitButton)
}
