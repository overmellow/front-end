'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { withAuth } from '@/app/components/withAuth'
import Link from 'next/link'

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
        router.push('/dashboard/contracts')
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
    <>
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 className="h2">New Contract</h1>
      <div className="btn-toolbar mb-2 mb-md-0">
        <Link href={`/dashboard/contracts`} className='me-2'>
          <button className="btn btn-outline-secondary mb-3 btn-sm">Cancel</button>
        </Link>
      </div>
    </div>

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

      </div>

      <div className='d-flex justify-content-end'>
          <Link href="#">
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={addParty}>Add Party</button>
          </Link>            
        </div>
        <button type="submit" className='btn btn-sm btn-outline-primary mt-3'>Save New Contract</button>
    </form>
    </>
  )
}

export default withAuth(AddContractPage)