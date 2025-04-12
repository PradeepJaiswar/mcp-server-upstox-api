import { z } from "zod";
import { ToolHandler, ToolResponse, GetMtfPositionsArgs } from "../types";
import { 
  UPSTOX_API_BASE_URL, 
  UPSTOX_API_MTF_POSITIONS_ENDPOINT,
  HEADERS,
  ERROR_MESSAGES
} from "../constants";

export const getMtfPositionsSchema = {
  accessToken: z.string().min(1, "Access token is required"),
};

const GetMtfPositionsArgsSchema = z.object(getMtfPositionsSchema);

interface MtfPosition {
  exchange: string;
  multiplier: number;
  value: number;
  pnl: number;
  product: string;
  instrument_token: string;
  average_price: number;
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
  close_price: number;
  buy_price: number;
  sell_price: number;
}

interface UpstoxMtfPositionsResponse {
  status: string;
  data: MtfPosition[];
  metadata: {
    latency: number;
  };
}

export const getMtfPositionsHandler: ToolHandler<GetMtfPositionsArgs> = async (args: GetMtfPositionsArgs, extra: { [key: string]: unknown }): Promise<ToolResponse> => {
  const validatedArgs = GetMtfPositionsArgsSchema.parse(args);
  
  const response = await fetch(`${UPSTOX_API_BASE_URL}${UPSTOX_API_MTF_POSITIONS_ENDPOINT}`, {
    method: "GET",
    headers: {
      "Accept": HEADERS.ACCEPT,
      "Authorization": `Bearer ${validatedArgs.accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.API_ERROR);
  }

  const data = await response.json() as UpstoxMtfPositionsResponse;
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(data, null, 2)
    }]
  };
}; 