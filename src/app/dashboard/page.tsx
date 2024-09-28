'use client'

import { withAuth } from '../components/withAuth'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

function Dashboard() {
  const { data: session } = useSession()

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard, {session?.user?.email}. This is a protected page.</p>
      <button 
        className="btn btn-danger" 
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        Log out
      </button>
    </div>
  )
}

export default withAuth(Dashboard)
