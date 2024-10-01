'use client'

import Link from 'next/link'
import Navigation from '@/app/components/Navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import Contract from '@/app/components/Contract'
import { Contract as ContractType } from '@/app/schemas/Contract'
import { withAuth } from '@/app/components/withAuth'


function ContractsPage() {  
  const [contracts, setContracts] = useState(null)
  const { data: session, status } = useSession()
 
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
        {(contracts as ContractType[]).map((contract: ContractType) => (
        <div key={contract._id} className="list-group-item">
            <Link href={`/dashboard/contracts/${contract._id}`}>
              <Contract contract={contract} />
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}

export default withAuth(ContractsPage)