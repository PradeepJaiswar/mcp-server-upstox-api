export const UPSTOX_API_BASE_URL = "https://api.upstox.com";
export const UPSTOX_API_PLACE_ORDER_ENDPOINT = "/v3/order/place";
export const UPSTOX_API_FUNDS_MARGIN_ENDPOINT = "/v2/user/get-funds-and-margin";
export const UPSTOX_API_HOLDINGS_ENDPOINT = "/v2/portfolio/long-term-holdings";
export const UPSTOX_API_MTF_POSITIONS_ENDPOINT = "/v3/portfolio/mtf-positions";
export const UPSTOX_API_ORDER_BOOK_ENDPOINT = "/v2/order/retrieve-all";
export const UPSTOX_API_ORDER_DETAILS_ENDPOINT = "/v2/order/retrieve";
export const UPSTOX_API_ORDER_HISTORY_ENDPOINT = "/v2/order/history";
export const UPSTOX_API_ORDER_TRADES_ENDPOINT = "/v2/order/trades";
export const UPSTOX_API_POSITIONS_ENDPOINT = "/v2/portfolio/positions";
export const UPSTOX_API_PROFILE_ENDPOINT = "/v2/user/profile";
export const UPSTOX_API_TRADES_ENDPOINT = "/v2/trade/executed";

export const HEADERS = {
  ACCEPT: "application/json",
  "Content-Type": "application/json",
};

export const ERROR_MESSAGES = {
  INVALID_ACCESS_TOKEN: "Invalid access token",
  API_ERROR: "Error occurred while calling Upstox API",
  INVALID_ORDER_ID: "Invalid order ID",
  INVALID_MARKET_SEGMENT: "Invalid market segment",
};

export const MARKET_SEGMENTS = {
  EQUITY: "EQUITY",
  FNO: "FNO",
  CURRENCY: "CURRENCY",
  COMMODITY: "COMMODITY",
}; 