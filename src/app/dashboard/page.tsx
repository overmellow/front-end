'use client'

import { withAuth } from '../components/withAuth'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="container mt-5">
      <ul>
        <li><Link href="/contracts">Contracts</Link></li>
      </ul>
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

export default withAuth(DashboardPage)