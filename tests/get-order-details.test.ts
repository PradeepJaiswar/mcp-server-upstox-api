import { describe, it, expect, vi, beforeEach } from "vitest";
import { getOrderDetailsHandler } from "../src/tools/get-order-details";

describe("getOrderDetailsHandler", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should require an access token", async () => {
    await expect(getOrderDetailsHandler({ accessToken: "", orderId: "123" }, {})).rejects.toThrow("Access token is required");
  });

  it("should require an order ID", async () => {
    await expect(getOrderDetailsHandler({ accessToken: "valid-token", orderId: "" }, {})).rejects.toThrow("Order ID is required");
  });

  it("should successfully fetch order details", async () => {
    const mockResponse = {
      status: "success",
      data: {
        exchange: "NSE",
        trading_symbol: "RELIANCE",
        instrument_token: "12345",
        placed_by: "TESTUSER",
        order_id: "220728000000001",
        parent_order_id: null,
        order_timestamp: "2023-07-28 09:15:00",
        exchange_order_id: "1000000000000000",
        order_type: "LIMIT",
        average_price: 2500.50,
        trigger_price: 0,
        stop_loss: 0,
        square_off: 0,
        trailing_stop_loss: 0,
        quantity: 10,
        filled_quantity: 10,
        pending_quantity: 0,
        cancelled_quantity: 0,
        status: "COMPLETE",
        is_amo: false,
        valid_date: "2023-07-28",
        order_side: "BUY",
        product: "CNC",
        disclosed_quantity: 0,
        price: 2500.00,
        guid: "abc123"
      },
      metadata: {
        latency: 5
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await getOrderDetailsHandler({ accessToken: "valid-token", orderId: "220728000000001" }, {});
    const content = result.content[0];
    if (content.type === "text") {
      expect(content.text).toBe(JSON.stringify(mockResponse, null, 2));
    }
  });

  it("should handle API errors", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401
    });

    await expect(getOrderDetailsHandler({ accessToken: "invalid-token", orderId: "123" }, {})).rejects.toThrow("Error occurred while calling Upstox API");
  });

  it("should validate the response data structure", async () => {
    const mockResponse = {
      status: "success",
      data: {
        exchange: "NSE",
        trading_symbol: "RELIANCE",
        instrument_token: "12345",
        placed_by: "TESTUSER",
        order_id: "220728000000001",
        order_timestamp: "2023-07-28 09:15:00",
        exchange_order_id: "1000000000000000",
        order_type: "LIMIT",
        average_price: 2500.50,
        quantity: 10,
        filled_quantity: 10,
        status: "COMPLETE",
        order_side: "BUY",
        product: "CNC",
        price: 2500.00
      },
      metadata: {
        latency: 5
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await getOrderDetailsHandler({ accessToken: "valid-token", orderId: "220728000000001" }, {});
    const content = result.content[0];
    if (content.type === "text") {
      const parsedData = JSON.parse(content.text);
      expect(parsedData).toHaveProperty("status");
      expect(parsedData).toHaveProperty("data");
      expect(parsedData).toHaveProperty("metadata");
      
      const order = parsedData.data;
      expect(order).toHaveProperty("exchange");
      expect(order).toHaveProperty("trading_symbol");
      expect(order).toHaveProperty("order_id");
      expect(order).toHaveProperty("status");
      expect(order).toHaveProperty("order_type");
      expect(order).toHaveProperty("quantity");
      expect(order).toHaveProperty("price");
      expect(order).toHaveProperty("order_side");
    }
  });
}); 