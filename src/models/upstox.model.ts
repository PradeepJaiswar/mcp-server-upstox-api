/**
 * Upstox User Profile Model
 * Based on Upstox API documentation: https://upstox.com/developer/api-documentation/get-profile
 */
export interface UserProfile {
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

// Define response structure interfaces for the Upstox API
export interface UpstoxSuccessResponse<T> {
  status: 'success';
  data: T;
}

export interface UpstoxErrorResponse {
  status: 'error';
  errors: Array<{
    error_code: string;
    message: string;
    property_path: string | null;
    invalid_value: string | null;
  }>;
}

export type UpstoxResponse<T> = UpstoxSuccessResponse<T> | UpstoxErrorResponse;

// For backwards compatibility
export interface ProfileResponse extends UpstoxSuccessResponse<UserProfile> {}