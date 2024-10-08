'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { withAuth } from '@/app/components/withAuth'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid';

import { IClause } from '@/app/schemas/Clause'
import { IParty } from '@/app/schemas/User'
import { IUser } from '@/app/schemas/User'
import ContractStatusEnum from '@/app/schemas/ContractStatusEnum'
import useAutoFocus from '@/app/components/useAutoFocus'
import { fetchContract, updateContract, deleteContract } from '@/app/services/contracts'
import DeleteModal from '@/app/components/DeleteModal'

function EditContractPage() {
  const [title, setTitle] = useState('')
  const [owner, setOwner] = useState<IUser | null>(null)
  const [parties, setParties] = useState<IParty[]>([]);
  const [clauses, setClauses] = useState<Array<IClause>>([])
  const router = useRouter()
  const [contractStatus, setContractStatus] = useState<ContractStatusEnum>();
  const params = useParams()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const inputRef = useAutoFocus();
  const [createdAt, setCreatedAt] = useState<string | null>(null)

  useEffect(() => {
    async function fetchContracts() {
      try {
        const data = await fetchContract(params.id);
        setTitle(data.title)
        setContractStatus(data.status)
        setOwner(data.owner)
        setParties(data.parties.length > 0 ? data.parties : ['']) // Ensure there's always at least one empty string
        setClauses(data.clauses || []) // Add this line
        setCreatedAt(data.createdAt)
      } catch (error) {
        console.error('Error fetching contract:', error)
      }
    }
    fetchContracts()
  }, [params.id]) // Add params.id as a dependency

  const handleDelete = async () => {
    try {
      await deleteContract(params.id);
      router.push('/dashboard/contracts');
    } catch (error) {
      console.error('Error deleting contract:', error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContract(params.id, {
        title,
        partyEmails: parties.map((party: { email: string }) => party.email.trim()).filter((email: string) => email !== ''),
        clauses,
      });
      router.push('/dashboard/contracts');
      router.refresh();
    } catch (error) {
      console.error('Error updating contract:', error);
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

  const handleClauseChange = (id: string, value: string) => {
    setClauses(clauses.map(clause => 
      clause._id === id ? { ...clause, content: value } : clause
    ))
  }

  const keyDown = (event: React.KeyboardEvent) => {
    if (event.shiftKey && event.key === 'Enter') {
        event.preventDefault();
        addClause();
    }
  };

  return (
    <>
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 className="h2">Contract Edit</h1>
    <div className="btn-toolbar mb-2 mb-md-0">
        <Link href={`/dashboard/contracts/${params.id}`} className='me-2'>
            <button className="btn btn-light mb-3 btn-sm">Cancel</button>
          </Link>
          <Link href="#" className='me-2'>
            <button className="btn btn-outline-danger btn-sm" onClick={() => setShowDeleteModal(true)}>Delete</button>
          </Link>
        </div>
    </div>

    <form onSubmit={handleSubmit}>
    <div className='row'>
      <div className='col-md-9'>
        <div className='card'>
          <div className='card-header'>
            <div className='input-group'>
                <input
                  className="form-control shadow-none title border-0"
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
          </div>
          <div className='card-body'>
            {clauses.map((clause: IClause, index: number) => (            
              <div key={clause._id as React.Key} className='clause-content-wrapper mb-3'>
                <div contentEditable={true} className='clause-content bg-light position-relative'
                onFocus={(e) => e.currentTarget.nextElementSibling?.classList.remove('d-none')}
                onBlur={(e) => {
                  handleClauseChange(clause._id?.toString() ?? '', e.currentTarget.textContent || '');
                  if (e.relatedTarget !== e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling?.classList.add('d-none');
                  }
                }}
                // dangerouslySetInnerHTML={{ __html: clause.content }}
                ref={index === clauses.length - 1 ? inputRef : undefined}
                onKeyDown={keyDown}
                >{clause.content || ''}</div>
                <button type="button" className="btn btn-sm shadow-lg d-none" 
                onClick={() => removeClause(clause._id?.toString() ?? '')}><i className="bi bi-x-circle custom-icon"></i></button>
              </div>
            ))}
                <a href="#" style={{fontSize: '0.8rem'}} 
                className="link-offset-2 link-underline link-underline-opacity-0 link-opacity-75 link-opacity-100-hover link-secondary" onClick={addClause}>
                <i>+ add clause</i></a> 
            </div>
          </div>
          <button type="submit" className='btn btn-sm btn-light mt-3'>Save Edited Contract</button>
        </div>

    <div className='col-md-3'>
    <div className='card'>
      <div className='card-body'>
      <div className='form-group'>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">status</span>
          <input
            className="form-control"
            type="text"
            value={contractStatus}
            readOnly disabled
          />
        </div>
      </div>

        <div className='form-group'>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">owner</span>
            <input
              className="form-control border-0"
              type="text"
              value={owner?.email || ''}
              readOnly disabled
            />
          </div>
        </div>

        <div className='form-group'>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">created at</span>
            <input
              className="form-control border-0"
              type="text"
              value={createdAt || ''}
              readOnly disabled
            />
          </div>
        </div>

        <div className='card'>
          <div className='card-body'>
          <h6 className="card-subtitle mb-2 text-body-secondary mb-3">parties</h6>  
            <div className='form-group'>
              {parties.map((party: { email: string }, index: number) => (
                <div key={index} className="input-group mb-2">
                  <input
                    className="form-control shadow-none"
                    type="text"
                    value={party.email}
                    onChange={(e) => handlePartyChange(index, e.target.value)}
                    placeholder="Enter party email"
                  />
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => removeParty(index)}>
                    X
                  </button>
                </div>
              ))}
              <a href="#" style={{fontSize: '0.8rem'}} 
              className="link-offset-2 link-underline link-underline-opacity-0 link-opacity-75 link-opacity-100-hover link-secondary" 
              onClick={addParty}><i>+ add party</i></a> 
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    
    </form>

    {showDeleteModal && (
      <DeleteModal onClose={() => setShowDeleteModal(false)} onDelete={handleDelete} />
    )}
  </>
  )
}

export default withAuth(EditContractPage)