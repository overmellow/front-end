import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Parse the JSON body from the request
  const body = await request.json();

  // Sample data - you can use the body to customize the response
  const sampleData = {
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com' },
    ],
    status: 'success',
    timestamp: new Date().toISOString(),
    receivedData: body, // Echo back the received data
  };

  // Return the sample data as JSON
  return NextResponse.json(sampleData);
}

export async function GET(request: NextRequest) {
  const contracts = [
    {id: 11, title: 'Contract 21', content: 'Content 12'},
    {id: 12, title: 'Contract 22', content: 'Content 13'},
    {id: 13, title: 'Contract 23', content: 'Content 14'},
  ]
  return NextResponse.json(contracts);
}