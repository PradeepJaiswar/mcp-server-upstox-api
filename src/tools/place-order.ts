import { z } from "zod";
import { UPSTOX_API_BASE_URL, UPSTOX_API_PLACE_ORDER_ENDPOINT, HEADERS } from "../constants";
import { PlaceOrderArgs, ToolResponse } from "../types";

export const placeOrderSchema = {
  accessToken: z.string().min(1, "Access token is required"),
  quantity: z.number().min(1, "Quantity must be greater than 0"),
  product: z.string().min(1, "Product is required"),
  validity: z.string().min(1, "Validity is required"),
  price: z.number(),
  instrument_token: z.string().min(1, "Instrument token is required"),
  order_type: z.string().min(1, "Order type is required"),
  transaction_type: z.string().min(1, "Transaction type is required"),
  disclosed_quantity: z.number().optional(),
  trigger_price: z.number().optional(),
  is_amo: z.boolean().optional(),
  slice: z.boolean().optional(),
  tag: z.string().optional(),
};

export async function placeOrderHandler(args: PlaceOrderArgs, extra: { [key: string]: unknown }): Promise<ToolResponse> {
  const validatedArgs = z.object(placeOrderSchema).parse(args);

  try {
    const response = await fetch(`${UPSTOX_API_BASE_URL}${UPSTOX_API_PLACE_ORDER_ENDPOINT}`, {
      method: "POST",
      headers: {
        ...HEADERS,
        Authorization: `Bearer ${validatedArgs.accessToken}`,
      },
      body: JSON.stringify({
        quantity: validatedArgs.quantity,
        product: validatedArgs.product,
        validity: validatedArgs.validity,
        price: validatedArgs.price,
        instrument_token: validatedArgs.instrument_token,
        order_type: validatedArgs.order_type,
        transaction_type: validatedArgs.transaction_type,
        disclosed_quantity: validatedArgs.disclosed_quantity,
        trigger_price: validatedArgs.trigger_price,
        is_amo: validatedArgs.is_amo,
        slice: validatedArgs.slice,
        tag: validatedArgs.tag,
      }),
    });

    if (!response.ok) {
      throw new Error("Error occurred while calling Upstox API");
    }

    const data = await response.json();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
} 