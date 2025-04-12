import { z } from "zod";
import { ToolHandler, ToolResponse, GetFundsMarginArgs } from "../types";
import { 
  UPSTOX_API_BASE_URL, 
  UPSTOX_API_FUNDS_MARGIN_ENDPOINT,
  HEADERS,
  ERROR_MESSAGES,
  MARKET_SEGMENTS
} from "../constants";

export const getFundsMarginSchema = {
  accessToken: z.string().min(1, "Access token is required"),
  segment: z.enum([MARKET_SEGMENTS.EQUITY, MARKET_SEGMENTS.COMMODITY]).optional(),
};

const GetFundsMarginArgsSchema = z.object(getFundsMarginSchema);

interface FundsMarginData {
  used_margin: number;
  payin_amount: number;
  span_margin: number;
  adhoc_margin: number;
  notional_cash: number;
  available_margin: number;
  exposure_margin: number;
}

interface UpstoxFundsMarginResponse {
  status: string;
  data: {
    commodity?: FundsMarginData;
    equity?: FundsMarginData;
  };
}

export const getFundsMarginHandler: ToolHandler<GetFundsMarginArgs> = async (args: GetFundsMarginArgs, extra: { [key: string]: unknown }): Promise<ToolResponse> => {
  const validatedArgs = GetFundsMarginArgsSchema.parse(args);
  
  const url = new URL(`${UPSTOX_API_BASE_URL}${UPSTOX_API_FUNDS_MARGIN_ENDPOINT}`);
  if (validatedArgs.segment) {
    url.searchParams.append('segment', validatedArgs.segment);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Accept": HEADERS.ACCEPT,
      "Authorization": `Bearer ${validatedArgs.accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.API_ERROR);
  }

  const data = await response.json() as UpstoxFundsMarginResponse;
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(data, null, 2)
    }]
  };
}; 