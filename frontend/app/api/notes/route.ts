import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the backend
    const backendUrl = 'http://backend:8000/notes/';
    
    // Get token from request headers
    const authHeader = request.headers.get('Authorization');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Include authorization header if it exists
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers
    });
    
    // Read the response data
    const data = await response.json();
    
    // Return the response with the appropriate status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in notes API route:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the JSON body from the request
    const body = await request.json();
    
    // Forward the request to the backend
    const backendUrl = 'http://backend:8000/notes/';
    
    // Get token from request headers
    const authHeader = request.headers.get('Authorization');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Include authorization header if it exists
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    
    // Read the response data
    const data = await response.json();
    
    // Return the response with the appropriate status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in notes API route:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
} 