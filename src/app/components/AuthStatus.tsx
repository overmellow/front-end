'use client'

import { useSession, signOut } from "next-auth/react"
import Link from 'next/link'

export default function AuthStatus() {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()} className="btn btn-secondary">Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <div className="d-flex gap-3 mb-4">
      <Link href="/auth/signin" className="btn btn-primary">Sign in</Link>
      </div>
    </>
  )
}
