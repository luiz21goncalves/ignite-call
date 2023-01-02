import { themes } from '@storybook/theming'
import NextImage from 'next/image'
import { RouterContext } from "next/dist/shared/lib/router-context"

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme: themes.dark
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
}

if (typeof global.process === 'undefined') {
  const { worker } = require('../src/mocks/browser')
  worker.start()
}
