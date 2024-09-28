import Link from 'next/link'
import AuthStatus from './components/AuthStatus'

export default function Home() {
  return (
    <main className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h1 className="display-4 mb-4">Welcome to Bitwinus</h1>
      <div className="d-flex gap-3 mb-4">
        <Link href="/about" className="btn btn-primary">
          About Us
        </Link>
      </div>
      <AuthStatus />
    </main>
  )
}
