'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import Contract from '@/app/components/Contract'
import { withAuth } from '@/app/components/withAuth'
import { ContractI } from '@/app/interfaces/ContractI'


function ContractsPage() {  
  const [contracts, setContracts] = useState(null)
  const { data: session } = useSession()
 
  useEffect(() => {
    async function fetchContracts() {
      let res = await fetch('/api/contracts', { 
        headers: { 'user-id': session?.user?.id || '' } 
      })
      let data = await res.json()
      setContracts(data)
    }
    fetchContracts()
  }, [])

  if (!contracts) return <div>Loading...</div>

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Contracts</h1>
          <div className="btn-toolbar mb-2 mb-md-0">
          <Link href="/dashboard/contracts/add">
            <button className="btn btn-sm btn-outline-success">Add New Contract</button>
          </Link>
        </div>
      </div>

      <div className="list-group list-group-flush">
        {(contracts as ContractI[]).map((contract: ContractI) => (
        <div key={contract._id?.toString()} className="list-group-item">
            <Link href={`/dashboard/contracts/${contract._id?.toString()}`}>
              <Contract contract={contract} />
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}

export default withAuth(ContractsPage)