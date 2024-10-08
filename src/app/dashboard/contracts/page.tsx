'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { fetchContracts } from '@/app/services/contracts'
import { withAuth } from '@/app/components/withAuth'
import { IContract } from '@/app/schemas/Contract'
import ContractStatusEnum from '@/app/schemas/ContractStatusEnum'

function ContractsPage() {  
  const [contracts, setContracts] = useState<IContract[] | null>(null)
  const [filteredContracts, setFilteredContracts] = useState<IContract[] | null>(null)
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

  const filterStatus = (status?: string) => {
    if (!status) {
      setFilteredContracts(contracts)
    } else {
      const filteredContracts = (contracts as IContract[]).filter((contract: IContract) => contract.status === status)
      setFilteredContracts(filteredContracts)
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Contracts</h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <div className="ms-3 me-2">
              <select className="form-select form-select-sm mb-3 shadow-none" aria-label="Default select example" onChange={(e) => filterStatus(e.target.value)}>
                <option value="">All</option>
                <option value={ContractStatusEnum.DRAFT}>Drafts</option>
                <option value={ContractStatusEnum.ASSIGNED}>Assigned</option>
                <option value={ContractStatusEnum.SIGNED}>Signed</option>
                <option value={ContractStatusEnum.COMPLETED}>Completed</option>
              </select>
            </div>
            <Link href="/dashboard/contracts/add">
              <button className="btn btn-sm btn-light">Add New Contract</button>
            </Link>
        </div>
      </div>
    <table className="table table-sm">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Title</th>
          <th scope="col">Status</th>
          <th scope="col">Created At</th>
        </tr>
      </thead>
      <tbody>
      {(filteredContracts || contracts).map((contract: IContract) => (
          <tr key={contract._id?.toString()}>
            <th scope="row">{contract._id?.toString()}</th>
            <td><Link href={`/dashboard/contracts/${contract._id?.toString()}/edit`}>{contract.title}</Link></td>
            <td>{contract.status}</td>
            <td>{new Date(contract.createdAt).toLocaleString()}</td>  
          </tr>
          ))}
        </tbody>
    </table>
  </>
  )
}

export default withAuth(ContractsPage)