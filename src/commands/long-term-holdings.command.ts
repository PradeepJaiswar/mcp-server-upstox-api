// filepath: /Users/pradeepjaiswar/workspace/mcp-server-upstox-api/src/commands/long-term-holdings.command.ts
import { Command } from 'commander';
import axios from 'axios';
import { UPSTOX_API } from '../constants';

// Holding Interface
interface Holding {
  isin: string;
  cnc_used_quantity: number;
  collateral_type: string;
  company_name: string;
  haircut: number;
  product: string;
  quantity: number;
  trading_symbol: string;
  tradingsymbol: string;
  last_price: number;
  close_price: number;
  pnl: number;
  day_change: number;
  day_change_percentage: number;
  instrument_token: string;
  average_price: number;
  collateral_quantity: number;
  collateral_update_quantity: number;
  t1_quantity: number;
  exchange: string;
}

// Response Types
interface UpstoxSuccessResponse<T> {
  status: 'success';
  data: T;
}

interface UpstoxErrorResponse {
  status: 'error';
  errors: Array<{
    error_code: string;
    message: string;
    property_path: string | null;
    invalid_value: string | null;
  }>;
}

type UpstoxResponse<T> = UpstoxSuccessResponse<T> | UpstoxErrorResponse;

// Constants
const API_RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
};

const HTTP_HEADERS = {
  ACCEPT: 'Accept',
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
};

const CONTENT_TYPES = {
  JSON: 'application/json',
};

const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
};

const ERROR_MESSAGES = {
  API_REQUEST_FAILED: 'API request failed',
  UPSTOX_TOKEN_NOT_SET: 'UPSTOX_ACCESS_TOKEN is not set in environment variables',
};

/**
 * LongTermHoldingsCommand - Implements the long-term-holdings command to fetch user's long-term holdings from Upstox API
 */
export class LongTermHoldingsCommand {
  public static register(program: Command): void {
    program
      .command('long-term-holdings')
      .description('Get user\'s long-term holdings information from Upstox API')
      .action(async () => {
        try {
          // Get configuration from environment variables
          const apiUrl = UPSTOX_API.DEFAULT_URL;
          const accessToken = process.env.UPSTOX_ACCESS_TOKEN;
          
          if (!accessToken) {
            console.warn(ERROR_MESSAGES.UPSTOX_TOKEN_NOT_SET);
            return;
          }
          
          // Make the API call
          const response = await LongTermHoldingsCommand.getLongTermHoldings(apiUrl, accessToken);
          console.log(JSON.stringify(response, null, 2));
        } catch (error) {
          console.error('Error fetching long-term holdings:', error instanceof Error ? error.message : String(error));
        }
      });
  }
  
  /**
   * Get user's long-term holdings information from Upstox API
   * @param apiUrl The base URL for Upstox API
   * @param accessToken The access token for authentication
   * @returns Long-term holdings data with success or error response structure
   */
  private static async getLongTermHoldings(apiUrl: string, accessToken: string): Promise<UpstoxResponse<Holding[]>> {
    try {
      const response = await axios.get(`${apiUrl}${UPSTOX_API.V2_LONG_TERM_HOLDINGS_ENDPOINT}`, {
        headers: {
          [HTTP_HEADERS.ACCEPT]: CONTENT_TYPES.JSON,
          [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${accessToken}`
        }
      });
      
      // Wrap the API response in our standard format
      return {
        status: API_RESPONSE_STATUS.SUCCESS,
        data: response.data
      } as UpstoxSuccessResponse<Holding[]>;
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