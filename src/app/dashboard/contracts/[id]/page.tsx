'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { withAuth } from '@/app/components/withAuth'
import { useParams } from 'next/navigation'
import { IContract } from '@/app/schemas/Contract'    
import { fetchContract } from '@/app/services/contracts'

function ContractsPage() {  
  const [contract, setContract] = useState<IContract | null>(null)
  const params = useParams()
 
  useEffect(() => {
    async function getContract() {
      try {
        const data = await fetchContract(params.id as string | null);
        setContract(data)
      } catch (error) {
        console.error('Error fetching contract:', error)
      }
    }
    getContract()
  }, [params.id])

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
        {contract  && (
        <div className="panel panel-default">
          <p>id: {contract._id?.toString()}</p>
          <p>title: {contract.title}</p>
          <p>status: {contract.status}</p>
          <div>Clauses</div>
          <ol>
          {contract.clauses?.map((c: any) => 
            <li key={c._id}>{c.content}</li>
          )}
          </ol>
          <hr />
          <p>owner: {(contract.owner as any).name ?? contract.owner}</p>    
          {contract.parties.map((p: any) => 
            <p key={p._id}>parties: {p.email}</p>
          )}        
        </div>
        )}
    </>
  )
}

export default withAuth(ContractsPage)