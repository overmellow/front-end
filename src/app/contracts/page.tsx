'use client'

import Link from 'next/link'
import Navigation from '../components/Navigation'
import { useEffect, useState } from 'react'

import Contract from '../types/Contract'
import { Contract as ModelContract } from '../models/Contract'
import { withAuth } from '../components/withAuth'

function ContractsPage() {  
  const [contracts, setContracts] = useState(null)
 
  useEffect(() => {
    async function fetchContracts() {
      let res = await fetch('/api/contracts')
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
        {contracts.map((contract: ModelContract) => (
        <div key={contract.id} className="list-group-item">
          <Contract contract={contract} />
        </div>
        ))}
      </div>
    </div>
  )
}

export default withAuth(ContractsPage)