'use client'

import 'bootstrap/dist/css/bootstrap.css'
import BootstrapClient from './BootstrapClient'
import { SessionProvider } from "next-auth/react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
          <BootstrapClient />
        </SessionProvider>
      </body>
    </html>
  )
}
