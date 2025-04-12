// Upstox API Configuration
export const UPSTOX_API_BASE_URL = 'https://api.upstox.com/v3';
export const UPSTOX_API_PROFILE_ENDPOINT = '/user/profile';
export const UPSTOX_API_FUNDS_MARGIN_ENDPOINT = '/user/get-funds-and-margin';
export const UPSTOX_API_HOLDINGS_ENDPOINT = '/portfolio/long-term-holdings';
export const UPSTOX_API_POSITIONS_ENDPOINT = '/portfolio/short-term-positions';
export const UPSTOX_API_MTF_POSITIONS_ENDPOINT = '/portfolio/mtf-positions';

// HTTP Headers
export const HEADERS = {
  ACCEPT: 'application/json',
};

// Error Messages
export const ERROR_MESSAGES = {
  API_ERROR: 'Error occurred while calling Upstox API',
};

// Market Segments
export const MARKET_SEGMENTS = {
  EQUITY: 'SEC',
  COMMODITY: 'COM',
}; 