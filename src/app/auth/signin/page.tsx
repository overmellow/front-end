'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import '@/app/auth/signin/signin.css'

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
      router.push('/dashboard/contracts/add')
    }
  }

  return (
    <>
    <main className="form-signin w-100 m-auto">
      <form onSubmit={handleSubmit}>
        {/* <img className="mb-4" src="../assets/brand/bootstrap-logo.svg" alt="" width="72" height="57"/> */}
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

        <div className="form-floating">
          <input
              type="text"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
        <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <div className="form-check text-start my-3">
          {/* <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault"/> */}
          <label className="form-check-label" htmlFor="flexCheckDefault">
          Don't have an account? <Link href="/auth/signup" className="text-blue-500">Sign Up</Link>
          </label>
        </div>
        <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <p className="mt-5 mb-3 text-body-secondary" id="copyright">&copy; 2017–2024</p>
      </form>
      </main>
    </>
  )
}
