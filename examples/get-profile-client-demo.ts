import { UpstoxClient } from '../src/clients';

// Example usage of the Upstox client
async function main() {
  try {
    // Create a new client instance with the server URL
    const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
    const client = new UpstoxClient(serverUrl);
    
    console.log('Fetching user profile data...');
    
    // Call the getProfile method and wait for the response
    const profileResponse = await client.getProfile();
    
    // Handle the response based on its status
    if (profileResponse.status === 'success') {
      console.log('Profile retrieved successfully:');
      
      // Check if data exists and has expected properties
      if (profileResponse.data) {
        console.log('User ID:', profileResponse.data.user_id || 'Not available');
        console.log('User Name:', profileResponse.data.user_name || 'Not available');
        console.log('Email:', profileResponse.data.email || 'Not available');
        
        // Check if enabled_exchanges exists before using join
        if (profileResponse.data.enabled_exchanges && Array.isArray(profileResponse.data.enabled_exchanges)) {
          console.log('Enabled Exchanges:', profileResponse.data.enabled_exchanges.join(', '));
        } else {
          console.log('Enabled Exchanges: Not available');
        }
        
        // Log the full response data for debugging
        console.log('\nFull response data:');
        console.log(JSON.stringify(profileResponse.data, null, 2));
      } else {
        console.error('Received success status but no data was returned');
      }
    } else {
      console.error('Error retrieving profile:');
      console.error(profileResponse.errors);
    }
  } catch (error) {
    console.error('Unexpected error:', error instanceof Error ? error.message : String(error));
  }
}

main();