'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
      console.log('status:', status)
      if (status === 'loading' || status === 'authenticated') return // Do nothing while loading
      if (!session || status === 'unauthenticated') router.push('/auth/signin')  
    }, [session, status, router])

    if (status === 'loading') {
      return <div>Loading...</div>
    }

    if (!session) {
      return null
    }

    return <Component {...props} />
  }
}
