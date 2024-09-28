import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content } = body
    console.log(title, content)

    const newContract = await prisma.contract.create({
      data: {
        title,
        content,
      },
    })

    return NextResponse.json(newContract, { status: 201 })
  } catch (error) {
    console.error('Error creating contract:', error)
    return NextResponse.json({ error: 'Error creating contract' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
