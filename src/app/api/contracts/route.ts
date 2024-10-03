import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Contract from '@/app/schemas/Contract'
import User from '@/app/schemas/User'
import Clause from '@/app/schemas/Clause'
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
	await dbConnect();
	const userId = request.headers.get('user-id') || request.nextUrl.searchParams.get('userId');
	const contracts = await Contract.find({ $or: [{ owner: userId }, { parties: userId }] });
	return NextResponse.json(contracts, { status: 200 })
}

async function handlePostRequest(request: NextRequest) {
	
	await dbConnect()

	const { title, clauses, userEmail, partyEmails } = await request.json()

	const newClauses = await Promise.all(clauses.map(async (clause: any) => {
		const newClause = new Clause(clause);
		await newClause.save();
		return newClause;
	}));
	// Find the owner user by email
	const owner = await User.findOne({ email: userEmail })
	if (!owner) {
		return NextResponse.json({ error: 'Owner not found' }, { status: 404 })
	}

	// Find party users by email
	const parties = await User.find({ email: { $in: partyEmails } })

	const contract = new Contract({
		title: title,
		clauses: newClauses,
		owner: owner._id,
		parties: parties.map(party => party._id)
	})

	await contract.save()
	// const contract = {}
	return NextResponse.json({ status: 201 })
}
