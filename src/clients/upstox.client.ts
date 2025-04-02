import axios from 'axios';
import { UserProfile, UpstoxResponse, FundsAndMargin } from '../models';
import { API_RESPONSE_STATUS, ENDPOINTS, HTTP_HEADERS, CONTENT_TYPES, ERROR_CODES, ERROR_MESSAGES } from '../constants';

/**
 * UpstoxClient - Client for interacting with the MCP server's Upstox API endpoints
 */
export class UpstoxClient {
  private baseUrl: string;

  /**
   * Creates a new instance of the Upstox client
   * @param baseUrl Base URL of the MCP server (e.g., http://localhost:3000)
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  /**
   * Get user profile information from Upstox via the MCP server
   * @returns User profile data with standardized response structure
   */
  async getProfile(): Promise<UpstoxResponse<UserProfile>> {
    try {
      const response = await axios.get(`${this.baseUrl}${ENDPOINTS.GET_PROFILE}`, {
        headers: {
          [HTTP_HEADERS.ACCEPT]: CONTENT_TYPES.JSON,
        }
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // If the error response is already in our expected format, return it directly
        if (error.response.data?.status === API_RESPONSE_STATUS.ERROR && 
            error.response.data?.errors) {
          return error.response.data;
        }
        
        // Otherwise, standardize the error
        return {
          status: 'error', // Changed from API_RESPONSE_STATUS.ERROR to literal 'error'
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
        status: 'error', // Changed from API_RESPONSE_STATUS.ERROR to literal 'error'
        errors: [{
          error_code: ERROR_CODES.NETWORK_ERROR,
          message: error instanceof Error ? error.message : String(error),
          property_path: null,
          invalid_value: null
        }]
      };
    }
  }

  /**
   * Get user funds and margin information from Upstox via the MCP server
   * @param segment Optional segment filter ('SEC' for equity, 'COM' for commodity)
   * @returns Funds and margin data with standardized response structure
   */
  async getFundsAndMargin(segment?: string): Promise<UpstoxResponse<FundsAndMargin>> {
    try {
      // Build the URL with optional segment parameter
      let url = `${this.baseUrl}${ENDPOINTS.GET_FUNDS_MARGIN}`;
      if (segment) {
        url += `?segment=${segment}`;
      }

      const response = await axios.get(url, {
        headers: {
          [HTTP_HEADERS.ACCEPT]: CONTENT_TYPES.JSON,
        }
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // If the error response is already in our expected format, return it directly
        if (error.response.data?.status === API_RESPONSE_STATUS.ERROR && 
            error.response.data?.errors) {
          return error.response.data;
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