'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { withAuth } from '@/app/components/withAuth'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid';
import ContractStatusEnum from '@/app/schemas/ContractStatusEnum'
import { IClause } from '@/app/schemas/Clause'
import useAutoFocus from '@/app/components/useAutoFocus'
import { createContract } from '@/app/services/contracts'

function AddContractPage() {
  const [title, setTitle] = useState('')
  const [parties, setParties] = useState([''])
  const [clauses, setClauses] = useState<Array<IClause>>([{ _id: uuidv4(), content: '' }])
  const router = useRouter()
  const { data: session } = useSession()
  const [contractStatus, setContractStatus] = useState<ContractStatusEnum>();
  const [reg, setReg] = useState<string>('')
  const [currentClauseContent, setCurrentClauseContent] = useState<string>('')

  const inputRef = useAutoFocus();

  useEffect(() => {
    setContractStatus(ContractStatusEnum.DRAFT)
    setParties([session?.user?.email || ''])
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createContract({
        title: title,
        clauses: clauses,
        status: ContractStatusEnum.DRAFT,
        userEmail: await session?.user?.email,
        partyEmails: parties.filter(party => party.trim() !== '')
      });
      router.push('/dashboard/contracts')
      // router.refresh()
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

  const keyDown = async (event: React.KeyboardEvent<HTMLDivElement | HTMLTextAreaElement>, clause: string) => {
    
    const regex = /\[\[.*?\]\]/;

    if (event.currentTarget) {
      const newReg = reg + event.key;
      setReg(newReg);      
      // console.log(event.currentTarget.textContent);
      setCurrentClauseContent(event.currentTarget.textContent || '');
      // console.log('Current clause content: ', currentClauseContent);

      if (event.key === ' ' && reg[reg.length - 1] !== ']') 
      {
        setReg('');
      } 
      else if (event.key === 'Backspace') 
      {
        setReg(reg.slice(0, -1));
      }
      else 
      {
        let newReg = reg + event.key;
        // setReg(newReg);

        // Check if the pattern is found in the text
        if (regex.test(newReg)) {
          const idWithoutBrackets = newReg.slice(2, -2);
          const box = ` <div class='box' contenteditable='false'>${idWithoutBrackets}</div> `;           
          event.currentTarget.innerHTML = clause + box;
          // event.currentTarget.focus();
          setReg('');
        // Move the cursor to the end of the text after inserting the box
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(event.currentTarget);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
        event.currentTarget.focus();
        }
      }

      if (event.shiftKey && event.key === 'Enter') {
        event.preventDefault();
        addClause();
      }
    }
  };

  return (
    <>
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 className="h2">New Contract</h1>
      <div className="btn-toolbar mb-2 mb-md-0">
        <Link href={`/dashboard/contracts`} className='me-2'>
          <button className="btn btn-light mb-3 btn-sm">Cancel</button>
        </Link>
      </div>
    </div>

    <form onSubmit={handleSubmit}>
    <div className='row'>
      <div className='col-md-9'>
        <div className="card rounded-0">
          <div className='card-header'>
            <div className='input-group'>
               <input
                className="form-control shadow-none border-0"
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter contract title'
                required
              />
            </div>
          </div>
          <div className="card-body">
            <div className='form-group'>
              {currentClauseContent}
            </div>
            {clauses.map((clause, index) => (
              <div key={clause._id as React.Key || uuidv4()} className='clause-content-wrapper mb-3'>
                <div contentEditable={true} className='clause-content bg-light position-relative'
                  suppressContentEditableWarning={true}
                  onFocus={(e) => e.currentTarget.nextElementSibling?.classList.remove('d-none')}
                  onBlur={(e) => {
                    handleClauseChange(clause._id?.toString() ?? '', e.currentTarget.textContent || '');
                    if (e.relatedTarget !== e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling?.classList.add('d-none');
                    }
                  }}
                  ref={index === clauses.length - 1 ? inputRef : undefined}
                  onKeyDown={(e) => keyDown(e, clause.content)}
                  // dangerouslySetInnerHTML={{ __html: clause.content }}
                  >
                  {clause.content || ''}                
                  </div>
                  <button type="button" className="btn btn-sm shadow-lg d-none" 
                  onClick={() => removeClause(clause._id?.toString() ?? '')}><i className="bi bi-x-circle custom-icon"></i></button>
                  
              </div> 
              ))}
              
              <a href="#" style={{fontSize: '0.8rem'}} 
                className="link-offset-2 link-underline link-underline-opacity-0 link-opacity-75 link-opacity-100-hover link-secondary" onClick={addClause}>
                <i>+ add clause</i></a> 
          </div>
        </div>
        <button type="submit" className='btn btn-sm btn-light mt-3'>Save New Contract</button>
      </div>
      <div className='col-md-3'>
        <div className='card rounded-0'>
          <div className='card-body'>
            <div className='row'>              
              <span className="badge text-bg-secondary col-md-11 mx-3 mb-2 rounded-0">{session?.user?.email}</span>
              <span className="badge text-bg-info col-md-4 mx-3 mb-2 rounded-0">{contractStatus}</span> 
            </div>
            <hr />
            <div className='row'>
              <div className='form-group'>
                {parties.map((party, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    className="form-control rounded-0"
                        type="email"
                        value={party}
                        onChange={(e) => handlePartyChange(index, e.target.value)}
                        placeholder="Enter party email"
                  />
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => removeParty(index, party)}>X</button>
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
    </form>
    </>
  )
}

export default withAuth(AddContractPage)