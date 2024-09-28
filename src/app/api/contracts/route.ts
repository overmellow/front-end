import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  return handlePostRequest(request).catch((error) => {
    console.error('Unhandled error in POST /api/contracts:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  })
}

export async function GET(request: NextRequest) {
    return handleGetRequest(request).catch((error) => {
      console.error('Unhandled error in POST /api/contracts:', error)
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
    })
  }

async function handleGetRequest(request: NextRequest) {
    const contracts = await prisma.contract.findMany({
    })
    return NextResponse.json(contracts, { status: 200 })
}  

async function handlePostRequest(request: NextRequest) {
  console.log('Received POST request to /api/contracts')
  
  const body = await request.json()
  console.log('Request body:', body)

  const { title, content } = body
  console.log('Title:', title)
  console.log('Content:', content)
  if (!title || !content) {
    console.log('Missing title or status')
    return NextResponse.json({ error: 'Title and status are required' }, { status: 400 })
  }

  console.log('Attempting to create contract with Prisma')
  const newContract = await prisma.contract.create({
    data: {
        title: title,
        content: content,
    },
  })

  console.log('Contract created successfully:', newContract)
  return NextResponse.json(newContract, { status: 201 })
}
