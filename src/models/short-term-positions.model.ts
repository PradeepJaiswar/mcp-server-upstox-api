// Model for short-term positions from Upstox API
// Based on documentation at https://upstox.com/developer/api-documentation/get-positions

export interface ShortTermPosition {
  exchange: string;
  multiplier: number;
  value: number;
  pnl: number;
  product: string;
  instrument_token: string;
  average_price: number | null;
  buy_value: number;
  overnight_quantity: number;
  day_buy_value: number;
  day_buy_price: number;
  overnight_buy_amount: number;
  overnight_buy_quantity: number;
  day_buy_quantity: number;
  day_sell_value: number;
  day_sell_price: number;
  overnight_sell_amount: number;
  overnight_sell_quantity: number;
  day_sell_quantity: number;
  quantity: number;
  last_price: number;
  unrealised: number;
  realised: number;
  sell_value: number;
  trading_symbol: string;
  tradingsymbol: string;
  close_price: number;
  buy_price: number;
  sell_price: number;
}

export type ShortTermPositions = ShortTermPosition[];