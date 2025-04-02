import { UpstoxClient } from '../src/clients';
import { ORDER_PRODUCT, ORDER_TYPE, ORDER_VALIDITY, TRANSACTION_TYPE, PlaceOrderRequest } from '../src/models';

// Example usage of the Upstox client to place an order
async function main() {
  try {
    // Create a new client instance with the server URL
    const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
    const client = new UpstoxClient(serverUrl);
    
    console.log('Preparing to place an After Market Order (AMO)...');
    
    // Construct the order request
    const orderRequest: PlaceOrderRequest = {
      instrument_token: 'NSE_EQ|INE848E01016', // Example: Some stock on NSE
      quantity: 1,
      product: ORDER_PRODUCT.DELIVERY,
      validity: ORDER_VALIDITY.DAY,
      price: 0, // For market orders
      order_type: ORDER_TYPE.MARKET,
      transaction_type: TRANSACTION_TYPE.BUY,
      disclosed_quantity: 0,
      trigger_price: 0,
      is_amo: true, // Set to true for After Market Order
      slice: false
    };
    
    console.log('Order details:');
    console.log(JSON.stringify(orderRequest, null, 2));
    
    // Call the placeOrder method and wait for the response
    console.log('Placing AMO order...');
    const response = await client.placeOrder(orderRequest);
    
    // Handle the response based on its status
    if (response.status === 'success') {
      console.log('AMO order placed successfully!');
      console.log(`Order IDs: ${response.data.order_ids.join(', ')}`);
      
      // Log the full response data for debugging
      console.log('\nFull response data:');
      console.log(JSON.stringify(response.data, null, 2));
    } else {
      console.error('Error placing AMO order:');
      console.error(response.errors);
    }
  } catch (error) {
    console.error('Unexpected error:', error instanceof Error ? error.message : String(error));
  }
}

main();