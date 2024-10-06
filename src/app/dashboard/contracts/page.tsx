'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { fetchContracts } from '@/app/services/contracts'
import { withAuth } from '@/app/components/withAuth'
import { IContract } from '@/app/schemas/Contract'

function ContractsPage() {  
  const [contracts, setContracts] = useState(null)
  const { data: session } = useSession()
 
  useEffect(() => {
    async function getContracts() {
      try {
        const data = await fetchContracts(session?.user?.id || null);
        setContracts(data)
      } catch (error) {
        console.error('Error fetching contracts:', error)
      }
    }
    getContracts()
  }, [session?.user?.id])

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

      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Status</th>
            <th scope="col">Created At</th>
          </tr>
        </thead>
        <tbody>
        {(contracts as IContract[]).map((contract: IContract) => (
            <tr key={contract._id?.toString()}>
              <th scope="row">{contract._id?.toString()}</th>
              <td><Link href={`/dashboard/contracts/${contract._id?.toString()}/edit`}>{contract.title}</Link></td>
              <td>{contract.status}</td>
              <td>{contract.createdAt?.toString()}</td>  
            </tr>
            ))}
          </tbody>
      </table>
    </>
  )
}

export default withAuth(ContractsPage)