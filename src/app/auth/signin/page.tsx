'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignIn() {
  const [email, setEmail] = useState('mori@mail.com')
  const [password, setPassword] = useState('111')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password')
    } else if (result?.ok) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="container mt-5 max-w-md mx-auto">
        <h1 className="mb-4">Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Sign In</button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <p className="mt-4">
          Don't have an account? <Link href="/auth/signup" className="text-blue-500">Sign Up</Link>
        </p>
    </div>
  )
}
