// Model for place order request and response from Upstox API
// Based on documentation at https://upstox.com/developer/api-documentation/example-code/orders/v3/place-order

// Place Order Request Model
export interface PlaceOrderRequest {
  quantity: number;
  product: string;
  validity: string;
  price: number;
  tag?: string;
  instrument_token: string;
  order_type: string;
  transaction_type: string;
  disclosed_quantity: number;
  trigger_price: number;
  is_amo: boolean;
  slice?: boolean;
}

// Place Order Response Model
export interface PlaceOrderResponse {
  order_ids: string[];
}

// Constants for place order options
export const ORDER_PRODUCT = {
  DELIVERY: 'D',
  INTRADAY: 'I',
  MARGIN: 'M',
  COVER_ORDER: 'CO',
  BRACKET_ORDER: 'BO'
};

export const ORDER_TYPE = {
  MARKET: 'MARKET',
  LIMIT: 'LIMIT',
  SL_MARKET: 'SL-M',
  SL_LIMIT: 'SL'
};

export const ORDER_VALIDITY = {
  DAY: 'DAY',
  IOC: 'IOC'
};

export const TRANSACTION_TYPE = {
  BUY: 'BUY',
  SELL: 'SELL'
};