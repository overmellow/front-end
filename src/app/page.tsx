'use client'

import AuthStatus from './components/AuthStatus'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { status } = useSession()
  const router = useRouter()
  useEffect(() => {
  if (status === 'authenticated') {
    router.push('/dashboard')
    }
  }, [status])

  return (
    <main className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h1 className="display-4 mb-4"><i>bitwin.us</i></h1>
      <AuthStatus />
    </main>
  )
}
