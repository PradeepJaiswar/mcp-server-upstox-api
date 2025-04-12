import { z } from "zod";
import { ToolHandler, ToolResponse, GetPositionsArgs } from "../types";
import { 
  UPSTOX_API_BASE_URL, 
  UPSTOX_API_POSITIONS_ENDPOINT,
  HEADERS,
  ERROR_MESSAGES
} from "../constants";

export const getPositionsSchema = {
  accessToken: z.string().min(1, "Access token is required"),
};

const GetPositionsArgsSchema = z.object(getPositionsSchema);

interface Position {
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

interface UpstoxPositionsResponse {
  status: string;
  data: Position[];
}

export const getPositionsHandler: ToolHandler<GetPositionsArgs> = async (args: GetPositionsArgs, extra: { [key: string]: unknown }): Promise<ToolResponse> => {
  const validatedArgs = GetPositionsArgsSchema.parse(args);
  
  const response = await fetch(`${UPSTOX_API_BASE_URL}${UPSTOX_API_POSITIONS_ENDPOINT}`, {
    method: "GET",
    headers: {
      "Accept": HEADERS.ACCEPT,
      "Authorization": `Bearer ${validatedArgs.accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.API_ERROR);
  }

  const data = await response.json() as UpstoxPositionsResponse;
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(data, null, 2)
    }]
  };
}; 