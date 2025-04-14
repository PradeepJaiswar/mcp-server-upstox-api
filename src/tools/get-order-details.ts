import { z } from "zod";
import { ToolHandler, ToolResponse } from "./types";
import { 
  UPSTOX_API_BASE_URL, 
  UPSTOX_API_ORDER_DETAILS_ENDPOINT,
  HEADERS,
  ERROR_MESSAGES
} from "../constants";

export const getOrderDetailsSchema = {
  accessToken: z.string().min(1, "Access token is required"),
  orderId: z.string().min(1, "Order ID is required"),
};

const GetOrderDetailsArgsSchema = z.object(getOrderDetailsSchema);

interface OrderDetailsResponse {
  status: string;
  data: {
    exchange: string;
    product: string;
    price: number;
    quantity: number;
    status: string;
    tag: string | null;
    instrument_token: string;
    placed_by: string;
    trading_symbol: string;
    tradingsymbol: string;
    order_type: string;
    validity: string;
    trigger_price: number;
    disclosed_quantity: number;
    transaction_type: string;
    average_price: number;
    filled_quantity: number;
    pending_quantity: number;
    status_message: string | null;
    status_message_raw: string | null;
    exchange_order_id: string;
    parent_order_id: string | null;
    order_id: string;
    variety: string;
    order_timestamp: string;
    exchange_timestamp: string;
    is_amo: boolean;
    order_request_id: string;
    order_ref_id: string;
  };
}

export const getOrderDetailsHandler: ToolHandler<{ accessToken: string; orderId: string }> = async (args: { accessToken: string; orderId: string }): Promise<ToolResponse> => {
  const validatedArgs = GetOrderDetailsArgsSchema.parse(args);
  
  const response = await fetch(`${UPSTOX_API_BASE_URL}${UPSTOX_API_ORDER_DETAILS_ENDPOINT}?order_id=${validatedArgs.orderId}`, {
    method: "GET",
    headers: {
      "Accept": HEADERS.ACCEPT,
      "Authorization": `Bearer ${validatedArgs.accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.API_ERROR);
  }

  const data = await response.json() as OrderDetailsResponse;
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(data, null, 2)
    }]
  };
}; 