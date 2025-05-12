import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Read the request body as JSON
    const { name, email, message } = await request.json();

    // --- VERY MINIMAL BACKEND LOGGING ---
    // This is where the request data is logged on the server.
    // In your terminal where `npm run dev` (or similar) is running,
    // you should see these logs when the form is submitted.
    console.log('--- Contact Form Submission (Server-Side - App Router) ---');
    console.log('Received Name:', name);
    console.log('Received Email:', email);
    console.log('Received Message:', message);
    console.log('-------------------------------------------------------');
    // --- END OF MINIMAL BACKEND LOGGING ---

    // Basic validation
    if (name && email && message) {
      // Send a success response back to the client
      return NextResponse.json({ 
        message: 'Form data received successfully on the server!',
        data: { name, email, message } 
      }, { status: 200 });
    } else {
      // Send an error response if data is missing
      return NextResponse.json({ message: 'Missing form data. Please fill out all fields.' }, { status: 400 });
    }
  } catch (error) {
    // Catch any errors during request processing
    console.error('Error processing contact form request:', error);
    return NextResponse.json({ message: 'Error processing your request. Please try again.' }, { status: 500 });
  }
}

// Optional: You can also define a GET handler or other HTTP methods here
// export async function GET(request: NextRequest) {
//   return NextResponse.json({ message: 'This is the contact API endpoint. Use POST to submit data.' });
// } 