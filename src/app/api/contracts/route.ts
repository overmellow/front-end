import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Contract from '@/app/schemas/Contract'
import User from '@/app/schemas/User'
import Clause from '@/app/schemas/Clause'
import { IClause } from '@/app/schemas/Clause'

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

export async function POST(request: NextRequest) {
	return handlePostRequest(request).catch((error) => {
		console.error('Unhandled error in POST /api/contracts:', error)
		return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
	})
}

async function handlePostRequest(request: NextRequest) {	
	await dbConnect()

	const { title, clauses, status, userEmail, partyEmails } = await request.json()
	console.log('title:', title)
	console.log('clauses:', clauses)
	console.log('status:', status)
	console.log('userEmail:', userEmail)
	console.log('partyEmails:', partyEmails)
	const newClauses = await Promise.all(clauses.map(async (clause: IClause) => {
		const { _id, ...clauseData } = clause;
		const newClause = new Clause(clauseData);
		await newClause.save();
		return newClause;
	}))

	const owner = await User.findOne({ email: userEmail })
	if (!owner) {
		return NextResponse.json({ error: 'Owner not found' }, { status: 404 })
	}

	const parties = await User.find({ email: { $in: partyEmails } })

	const contract = new Contract({
		title: title,
		clauses: newClauses,
		status: status,
		owner: owner._id,
		parties: parties.map(party => party._id)
	})

	await contract.save()

	return NextResponse.json(contract, { status: 201 })
}
