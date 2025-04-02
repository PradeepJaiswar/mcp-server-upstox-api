import { UpstoxClient } from '../src/clients';

// Example usage of the Upstox client to fetch short-term positions
async function main() {
  try {
    // Create a new client instance with the server URL
    const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
    const client = new UpstoxClient(serverUrl);
    
    console.log('Fetching short-term positions data...');
    
    // Call the getShortTermPositions method and wait for the response
    const response = await client.getShortTermPositions();
    
    // Handle the response based on its status
    if (response.status === 'success') {
      console.log('Short-term positions retrieved successfully:');
      
      // Access the positions from the response data
      const positions = response.data;
      
      // Check if positions exists and is an array
      if (positions && Array.isArray(positions) && positions.length > 0) {
        console.log(`Found ${positions.length} positions`);
        
        // Display a summary of each position
        positions.forEach((position, index) => {
          console.log(`\nPosition #${index + 1}:`);
          console.log(`Symbol: ${position.trading_symbol || 'Not available'}`);
          console.log(`Exchange: ${position.exchange || 'Not available'}`);
          console.log(`Quantity: ${position.quantity || 0}`);
          console.log(`Product: ${position.product || 'Not available'}`);
          console.log(`Last Price: ${position.last_price || 0}`);
          console.log(`Average Price: ${position.average_price || 0}`);
          console.log(`PnL: ${position.pnl || 0}`);
          console.log(`Buy Value: ${position.buy_value || 0}`);
          console.log(`Sell Value: ${position.sell_value || 0}`);
        });
        
        // Log the full response data for debugging
        console.log('\nFull response data:');
        console.log(JSON.stringify(positions, null, 2));
      } else {
        console.log('No positions found or invalid response format');
        // Log the actual response for debugging
        console.log('Actual response structure:');
        console.log(JSON.stringify(response, null, 2));
      }
    } else {
      console.error('Error retrieving short-term positions:');
      console.error(response.errors);
    }
  } catch (error) {
    console.error('Unexpected error:', error instanceof Error ? error.message : String(error));
  }
}

main();