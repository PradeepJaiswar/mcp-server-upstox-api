import { Command } from 'commander';
import axios from 'axios';
import { 
  UPSTOX_API, 
  API_RESPONSE_STATUS, 
  HTTP_HEADERS, 
  CONTENT_TYPES, 
  ERROR_CODES, 
  ERROR_MESSAGES 
} from '../constants';
import { 
  PlaceOrderRequest, 
  PlaceOrderResponse, 
  UpstoxResponse, 
  UpstoxSuccessResponse, 
  UpstoxErrorResponse,
  ORDER_PRODUCT,
  ORDER_TYPE,
  ORDER_VALIDITY,
  TRANSACTION_TYPE
} from '../models';

/**
 * PlaceOrderCommand - Implements the place-order command to place new orders via Upstox API
 */
export class PlaceOrderCommand {
  public static register(program: Command): void {
    program
      .command('place-order')
      .description('Place an order on Upstox')
      .requiredOption('--instrument <token>', 'Instrument token (e.g., NSE_EQ|INE848E01016)')
      .requiredOption('--quantity <number>', 'Order quantity', parseInt)
      .requiredOption('--transaction <type>', 'Transaction type (BUY or SELL)')
      .option('--product <code>', 'Product code (D=Delivery, I=Intraday, M=Margin)', 'D')
      .option('--type <type>', 'Order type (MARKET, LIMIT, SL-M, SL)', 'MARKET')
      .option('--price <amount>', 'Order price (required for LIMIT and SL orders)', parseFloat, 0)
      .option('--trigger <price>', 'Trigger price (required for SL-M and SL orders)', parseFloat, 0)
      .option('--validity <type>', 'Order validity (DAY or IOC)', 'DAY')
      .option('--disclosed <quantity>', 'Disclosed quantity', parseInt, 0)
      .option('--tag <tag>', 'User tag for the order')
      .option('--amo', 'Place as AMO (After Market Order)', false)
      .option('--slice', 'Enable order slicing', false)
      .action(async (options) => {
        try {
          // Get configuration from environment variables
          const apiUrl = UPSTOX_API.DEFAULT_URL;
          const accessToken = process.env.UPSTOX_ACCESS_TOKEN;
          
          if (!accessToken) {
            console.warn(ERROR_MESSAGES.UPSTOX_TOKEN_NOT_SET);
            return;
          }
          
          // Validate required options
          if (!options.instrument || !options.quantity || !options.transaction) {
            console.error('Missing required parameters: instrument, quantity, and transaction type are required');
            return;
          }
          
          // Validate transaction type
          if (![TRANSACTION_TYPE.BUY, TRANSACTION_TYPE.SELL].includes(options.transaction.toUpperCase())) {
            console.error(`Invalid transaction type: ${options.transaction}. Use BUY or SELL.`);
            return;
          }
          
          // Construct order request
          const orderRequest: PlaceOrderRequest = {
            instrument_token: options.instrument,
            quantity: options.quantity,
            transaction_type: options.transaction.toUpperCase(),
            product: options.product,
            order_type: options.type,
            price: options.price,
            trigger_price: options.trigger,
            validity: options.validity,
            disclosed_quantity: options.disclosed,
            is_amo: options.amo,
            slice: options.slice
          };
          
          // Add optional tag if provided
          if (options.tag) {
            orderRequest.tag = options.tag;
          }
          
          // Log the order details
          console.log('Placing order with the following details:');
          console.log(JSON.stringify(orderRequest, null, 2));
          
          // Make the API call
          const response = await PlaceOrderCommand.placeOrder(apiUrl, accessToken, orderRequest);
          console.log(JSON.stringify(response, null, 2));
        } catch (error) {
          console.error('Error placing order:', error instanceof Error ? error.message : String(error));
        }
      });
  }
  
  /**
   * Place an order via Upstox API
   * @param apiUrl The base URL for Upstox API
   * @param accessToken The access token for authentication
   * @param orderRequest The order details
   * @returns Response with order IDs for successful orders
   */
  private static async placeOrder(
    apiUrl: string, 
    accessToken: string, 
    orderRequest: PlaceOrderRequest
  ): Promise<UpstoxResponse<PlaceOrderResponse>> {
    try {
      const response = await axios.post(
        `${apiUrl}${UPSTOX_API.V3_PLACE_ORDER_ENDPOINT}`, 
        orderRequest,
        {
          headers: {
            [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
            [HTTP_HEADERS.ACCEPT]: CONTENT_TYPES.JSON,
            [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${accessToken}`
          }
        }
      );
      
      // Return the successful response
      return {
        status: API_RESPONSE_STATUS.SUCCESS,
        data: response.data.data
      } as UpstoxSuccessResponse<PlaceOrderResponse>;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // If the error response is already in our expected format, return it directly
        if (error.response.data?.status === API_RESPONSE_STATUS.ERROR && 
            error.response.data?.errors) {
          return error.response.data as UpstoxErrorResponse;
        }
        
        // Otherwise, standardize the error
        return {
          status: API_RESPONSE_STATUS.ERROR,
          errors: [{
            error_code: String(error.response.status),
            message: error.response.statusText || ERROR_MESSAGES.API_REQUEST_FAILED,
            property_path: null,
            invalid_value: null
          }]
        } as UpstoxErrorResponse;
      }
      
      // For network errors or other unexpected issues
      return {
        status: API_RESPONSE_STATUS.ERROR,
        errors: [{
          error_code: ERROR_CODES.NETWORK_ERROR,
          message: error instanceof Error ? error.message : String(error),
          property_path: null,
          invalid_value: null
        }]
      } as UpstoxErrorResponse;
    }
  }
}