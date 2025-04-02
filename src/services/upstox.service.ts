import axios from 'axios';
import { config } from '../config';
import { UserProfile, UpstoxResponse, UpstoxErrorResponse, UpstoxSuccessResponse, FundsAndMargin } from '../models';
import { API_RESPONSE_STATUS, ERROR_CODES, ERROR_MESSAGES, HTTP_HEADERS, CONTENT_TYPES, UPSTOX_API, SEGMENT_TYPES } from '../constants';

/**
 * UpstoxService - Handles all interactions with the Upstox API
 */
export class UpstoxService {
  private apiUrl: string;
  private accessToken: string;

  constructor() {
    this.apiUrl = config.app.upstox.apiUrl;
    this.accessToken = config.app.upstox.accessToken;

    if (!this.accessToken) {
      console.warn(ERROR_MESSAGES.UPSTOX_TOKEN_NOT_SET);
    }
  }

  /**
   * Get user profile information from Upstox API
   * @returns User profile data with success or error response structure
   */
  async getProfile(): Promise<UpstoxResponse<UserProfile>> {
    try {
      const response = await axios.get(`${this.apiUrl}${UPSTOX_API.V2_PROFILE_ENDPOINT}`, {
        headers: {
          [HTTP_HEADERS.ACCEPT]: CONTENT_TYPES.JSON,
          [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${this.accessToken}`
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

  /**
   * Get user funds and margin information from Upstox API
   * @param segment Optional segment filter ('SEC' for equity, 'COM' for commodity)
   * @returns Funds and margin data with success or error response structure
   */
  async getFundsAndMargin(segment?: string): Promise<UpstoxResponse<FundsAndMargin>> {
    try {
      // Build URL with optional segment parameter
      let url = `${this.apiUrl}${UPSTOX_API.V2_FUNDS_MARGIN_ENDPOINT}`;
      if (segment) {
        url += `?segment=${segment}`;
      }

      const response = await axios.get(url, {
        headers: {
          [HTTP_HEADERS.ACCEPT]: CONTENT_TYPES.JSON,
          [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${this.accessToken}`
        }
      });
      
      // Wrap the API response in our standard format
      return {
        status: API_RESPONSE_STATUS.SUCCESS,
        data: response.data
      } as UpstoxSuccessResponse<FundsAndMargin>;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // If the error response is already in our expected format, return it directly
        if (error.response.data?.status === API_RESPONSE_STATUS.ERROR && 
            error.response.data?.errors) {
          return error.response.data as UpstoxErrorResponse;
        }
        
        // Otherwise, standardize the error
        return {
          status: 'error',
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
        status: 'error',
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