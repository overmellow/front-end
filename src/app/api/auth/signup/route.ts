import { NextResponse, NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect';
import { hash } from 'bcrypt'
import User from '@/app/schemas/User' // Assume we have a User model defined

export async function POST(request: NextRequest) {
  return handlePostRequest(request).catch((error) => {
    console.error('Unhandled error in POST /api/contracts:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  })
}


async function handlePostRequest(request: NextRequest) {
  await dbConnect();
  try {
    const { name, email, password } = await request.json()
    console.log(name, email, password)
    const existingUser = await User.findOne({ email: email })
    console.log(existingUser)
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10)
    // const demoUser = await User.create({
    //   name: 'iman',
    //   email: 'iman@mail.com',
    //   password: '111',
    // })
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    })
    // const newUser = {
    //   name: 'name',
    //   email: 'email',
    //   password: 'password',
    // }
    console.log(newUser)
    return NextResponse.json(newUser, { status: 201 })  
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred during signup' }, { status: 500 })
  }
}
