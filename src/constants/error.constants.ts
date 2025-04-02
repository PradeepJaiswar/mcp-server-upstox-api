/**
 * Error related constants
 */

// Error codes
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  COMMAND_NOT_FOUND: 'COMMAND_NOT_FOUND',
  INVALID_TOKEN: 'UDAPI100050',
};

// Error messages
export const ERROR_MESSAGES = {
  COMMAND_NOT_FOUND: (command: string) => `Command ${command} not found`,
  API_REQUEST_FAILED: 'API request failed',
  UPSTOX_TOKEN_NOT_SET: 'Upstox access token not set in environment variables',
  GET_PROFILE_FAILED: (error: string) => `Failed to get profile: ${error}`,
  EXECUTE_COMMAND_FAILED: (command: string, error: string) => `Failed to execute ${command}: ${error}`,
};