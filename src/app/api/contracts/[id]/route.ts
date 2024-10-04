import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect';
import Contract from '@/app/schemas/Contract';
import User from '@/app/schemas/User'
import mongoose from 'mongoose';
import Clause from '@/app/schemas/Clause';
import { ClauseI } from '@/app/interfaces/ClauseI';

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
    .populate('parties')
    .populate('clauses');
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

  const { title, clauses, status, partyEmails } = body

	const newClauses = await Promise.all(clauses.map(async (clause: ClauseI) => {
		// Check if the clause already exists in the database
		if (clause._id) {
			// If it exists, update it instead of creating a new one
			// Check if clause._id is a valid MongoDB ObjectId
			if (!mongoose.Types.ObjectId.isValid(clause._id as string)) {
				// If it's not valid, create a new clause
				const newClause = new Clause({ content: clause.content });
				await newClause.save();
				return newClause;
			}

			const existingClause = await Clause.findByIdAndUpdate(clause._id, clause, { new: true }, );
			if (existingClause) {
        console.log('existingClause:', existingClause)
				return existingClause;
			}
		}
		const newClause = new Clause(clause.content);
		await newClause.save();
		return newClause;
	}));

  if (!title) {
    console.log('Missing required fields')
    return NextResponse.json({ error: 'Title, content, and userId are required' }, { status: 400 })
  }

  const parties = await User.find({ email: { $in: partyEmails } })

  const contract = await Contract.findByIdAndUpdate(id, {
    title: title,
    clauses: newClauses,
    status: status,
    parties: parties.map(party => party._id)
  });

  if (!contract) {
    return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
  }
  
  return NextResponse.json(contract,{ status: 200 })
}