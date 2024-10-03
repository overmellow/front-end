'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { withAuth } from '@/app/components/withAuth'
import { useParams } from 'next/navigation'

function ContractsPage() {  
  const [contract, setContract] = useState(null)
  const params = useParams()
 
  useEffect(() => {
    async function fetchContracts() {
      let res = await fetch(`/api/contracts/${params.id}`)
      let data = await res.json()
      setContract(data)
    }
    fetchContracts()
  }, [])

  if (!contract) return <div>Loading...</div>

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Contract Details</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Link href={`/dashboard/contracts/${contract._id}/edit`} className='me-2'>
            <button className="btn btn-outline-primary mb-3 btn-sm">Edit</button>
          </Link>
        </div>
      </div>
        {contract && (
        <div className="panel panel-default">
          <p>id: {contract._id}</p>
          <p>title: {contract.title}</p>
         
          {(contract as Contract).clauses?.map((c: any) => 
            <p key={c._id}>clauses: {c.content}</p>
          )}
          <hr />
          <p>owner: {contract.owner.name}</p>
          {(contract as Contract).parties.map((p: any) => 
            <p key={p._id}>parties: {p.email}</p>
          )}        
        </div>
        )}
    </>
  )
}

export default withAuth(ContractsPage)