'use client'

import Link from 'next/link'
import Navigation from '@/app/components/Navigation'
import { useEffect, useState } from 'react'
import { withAuth } from '@/app/components/withAuth'
import { useParams, useRouter } from 'next/navigation'

function ContractsPage() {  
  const [contract, setContract] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const params = useParams()
  const router = useRouter()
 
  useEffect(() => {
    async function fetchContracts() {
      let res = await fetch(`/api/contracts/${params.id}`)
      let data = await res.json()
      setContract(data)
    }
    fetchContracts()
  }, [])

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/contracts/${params.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/contracts')
      } else {
        console.error('Failed to delete contract')
      }
    } catch (error) {
      console.error('Error deleting contract:', error)
    }
  }

  if (!contract) return <div>Loading...</div>

  return (
    <div className="container mt-5">
      <Navigation />
      <div className="panel panel-default">
        <h3>Contract Details</h3>
        <div className='d-flex justify-content-between'>          
          <Link href="/contracts">
          <button className="btn btn-outline-secondary mb-3 btn-sm">Back</button>
          </Link>
          <Link href={`/contracts/${contract._id}/edit`}>
            <button className="btn btn-outline-primary mb-3 btn-sm">Edit</button>
          </Link>
          <button className="btn btn-danger mb-3 btn-sm" onClick={() => setShowDeleteModal(true)}>Delete</button>
        </div>
        {contract && (
        <div className="panel panel-default">
          <p>id: {contract._id}</p>
          <p>title: {contract.title}</p>
          <p>content: {contract.content}</p>
          <p>owner: {contract.owner.name}</p>
          {(contract as Contract).parties.map((p: any) => 
            <p key={p._id}>parties: {p.email}</p>
          )}        
        </div>
        )}

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
      </div>
    </div>
  )
}

export default withAuth(ContractsPage)