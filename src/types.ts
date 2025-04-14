export interface PlaceOrderArgs {
  accessToken: string;
  quantity: number;
  product: string;
  validity: string;
  price: number;
  instrument_token: string;
  order_type: string;
  transaction_type: string;
  disclosed_quantity?: number;
  trigger_price?: number;
  is_amo?: boolean;
  slice?: boolean;
  tag?: string;
}

export interface GetProfileArgs {
  accessToken: string;
}

export interface GetFundsMarginArgs {
  accessToken: string;
}

export interface GetHoldingsArgs {
  accessToken: string;
}

export interface GetPositionsArgs {
  accessToken: string;
}

export interface GetMtfPositionsArgs {
  accessToken: string;
}

export interface GetOrderDetailsArgs {
  accessToken: string;
  orderId: string;
}

export type ToolResponse = {
    content: { type: "text"; text: string }[];
};

export type ToolHandler<T> = (params: T, extra: { [key: string]: unknown }) => Promise<ToolResponse>; 