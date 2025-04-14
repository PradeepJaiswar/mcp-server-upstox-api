import { z } from "zod";
import { ToolHandler, ToolResponse } from "./types";
import { 
  UPSTOX_API_BASE_URL, 
  UPSTOX_API_ORDER_HISTORY_ENDPOINT,
  HEADERS,
  ERROR_MESSAGES
} from "../constants";

export const getOrderHistorySchema = {
  accessToken: z.string().min(1, "Access token is required"),
  orderId: z.string().optional(),
  tag: z.string().optional(),
};

const GetOrderHistoryArgsSchema = z.object(getOrderHistorySchema)
  .refine(
    (data) => data.orderId || data.tag,
    {
      message: "At least one of 'orderId' or 'tag' is required",
    }
  );

interface OrderHistory {
  exchange: string;
  price: number;
  product: string;
  quantity: number;
  status: string;
  tag: string | null;
  validity: string;
  average_price: number;
  disclosed_quantity: number;
  exchange_order_id: string | null;
  exchange_timestamp: string | null;
  instrument_token: string;
  is_amo: boolean;
  status_message: string | null;
  order_id: string;
  order_request_id: string;
  order_type: string;
  parent_order_id: string;
  trading_symbol: string;
  tradingsymbol: string;
  order_timestamp: string;
  filled_quantity: number;
  transaction_type: string;
  trigger_price: number;
  placed_by: string;
  variety: string;
}

interface OrderHistoryResponse {
  status: string;
  data: OrderHistory[];
}

export const getOrderHistoryHandler: ToolHandler<{ accessToken: string; orderId?: string; tag?: string }> = async (
  args: { accessToken: string; orderId?: string; tag?: string },
  extra: { [key: string]: unknown }
): Promise<ToolResponse> => {
  const validatedArgs = GetOrderHistoryArgsSchema.parse(args);

  const queryParams = new URLSearchParams();
  if (validatedArgs.orderId) {
    queryParams.append("order_id", validatedArgs.orderId);
  }
  if (validatedArgs.tag) {
    queryParams.append("tag", validatedArgs.tag);
  }

  const response = await fetch(
    `${UPSTOX_API_BASE_URL}${UPSTOX_API_ORDER_HISTORY_ENDPOINT}?${queryParams.toString()}`,
    {
      headers: {
        Accept: HEADERS.ACCEPT,
        Authorization: `Bearer ${validatedArgs.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.API_ERROR);
  }

  const data = await response.json() as OrderHistoryResponse;

  return {
    content: [{
      type: "text",
      text: JSON.stringify(data, null, 2)
    }]
  };
}; 