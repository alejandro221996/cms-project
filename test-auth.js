// Test script to verify authentication
const testAuth = async () => {
  try {
    // Test the TRPC endpoint
    const response = await fetch('http://localhost:3000/api/trpc/settings.getLayout', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', data);
    } else {
      console.log('Error response:', await response.text());
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testAuth(); 