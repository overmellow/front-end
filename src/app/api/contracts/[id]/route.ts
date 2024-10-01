import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect';
import Contract from '@/app/schemas/Contract';
import User from '@/app/schemas/User'

export async function GET(request: NextRequest,{ params }: { params: { id: string } }) {
  return handleGetRequest(request, params).catch((error) => {
    console.error('Unhandled error in GET /api/contracts/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  })
}

async function handleGetRequest(request: NextRequest, params: { id: string }) {
  const { id } = params
  await dbConnect();
  const contract = await Contract.findById(id)
    .populate('owner') // Add this line to populate owner's name and email
    .populate('parties');
  console.log('Found contract:', contract)
  if (!contract) {
    return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
  }
  
  return NextResponse.json(contract, { status: 200 })
}

export async function DELETE(request: NextRequest,{ params }: { params: { id: string } }) {
  return handleDeleteRequest(request, params).catch((error) => {
    console.error('Unhandled error in GET /api/contracts/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  })
}

async function handleDeleteRequest(request: NextRequest, params: { id: string }) {
  const { id } = params
  await dbConnect();
  const contract = await Contract.findByIdAndDelete(id);

  if (!contract) {
    return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
  }
  
  return NextResponse.json(contract,{ status: 200 })
}

export async function PUT(request: NextRequest,{ params }: { params: { id: string } }) {
  return handlePutRequest(request, params).catch((error) => {
    console.error('Unhandled error in GET /api/contracts/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  })
}

async function handlePutRequest(request: NextRequest, params: { id: string }) {
  const { id } = params
  await dbConnect();

  const body = await request.json()

  const { title, content, userId, partyEmails } = body
  console.log('partyEmails:', partyEmails)
  if (!title || !content || !userId) {
    console.log('Missing required fields')
    return NextResponse.json({ error: 'Title, content, and userId are required' }, { status: 400 })
  }

  const parties = await User.find({ email: { $in: partyEmails } })
	console.log('Parties:', parties)
  const contract = await Contract.findByIdAndUpdate(id, {
    title: title,
    content: content,
		parties: parties.map(party => party._id)
  });

  if (!contract) {
    return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
  }
  
  return NextResponse.json(contract,{ status: 200 })
}