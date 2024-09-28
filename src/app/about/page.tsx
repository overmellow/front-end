'use client';

import { useState, useEffect } from 'react';

export default function About() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // fetch('/api/hello')
    fetch('/api/auth/signup')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching message:', error));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">About Bitwinus</h1>
      <p className="text-xl text-center max-w-2xl mb-6">
        Bitwinus is a cutting-edge platform dedicated to revolutionizing the world of cryptocurrency and blockchain technology.
      </p>
      {message && (
        <p className="text-lg mt-4">Message from API: {message}</p>
      )}
    </main>
  )
}
