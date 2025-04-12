import { z } from "zod";
import { ToolHandler, ToolResponse, GetHoldingsArgs } from "../types";
import { 
  UPSTOX_API_BASE_URL, 
  UPSTOX_API_HOLDINGS_ENDPOINT,
  HEADERS,
  ERROR_MESSAGES
} from "../constants";

export const getHoldingsSchema = {
  accessToken: z.string().min(1, "Access token is required"),
};

const GetHoldingsArgsSchema = z.object(getHoldingsSchema);

interface Holding {
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

interface UpstoxHoldingsResponse {
  status: string;
  data: Holding[];
}

export const getHoldingsHandler: ToolHandler<GetHoldingsArgs> = async (args: GetHoldingsArgs, extra: { [key: string]: unknown }): Promise<ToolResponse> => {
  const validatedArgs = GetHoldingsArgsSchema.parse(args);
  
  const response = await fetch(`${UPSTOX_API_BASE_URL}${UPSTOX_API_HOLDINGS_ENDPOINT}`, {
    method: "GET",
    headers: {
      "Accept": HEADERS.ACCEPT,
      "Authorization": `Bearer ${validatedArgs.accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.API_ERROR);
  }

  const data = await response.json() as UpstoxHoldingsResponse;
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(data, null, 2)
    }]
  };
}; 