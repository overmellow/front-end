'use client'

import Link from 'next/link'
import Navigation from '../components/Navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import Contract from '../components/Contract'
import { Contract as ContractType } from '../schemas/Contract'
import { withAuth } from '../components/withAuth'


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
    <div className="container mt-5">
      <Navigation />
      <h1>Contracts</h1>
      <Link href="/contracts/add">
        <button className="btn btn-primary mb-3">Add New Contract</button>
      </Link>
      <div className="list-group">
        {(contracts as ContractType[]).map((contract: ContractType) => (
        <div key={contract._id} className="list-group-item">
            <Link href={`/contracts/${contract._id}`}>
              <Contract contract={contract} />
            </Link>
          </div>
        ))}
        </div>
    </div>
  )
}

export default withAuth(ContractsPage)