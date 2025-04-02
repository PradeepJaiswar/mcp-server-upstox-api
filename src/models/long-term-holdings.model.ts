/**
 * Long Term Holdings Model
 * Based on Upstox API documentation: https://upstox.com/developer/api-documentation/get-holdings
 */

/**
 * Represents a long-term holding
 */
export interface Holding {
  isin: string;
  cnc_used_quantity: number;
  collateral_type: string;
  company_name: string;
  haircut: number;
  product: string;
  quantity: number;
  trading_symbol: string;
  tradingsymbol: string;
  last_price: number;
  close_price: number;
  pnl: number;
  day_change: number;
  day_change_percentage: number;
  instrument_token: string;
  average_price: number;
  collateral_quantity: number;
  collateral_update_quantity: number;
  t1_quantity: number;
  exchange: string;
}

/**
 * Array of holdings
 */
export type LongTermHoldings = Holding[];