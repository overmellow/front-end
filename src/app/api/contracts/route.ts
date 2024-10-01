import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Contract from '@/app/schemas/Contract'
import User from '@/app/schemas/User'

export async function POST(request: NextRequest) {
	await dbConnect()

	const { title, content, userEmail, partyEmails } = await request.json()

	// Find the owner user by email
	const owner = await User.findOne({ email: userEmail })
	if (!owner) {
		return NextResponse.json({ error: 'Owner not found' }, { status: 404 })
	}
	console.log('partyEmails:', partyEmails)
	// Find party users by email
	const parties = await User.find({ email: { $in: partyEmails } })
	console.log('Parties:', parties)
	const contract = new Contract({
		title,
		content,
		owner: owner._id,
		parties: parties.map(party => party._id)
	})

	await contract.save()

	return NextResponse.json(contract, { status: 201 })
}

export async function GET(request: NextRequest) {
	return handleGetRequest(request).catch((error) => {
		console.error('Unhandled error in POST /api/contracts:', error)
		return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
	})
}

async function handleGetRequest(request: NextRequest) {
	await dbConnect();
	const userId = request.headers.get('user-id') || request.nextUrl.searchParams.get('userId');
	const contracts = await Contract.find({ $or: [{ owner: userId }, { parties: userId }] });
	return NextResponse.json(contracts, { status: 200 })
}

async function handlePostRequest(request: NextRequest) {
	console.log('Received POST request to /api/contracts')
	
	const body = await request.json()

	const { title, content, userId, parties } = body
	if (!title || !content || !userId) {
		console.log('Missing required fields')
		return NextResponse.json({ error: 'Title, content, and userId are required' }, { status: 400 })
	}

	console.log('Attempting to create contract with Mongoose')
	const newContract = await Contract.create({
		title: title,
		content: content,
		owner: userId,
		parties: parties, // Add this line
	})

	console.log('Contract created successfully:', newContract)
	return NextResponse.json(newContract, { status: 201 })
}
