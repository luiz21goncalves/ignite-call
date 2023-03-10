import { ComponentMeta, ComponentStory } from '@storybook/react'
import { within, userEvent } from '@storybook/testing-library'

import Home from '.'

type HomeProps = typeof Home

export default {
  title: 'Pages/Home',
  component: Home,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<HomeProps>

const Template: ComponentStory<HomeProps> = () => <Home />

export const Default = Template.bind({})

export const Filled = Template.bind({})
Filled.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const usernameInput = canvas.getByRole('textbox')
  const submitButton = canvas.getByRole('button')

  await userEvent.type(usernameInput, 'john-doe', { delay: 100 })
  await userEvent.click(submitButton)
}

export const WithError = Template.bind({})
WithError.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const usernameInput = canvas.getByRole('textbox')
  const submitButton = canvas.getByRole('button')

  await userEvent.type(usernameInput, 'jonh@doe', { delay: 100 })
  await userEvent.click(submitButton)
}
