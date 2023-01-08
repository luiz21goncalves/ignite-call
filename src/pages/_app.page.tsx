import '../lib/dayjs'

import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { DefaultSeo } from 'next-seo'

import { globalStyles } from '../styles/global'
import { queryClient } from '../lib/react-query'

globalStyles()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <DefaultSeo
          openGraph={{
            type: 'website',
            locale: 'pt_BR',
            url: 'https://ignite-call.luizgoncalves.com',
            siteName: 'Ignite Call',
          }}
          twitter={{
            handle: '@ignite.call',
            site: '@ignite.call',
            cardType: 'summary_large_image',
          }}
          title="Ignite Call"
          defaultTitle="Ignite Call"
        />

        <Component {...pageProps} />
      </SessionProvider>

      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
