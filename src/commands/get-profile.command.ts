import { Command } from 'commander';
import axios from 'axios';

// User Profile Interface
interface UserProfile {
  user_id: string;
  user_name: string;
  email: string;
  phone: string;
  exchanges: string[];
  products: string[];
  broker: string;
  enabled_exchanges: string[];
  enabled_products: string[];
  is_active: boolean;
  user_type: string;
  poa: boolean;
  is_logging_enabled: boolean;
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
 * GetProfileCommand - Implements the get-profile command to fetch user profile from Upstox API
 * This is a simplified version with everything in one file
 */
export class GetProfileCommand {
  public static register(program: Command): void {
    program
      .command('get-profile')
      .description('Get user profile information from Upstox API')
      .action(async () => {
        try {
          // Get configuration from environment variables
          const apiUrl = process.env.UPSTOX_API_URL || 'https://api.upstox.com';
          const accessToken = process.env.UPSTOX_ACCESS_TOKEN;
          
          if (!accessToken) {
            console.warn(ERROR_MESSAGES.UPSTOX_TOKEN_NOT_SET);
            return;
          }
          
          // Make the API call
          const response = await GetProfileCommand.getProfile(apiUrl, accessToken);
          console.log(JSON.stringify(response, null, 2));
        } catch (error) {
          console.error('Error fetching profile:', error instanceof Error ? error.message : String(error));
        }
      });
  }
  
  /**
   * Get user profile information from Upstox API
   * @param apiUrl The base URL for Upstox API
   * @param accessToken The access token for authentication
   * @returns User profile data with success or error response structure
   */
  private static async getProfile(apiUrl: string, accessToken: string): Promise<UpstoxResponse<UserProfile>> {
    try {
      const response = await axios.get(`${apiUrl}/v2/user/profile`, {
        headers: {
          [HTTP_HEADERS.ACCEPT]: CONTENT_TYPES.JSON,
          [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${accessToken}`
        }
      });
      
      // The Upstox API returns data directly, so we need to wrap it in our standard format
      return {
        status: API_RESPONSE_STATUS.SUCCESS,
        data: response.data
      } as UpstoxSuccessResponse<UserProfile>;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // If the error is from Upstox API and has the expected format, pass it through
        if (error.response.data?.status === API_RESPONSE_STATUS.ERROR && error.response.data?.errors) {
          return error.response.data as UpstoxErrorResponse;
        }
        
        // Otherwise, create a standardized error response
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
      
      // For network errors or other issues
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