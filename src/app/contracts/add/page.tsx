'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { withAuth } from '@/app/components/withAuth'

function AddContractPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [parties, setParties] = useState([''])
  const router = useRouter()
  const { data: session, status } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title, 
          content, 
          userEmail: session?.user?.email || '',
          partyEmails: parties.filter(party => party.trim() !== '')
        }),
      })

      if (response.ok) {
        router.push('/contracts')
        router.refresh()
      } else {
        console.error('Failed to add contract')
      }
    } catch (error) {
      console.error('Error adding contract:', error)
    }
  }

  const handlePartyChange = (index: number, value: string) => {
    const newParties = [...parties]
    newParties[index] = value
    setParties(newParties)
  }

  const addParty = () => {
    setParties([...parties, ''])
  }

  const removeParty = (index: number) => {
    const newParties = parties.filter((_, i) => i !== index)
    setParties(newParties)
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
            className="form-control form-control-lg form-control-textarea"
            type="textarea"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Parties:</label>
          {parties.map((party, index) => (
            <div key={index} className="input-group mb-2">
              <input
                className="form-control"
                type="email"
                value={party}
                onChange={(e) => handlePartyChange(index, e.target.value)}
                placeholder="Enter party email"
              />
              <button type="button" className="btn btn-outline-secondary" onClick={() => removeParty(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline-primary" onClick={addParty}>
            Add Party
          </button>
        </div>
        <button type="submit" className='btn btn-primary mt-3'>Add Contract</button>
      </form>
    </div>
  )
}

export default withAuth(AddContractPage)