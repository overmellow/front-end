'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { withAuth } from '@/app/components/withAuth'
import Link from 'next/link'

function EditContractPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [parties, setParties] = useState([]) // Initialize with an empty string
  const [isLoading, setIsLoading] = useState(true) // Add this line
  const router = useRouter()
  const { data: session, status } = useSession()
  const params = useParams()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    async function fetchContracts() {
      setIsLoading(true) // Add this line
      try {
        let res = await fetch(`/api/contracts/${params.id}`)
        let data = await res.json()
        setTitle(data.title)
        setContent(data.content)
        setParties(data.parties.length > 0 ? data.parties : ['']) // Ensure there's always at least one empty string
      } catch (error) {
        console.error('Error fetching contract:', error)
      } finally {
        setIsLoading(false) // Add this line
      }
    }
    fetchContracts()
  }, [params.id]) // Add params.id as a dependency

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/contracts/${params.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/dashboard/contracts')
      } else {
        console.error('Failed to delete contract')
      }
    } catch (error) {
      console.error('Error deleting contract:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let my = parties.filter(party => party.email.trim() !== '')
    // Extract only the email addresses from the parties array
    const partyEmails = parties.map(party => party.email.trim()).filter(email => email !== '')
    console.log('my:', partyEmails)
    try {
      const response = await fetch(`/api/contracts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title, 
          content, 
          userId: session?.user?.id || '',
          partyEmails: parties.map(party => party.email.trim()).filter(email => email !== '')
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
    console.log('New Parties:', newParties)
    newParties[index] = {email: value}
    console.log('New Parties:', newParties)
    setParties(newParties)
    console.log('Parties:', parties)
  }

  const addParty = () => {
    let newParty = {email: ''}
    setParties([...parties, newParty])
  }

  const removeParty = (index: number) => {
    const newParties = parties.filter((_, i) => i !== index)
    setParties(newParties)
  }

  return (
    <>
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 className="h2">Contract Edit</h1>
    <div className="btn-toolbar mb-2 mb-md-0">
    <Link href={`/dashboard/contracts/${params.id}`} className='me-2'>
        <button className="btn btn-outline-secondary mb-3 btn-sm">Cancel</button>
      </Link>
      <Link href="#" className='me-2'>
        <button className="btn btn-outline-danger btn-sm" onClick={() => setShowDeleteModal(true)}>Delete</button>
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
            id="content"            value={content}
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
                type="text"
                value={party.email}
                onChange={(e) => handlePartyChange(index, e.target.value)}
                placeholder="Enter party email"
              />
              <button type="button" className="btn btn-outline-secondary" onClick={() => removeParty(index)}>
                Remove
              </button>
            </div>
          ))}
          <div className='d-flex justify-content-end'>
            <Link href="#">
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={addParty}>Add Party</button>
            </Link>            
          </div>
          <button type="submit" className='btn btn-sm btn-outline-primary mt-3'>Save Edited Contract</button>
        </div>
        
      </form>

      {showDeleteModal && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button type="button" className="close" onClick={() => setShowDeleteModal(false)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this contract?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  )
}

export default withAuth(EditContractPage)