'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { withAuth } from '@/app/components/withAuth'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid';
import ContractStatusEnum from '@/app/schemas/ContractStatusEnum'
import { ClauseI } from '@/app/interfaces/ClauseI'
import useAutoFocus from '@/app/components/useAutoFocus'

function AddContractPage() {
  const [title, setTitle] = useState('')
  const [parties, setParties] = useState([''])
  const [clauses, setClauses] = useState<Array<ClauseI>>([{ _id: uuidv4(), content: '' }])
  const router = useRouter()
  const { data: session } = useSession()
  const [contractStatus, setContractStatus] = useState<ContractStatusEnum>();

  const inputRef = useAutoFocus();

  useEffect(() => {
    setContractStatus(ContractStatusEnum.DRAFT)
    setParties([session?.user?.email || ''])
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: title,
          clauses: clauses,
          status: ContractStatusEnum.DRAFT,
          userEmail: await session?.user?.email,
          partyEmails: parties.filter(party => party.trim() !== '')
        }),
      })

      if (response.ok) {
        router.push('/dashboard/contracts')
        // router.refresh()
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

  const removeParty = (index: number, party: string) => {
    if (party === session?.user?.email) return
    const newParties = parties.filter((_, i) => i !== index)
    setParties(newParties)
  }

  const addClause = () => {
    setClauses([...clauses, { _id: uuidv4(), content: '' }])
    console.log(clauses)
  }

  const removeClause = (_id: string) => {
    setClauses(clauses.filter(clause => clause._id !== _id))
  }

  const handleClauseChange = (_id: string, value: string) => {
    setClauses(clauses.map(clause => 
      clause._id === _id ? { ...clause, content: value } : clause
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
      <h1 className="h2">New Contract</h1>
      <div className="btn-toolbar mb-2 mb-md-0">
        <Link href={`/dashboard/contracts`} className='me-2'>
          <button className="btn btn-outline-secondary mb-3 btn-sm">Cancel</button>
        </Link>
      </div>
    </div>

    <form onSubmit={handleSubmit}>
      <div className='input-group mb-3'>
        <span className="input-group-text" id="basic-addon1">Title</span>
        <label htmlFor="title" className='form-label'></label>
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
        <div className="input-group mb-2">
          <span className="input-group-text" id="basic-addon1">Status</span>
          <input
            className="form-control"
            type="text"
            value={contractStatus}
            readOnly disabled
          />
        </div>
      </div>  

      <div className="card">
        <div className='card-header'>
          <div className="d-flex justify-content-between align-items-center">
            <div>Clauses</div>
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={addClause}>+</button>
          </div>
        </div>
        <div className="card-body">
          {clauses.map((clause, index) => (
            <div key={clause._id as React.Key || uuidv4()} className='clause-content-wrapper mb-3'
            onKeyDown={keyDown}>
              <div contentEditable={true} className='clause-content bg-light position-relative'
                onFocus={(e) => e.currentTarget.nextElementSibling?.classList.remove('d-none')}
                onBlur={(e) => {
                  handleClauseChange(clause._id?.toString() ?? '', e.currentTarget.textContent || '');
                  if (e.relatedTarget !== e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling?.classList.add('d-none');
                  }
                }}
                ref={index === clauses.length - 1 ? inputRef : undefined}
                // dangerouslySetInnerHTML={{ __html: clause.content }}
                >{clause.content || ''}</div>
                <button type="button" className="btn btn-danger rounded-pill btn-sm round-button shadow-lg d-none" 
                onClick={() => removeClause(clause._id?.toString() ?? '')}>X</button>
            </div> 
            ))} 
        </div>
      </div>

      <div className='form-group mt-3'>
        {parties.map((party, index) => (
          <div key={index} className="input-group mb-2">
            <span className="input-group-text" id="basic-addon1">Party</span>
            <input
              className="form-control"
              type="email"
              value={party}
              onChange={(e) => handlePartyChange(index, e.target.value)}
              placeholder="Enter party email"
            />
            <button type="button" className="btn btn-outline-secondary" onClick={() => removeParty(index, party)}>
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