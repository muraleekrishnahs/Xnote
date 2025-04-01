import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  
  try {
    // Log formData for debugging
    console.log('Received formData:', Object.fromEntries(formData.entries()));
    
    // Forward the request to the backend
    const backendUrl = 'http://backend:8000/token';
    
    // Convert formData entries to a record of strings
    const formDataEntries = Object.fromEntries(formData.entries());
    const formParams = new URLSearchParams();
    
    // Add each entry to the URLSearchParams object
    Object.entries(formDataEntries).forEach(([key, value]) => {
      formParams.append(key, value.toString());
    });
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formParams.toString(),
    });
    
    // Read the response data
    const data = await response.json();
    
    // Return the response with the appropriate status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in token API route:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
} 