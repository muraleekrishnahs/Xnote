import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Forward the request to the backend
    const backendUrl = `http://backend:8000/notes/${params.id}/analyze`;
    
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
    
    // Handle not found
    if (response.status === 404) {
      return NextResponse.json(
        { detail: 'Note not found' },
        { status: 404 }
      );
    }
    
    // Read the response data
    const data = await response.json();
    
    // Return the response with the appropriate status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in note analyze API route:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
} 