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
  UserProfile, 
  UpstoxResponse, 
  UpstoxSuccessResponse, 
  UpstoxErrorResponse 
} from '../models';

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
          const apiUrl = UPSTOX_API.DEFAULT_URL;
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
      const response = await axios.get(`${apiUrl}${UPSTOX_API.V2_PROFILE_ENDPOINT}`, {
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