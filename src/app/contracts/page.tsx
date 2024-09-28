import Link from 'next/link'
import { PrismaClient, Contract } from '@prisma/client'

async function getContracts() {
  const prisma = new PrismaClient()
  try {
    const contracts = await prisma.contract.findMany({
      // You can add sorting or filtering here if needed
      // orderBy: { createdAt: 'desc' },
    })
    return contracts
  } catch (error) {
    console.error('Error fetching contracts:', error)
    return []
  } finally {
    await prisma.$disconnect()
  }
}

export default async function ContractsPage() {
  const contracts = await getContracts()

  return (
    <div>
      <h1>Contracts</h1>
      <Link href="/contracts/add">
        <button>Add New Contract</button>
      </Link>
      {contracts.length === 0 ? (
        <p>No contracts found.</p>
      ) : (
        <ul>
          {contracts.map((contract) => (
            <li key={contract.id}>
              {/* Adjust these fields based on your Contract model */}
              <h2>{contract.title}</h2>
              <p>ID: {contract.id}</p>
              <p>Content: {contract.content}</p>
              {/* Add more contract details as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
