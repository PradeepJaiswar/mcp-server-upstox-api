import { Command } from 'commander';
import axios from 'axios';
import { UPSTOX_API } from '../constants';
import { ShortTermPosition, UpstoxResponse } from '../models';

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
 * ShortTermPositionsCommand - Implements the short-term-positions command to fetch user's short-term positions from Upstox API
 */
export class ShortTermPositionsCommand {
  public static register(program: Command): void {
    program
      .command('short-term-positions')
      .description('Get user\'s short-term positions information from Upstox API')
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
          const response = await ShortTermPositionsCommand.getShortTermPositions(apiUrl, accessToken);
          console.log(JSON.stringify(response, null, 2));
        } catch (error) {
          console.error('Error fetching short-term positions:', error instanceof Error ? error.message : String(error));
        }
      });
  }
  
  /**
   * Get user's short-term positions information from Upstox API
   * @param apiUrl The base URL for Upstox API
   * @param accessToken The access token for authentication
   * @returns Short-term positions data with success or error response structure
   */
  private static async getShortTermPositions(apiUrl: string, accessToken: string): Promise<UpstoxResponse<ShortTermPosition[]>> {
    try {
      const response = await axios.get(`${apiUrl}${UPSTOX_API.V2_SHORT_TERM_POSITIONS_ENDPOINT}`, {
        headers: {
          [HTTP_HEADERS.ACCEPT]: CONTENT_TYPES.JSON,
          [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${accessToken}`
        }
      });
      
      // Wrap the API response in our standard format
      return {
        status: API_RESPONSE_STATUS.SUCCESS,
        data: response.data.data
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // If the error response is already in our expected format, return it directly
        if (error.response.data?.status === API_RESPONSE_STATUS.ERROR && 
            error.response.data?.errors) {
          return error.response.data;
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
        };
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
      };
    }
  }
}