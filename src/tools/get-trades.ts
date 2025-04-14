import { z } from "zod";
import { ToolHandler, ToolResponse } from "./types";
import { 
  UPSTOX_API_BASE_URL, 
  UPSTOX_API_TRADES_ENDPOINT,
  HEADERS,
  ERROR_MESSAGES
} from "../constants";

export const getTradesSchema = {
  accessToken: z.string().min(1, "Access token is required"),
};

const GetTradesArgsSchema = z.object(getTradesSchema);

interface TradeResponse {
  status: string;
  data: Array<{
    exchange: string;
    product: string;
    trading_symbol: string;
    tradingsymbol: string;
    instrument_token: string;
    order_type: string;
    transaction_type: string;
    quantity: number;
    exchange_order_id: string;
    order_id: string;
    exchange_timestamp: string;
    average_price: number;
    trade_id: string;
    order_ref_id: string;
    order_timestamp: string;
  }>;
}

export const getTradesHandler: ToolHandler<{ accessToken: string }> = async (args: { accessToken: string }, extra: { [key: string]: unknown }): Promise<ToolResponse> => {
  const validatedArgs = GetTradesArgsSchema.parse(args);
  
  const response = await fetch(`${UPSTOX_API_BASE_URL}${UPSTOX_API_TRADES_ENDPOINT}`, {
    method: "GET",
    headers: {
      "Accept": HEADERS.ACCEPT,
      "Authorization": `Bearer ${validatedArgs.accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.API_ERROR);
  }

  const data = await response.json() as TradeResponse;
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(data, null, 2)
    }]
  };
}; 