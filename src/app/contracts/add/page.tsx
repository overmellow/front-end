'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddContractPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      })

      if (response.ok) {
        const data = await response.json()

        router.push('/contracts')
        router.refresh()
      } else {
        console.error('Failed to add contract')
      }
    } catch (error) {
      console.error('Error adding contract:', error)
    }
  }

  return (
    <div className='container mt-5'>
      <h1>Add New Contract</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group mt-3'>
          <label htmlFor="title" className='form-label'>Title:</label>
          <input
            className="form-control"
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className='form-group mt-3'>
          <label htmlFor="content" className='form-label'>Content:</label>
          <input
            className="form-control form-control-lg"
            type="textarea"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <button type="submit" className='btn btn-primary mt-3'>Add Contract</button>
      </form>
    </div>
  )
}
