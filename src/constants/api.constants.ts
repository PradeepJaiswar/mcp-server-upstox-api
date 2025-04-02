/**
 * API related constants
 */

// Upstox API constants
export const UPSTOX_API = {
  DEFAULT_URL: process.env.UPSTOX_API_URL || 'https://api.upstox.com',
  V2_PROFILE_ENDPOINT: '/v2/user/profile',
  V2_FUNDS_MARGIN_ENDPOINT: '/v2/user/get-funds-and-margin',
  V2_LONG_TERM_HOLDINGS_ENDPOINT: '/v2/portfolio/long-term-holdings',
  V2_SHORT_TERM_POSITIONS_ENDPOINT: '/v2/portfolio/short-term-positions',
  V3_PLACE_ORDER_ENDPOINT: '/v3/order/place'
};

// API response status
export const API_RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
};

// Command API endpoints
export const ENDPOINTS = {
  GET_PROFILE: '/get-profile',
  GET_FUNDS_MARGIN: '/get-funds-margin',
  LONG_TERM_HOLDINGS: '/long-term-holdings',
  SHORT_TERM_POSITIONS: '/short-term-positions',
  PLACE_ORDER: '/place-order'
};

// Segment types for funds and margin
export const SEGMENT_TYPES = {
  EQUITY: 'SEC',
  COMMODITY: 'COM',
};