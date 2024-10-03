'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { withAuth } from '@/app/components/withAuth'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid';
import Clause from '@/app/schemas/Clause'
import { ClauseI } from '@/app/interfaces/ClauseI'
import { PartyI } from '@/app/interfaces/PartyI'
import { UserI } from '@/app/interfaces/UserI'

function EditContractPage() {
  const [title, setTitle] = useState('')
  const [owner, setOwner] = useState<UserI | null>(null)
  const [parties, setParties] = useState<PartyI[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [clauses, setClauses] = useState<Array<ClauseI>>([])
  const router = useRouter()
  const { data: session } = useSession()
  const params = useParams()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    async function fetchContracts() {
      setIsLoading(true)
      try {
        let res = await fetch(`/api/contracts/${params.id}`)
        let data = await res.json()
        setTitle(data.title)
        setOwner(data.owner)
        setParties(data.parties.length > 0 ? data.parties : ['']) // Ensure there's always at least one empty string
        setClauses(data.clauses || []) // Add this line
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

    
    try {
      const response = await fetch(`/api/contracts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: title,
          partyEmails: parties.map((party: { email: string }) => party.email.trim()).filter((email: string) => email !== ''),
          clauses: clauses,
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
    newParties[index] = {name: '', email: value}
    setParties(newParties)
  }

  const addParty = () => {
    let newParty = {name: '', email: ''}
    setParties([...parties, newParty])
  }

  const removeParty = (index: number) => {
    // if (party === session?.user?.email) return
    const newParties = parties.filter((_, i) => i !== index)
    setParties(newParties)
  }

  const addClause = () => {
    setClauses([...clauses, { _id: uuidv4(), content: '' }])
  }

  const removeClause = (id: string) => {
    setClauses(clauses.filter(clause => clause._id !== id))
  }

  const handleClauseChange = (id: string, field: 'content', value: string) => {
    setClauses(clauses.map(clause => 
      clause._id === id ? { ...clause, [field]: value } : clause
    ))
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
      <div className='input-group mt-3'>
      <span className="input-group-text" id="basic-addon1">Title</span>
        <input
          className="form-control"
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

    <div className="card mt-3">
        <div className="card-header">Clauses</div>
        <ul className="list-group list-group-flush">
          {clauses.map((clause: ClauseI) => (
            <li className="list-group-item" key={clause._id as React.Key}>
              <div className='row'>
                <div className='col-11'>
                  <textarea 
                    className="form-control" 
                    value={clause.content} 
                    onChange={(e) => handleClauseChange(clause._id?.toString() ?? '', 'content', e.target.value)} 
                    placeholder="Clause" 
                    rows={3}
                  />
                </div>
                <div className='col-1 d-flex align-items-center'>
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeClause(clause._id?.toString() ?? '')}>X</button>
                </div>
              </div>
            </li>
        ))}
        </ul>
        <div className="card-footer d-flex justify-content-end">
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={addClause}>Add Clause</button>
        </div>
      </div>

      <div className='form-group mt-3'>
      <div className="input-group mb-2">
      <span className="input-group-text" id="basic-addon1">Owner</span>
      <input
                className="form-control"
                type="text"
                value={owner?.email || ''}
                readOnly disabled
              />
        </div>
      </div>

        <div className='form-group mt-3'>
          {parties.map((party: { email: string }, index: number) => (
            <div key={index} className="input-group mb-2">
              <span className="input-group-text" id="basic-addon1">Party</span>
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