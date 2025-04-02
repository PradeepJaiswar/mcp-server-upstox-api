// filepath: /Users/pradeepjaiswar/workspace/mcp-server-upstox-api/examples/long-term-holdings-client-demo.ts
import { UpstoxClient } from '../src/clients';

// Example usage of the Upstox client to fetch long-term holdings
async function main() {
  try {
    // Create a new client instance with the server URL
    const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
    const client = new UpstoxClient(serverUrl);
    
    console.log('Fetching long-term holdings data...');
    
    // Call the getLongTermHoldings method and wait for the response
    const response = await client.getLongTermHoldings();
    
    // Handle the response based on its status
    if (response.status === 'success') {
      console.log('Long-term holdings retrieved successfully:');
      
      // Access the holdings from the response data
      // LongTermHoldings is defined as an array of Holding objects
      const holdings = response.data;
      
      // Check if holdings exists and is an array
      if (holdings && Array.isArray(holdings) && holdings.length > 0) {
        console.log(`Found ${holdings.length} holdings`);
        
        // Display a summary of each holding
        holdings.forEach((holding, index) => {
          console.log(`\nHolding #${index + 1}:`);
          console.log(`Company: ${holding.company_name || 'Not available'}`);
          console.log(`Symbol: ${holding.trading_symbol || 'Not available'}`);
          console.log(`Quantity: ${holding.quantity || 0}`);
          console.log(`Last Price: ${holding.last_price || 0}`);
          console.log(`Average Price: ${holding.average_price || 0}`);
          console.log(`PnL: ${holding.pnl || 0}`);
          console.log(`Exchange: ${holding.exchange || 'Not available'}`);
        });
        
        // Log the full response data for debugging
        console.log('\nFull response data:');
        console.log(JSON.stringify(holdings, null, 2));
      } else {
        console.log('No holdings found or invalid response format');
        // Log the actual response for debugging
        console.log('Actual response structure:');
        console.log(JSON.stringify(response, null, 2));
      }
    } else {
      console.error('Error retrieving long-term holdings:');
      console.error(response.errors);
    }
  } catch (error) {
    console.error('Unexpected error:', error instanceof Error ? error.message : String(error));
  }
}

main();