export const UPSTOX_API_BASE_URL = "https://api.upstox.com/v2";
export const UPSTOX_API_PLACE_ORDER_ENDPOINT = "/v2/order/place";
export const UPSTOX_API_FUNDS_MARGIN_ENDPOINT = "/user/get-funds-and-margin";
export const UPSTOX_API_HOLDINGS_ENDPOINT = "/portfolio/long-term-holdings";
export const UPSTOX_API_MTF_POSITIONS_ENDPOINT = "/portfolio/mtf-positions";
export const UPSTOX_API_ORDER_BOOK_ENDPOINT = "/order/retrieve-all";
export const UPSTOX_API_ORDER_DETAILS_ENDPOINT = "/order/retrieve";
export const UPSTOX_API_ORDER_HISTORY_ENDPOINT = "/order/history";
export const UPSTOX_API_ORDER_TRADES_ENDPOINT = "/order/trades";
export const UPSTOX_API_POSITIONS_ENDPOINT = "/portfolio/positions";
export const UPSTOX_API_PROFILE_ENDPOINT = "/user/profile";
export const UPSTOX_API_TRADES_ENDPOINT = "/trade/executed";

export const HEADERS = {
  ACCEPT: "application/json",
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