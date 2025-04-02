import { UpstoxErrorResponse, UpstoxSuccessResponse } from './upstox.model';

/**
 * Model interfaces for Upstox API funds and margin
 * Based on Upstox API documentation: https://upstox.com/developer/api-documentation/get-user-fund-margin
 */

// Fund element interface
export interface Fund {
  type: string;
  segment: string;
  exchange: string;
  used_margin: number;
  payin_amount: number;
  span_margin: number;
  delivery_margin: number;
  exposure_margin: number;
  collateral: number;
  available_margin: number;
  adhoc_margin: number;
  notional_cash: number;
  realized_mtm: number;
  unrealized_mtm: number;
}

// Equity Margin interface
export interface EquityMargin {
  used_margin: number;
  payin_amount: number;
  span_margin: number;
  delivery_margin: number;
  exposure_margin: number;
  collateral: number;
  available_margin: number;
  adhoc_margin: number;
  notional_cash: number;
  realized_mtm: number;
  unrealized_mtm: number;
}

// Commodity Margin interface
export interface CommodityMargin {
  used_margin: number;
  payin_amount: number;
  span_margin: number;
  delivery_margin: number;
  exposure_margin: number;
  collateral: number;
  available_margin: number;
  adhoc_margin: number;
  notional_cash: number;
  realized_mtm: number;
  unrealized_mtm: number;
}

// Main Funds and Margin interface
export interface FundsAndMargin {
  equity: EquityMargin;
  commodity: CommodityMargin;
  fund_limit: Fund[];
}

// Type for API responses
export type FundsAndMarginResponse = UpstoxSuccessResponse<FundsAndMargin> | UpstoxErrorResponse;