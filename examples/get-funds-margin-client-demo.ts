import { UpstoxClient } from '../src/clients';

// Example usage of the Upstox client
async function main() {
  try {
    // Create a new client instance with the server URL
    const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
    const client = new UpstoxClient(serverUrl);
    
    console.log('Fetching funds and margin data...');
    
    // Call the getFundsAndMargin method and wait for the response
    const fundsMarginResponse = await client.getFundsAndMargin();
    
    // Handle the response based on its status
    if (fundsMarginResponse.status === 'success') {
      console.log('Funds and margin data retrieved successfully:');
      
      // Check if data exists and has expected properties
      if (fundsMarginResponse.data) {
        // Display equity information if available
        if (fundsMarginResponse.data.equity) {
          console.log('Equity:');
          console.log('  Available Margin:', fundsMarginResponse.data.equity.available_margin || 'Not available');
          console.log('  Used Margin:', fundsMarginResponse.data.equity.used_margin || 'Not available');
        } else {
          console.log('Equity data: Not available');
        }
        
        // Display commodity information if available
        if (fundsMarginResponse.data.commodity) {
          console.log('Commodity:');
          console.log('  Available Margin:', fundsMarginResponse.data.commodity.available_margin || 'Not available');
          console.log('  Used Margin:', fundsMarginResponse.data.commodity.used_margin || 'Not available');
        } else {
          console.log('Commodity data: Not available');
        }
        
        // Display fund_limit information if available
        if (fundsMarginResponse.data.fund_limit && Array.isArray(fundsMarginResponse.data.fund_limit)) {
          console.log('Fund Limits:', fundsMarginResponse.data.fund_limit.length, 'entries');
        } else {
          console.log('Fund Limits: Not available');
        }
        
        // Log the full response data for debugging
        console.log('\nFull response data:');
        console.log(JSON.stringify(fundsMarginResponse.data, null, 2));
      } else {
        console.error('Received success status but no data was returned');
      }
    } else {
      console.error('Error retrieving funds and margin data:');
      console.error(fundsMarginResponse.errors);
    }
  } catch (error) {
    console.error('Unexpected error:', error instanceof Error ? error.message : String(error));
  }
}

main();