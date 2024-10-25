'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { withAuth } from '@/app/components/withAuth'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid';
import ContractStatusEnum from '@/app/schemas/ContractStatusEnum'
import { IClause } from '@/app/schemas/Clause'
import { createContract } from '@/app/services/contracts'

import '../style.css';

function AddContractPage() {
  const [title, setTitle] = useState('')
  const [parties, setParties] = useState([''])
  const [clauses, setClauses] = useState<Array<IClause>>([{ _id: uuidv4(), content: '' }])
  const router = useRouter()
  const { data: session } = useSession()
  const [contractStatus, setContractStatus] = useState<ContractStatusEnum>();
  const [content, setContent] = useState<{ [key: string]: string }>({});

  const handleContentChange = (key: string, value: string) => {
    setContent(prevContent => ({
      ...prevContent,
      [key]: value
    }));
  };

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

  const addClause = async () => {
    setClauses([...clauses, { _id: uuidv4(), content: '' }])
  }

  const removeClause = (_id: string) => {
    setClauses(clauses.filter(clause => clause._id !== _id))
  }

  const handleClauseChange = (_id: string, value: string) => {
    setClauses(clauses.map(clause => 
      clause._id === _id ? { ...clause, content: value } : clause
    ))
  }

  // const addTextPlaceholder = (clause: IClause) => {
  //   const box = ` <div class='box' contenteditable='false'>${idWithoutBrackets}</div> `;           
  //   // event.currentTarget.innerHTML = clause + box;
  //   setClauses(clauses.map(c => 
  //     c._id === clause._id ? { ...clause, content: c.content + ` <div className='box'>hey</div> ` } : clause
  //   ))
  // }
  
  // const handleInput = (e: React.ChangeEvent<HTMLDivElement>) => {
  //   const text = e.target.innerHTML;
  //   const updatedContent = text.replace(/\[\[(\w+)\]\]/g, `<box>$1</box>`);
  //   handleContentChange(e.target.id, updatedContent);
  // };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>, clauseId: string) => {
    const text = e.target.value;
    const updatedContent = text.replace(/\[\[(\w+)\]\]/g, `<box>$1</box>`);
    handleContentChange(clauseId, updatedContent);
  };

  const renderContent = (content: string) => {
    if (!content) return null
    // Create a regex to find <box> elements and render them as divs
    const parts = content.split(/(<box>.*?<\/box>)/g);
    return parts.map((part, index) => {
      if (part.startsWith("<box>") && part.endsWith("</box>")) {
        const id = part.slice(5, -6); // Extract the ID
        return (
          <span key={index} className="box" onClick={() => console.log(id)}>
            <div className="box-style">{id}</div>
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 className="h3">New Contract</h1>
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
                className="form-control shadow-none border-0 rounded-0"
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
            {clauses.map((clause, index) => (
              <div key={clause._id as React.Key || uuidv4()} 
              className='clause-content-wrapper mb-3'>
                {/* <div contentEditable={true} 
                  id="editableContent"
                  className='clause-content bg-light position-relative'
                  suppressContentEditableWarning={true}                  
                  onFocus={(e) => e.currentTarget.nextElementSibling?.classList.remove('d-none')}
                  onBlur={(e) => {
                    console.log(e.currentTarget.innerHTML) */}
                {/*  handleClauseChange(clause._id?.toString() ?? '', e.currentTarget.innerHTML || '');
                    // handleClauseChange(clause._id?.toString() ?? '', e.currentTarget.textContent || '');
                //     if (e.relatedTarget !== e.currentTarget.nextElementSibling) {
                //       e.currentTarget.nextElementSibling?.classList.add('d-none');
                //     }
                //     if (e.currentTarget.innerHTML === '') {
                //       removeClause(clause._id?.toString() ?? '')
                //     }
                //   }}
                //   ref={index === clauses.length - 1 ? inputRef : undefined}
                //   onInput={handleInput}
                //   >
                // </div> */}
                    <textarea
                      id="editableContent"
                      className='clause-content bg-light position-relative'
                      // value={textareaContent}
                      onChange={(e) => handleTextareaInput(e, clause._id?.toString() ?? '')}
                      onFocus={(e) => e.currentTarget.nextElementSibling?.classList.remove('d-none')}
                      onBlur={(e) => {
                        // handleClauseChange(clause._id?.toString() ?? '', e.currentTarget.innerHTML || '');
                        // handleClauseChange(clause._id?.toString() ?? '', e.currentTarget.textContent || '');
                        handleClauseChange(clause._id?.toString() ?? '', e.target.value || '');
                        // if (e.relatedTarget !== e.currentTarget.nextElementSibling) {
                        //   console.log('relatedTarget', e.relatedTarget)
                        //   e.currentTarget.nextElementSibling?.classList.add('d-none');
                        // }
                        e.currentTarget.nextElementSibling?.classList.add('d-none');
                        if (e.target.value === '') {
                          removeClause(clause._id?.toString() ?? '')
                        }
                      }}
                    />
                  <button type="button" className="btn btn-sm custom-icon border-0 d-none" 
                  onClick={() => removeClause(clause._id?.toString() ?? '')}>
                  <i className="bi bi-x-circle"></i></button>

                  {/* <button type="button" className="add-text-placeholder-link btn btn-sm opacity-50 border-0"                   
                  onClick={() => addTextPlaceholder(clause)}>
                  <i>+ add text placeholder</i></button>  */}

                <div className="transformed-text">
                  {renderContent(content[clause._id?.toString() ?? ''])}  
                </div>

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
                    className="form-control shadow-none rounded-0"
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