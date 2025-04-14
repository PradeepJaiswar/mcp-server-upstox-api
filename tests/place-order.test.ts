import { describe, it, expect, vi, beforeEach } from "vitest";
import { placeOrderHandler } from "../src/tools/place-order";

describe("placeOrderHandler", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should require an access token", async () => {
    const orderData = {
      quantity: 1,
      product: "D",
      validity: "DAY",
      price: 0,
      instrument_token: "NSE_EQ|INE848E01016",
      order_type: "MARKET",
      transaction_type: "BUY"
    };

    await expect(placeOrderHandler({ accessToken: "", ...orderData }, {})).rejects.toThrow("Access token is required");
  });

  it("should validate required fields", async () => {
    const orderData = {
      accessToken: "valid-token",
      quantity: 0, // Invalid quantity
      product: "", // Missing product
      validity: "", // Missing validity
      price: 0,
      instrument_token: "", // Missing instrument token
      order_type: "", // Missing order type
      transaction_type: "" // Missing transaction type
    };

    await expect(placeOrderHandler(orderData, {})).rejects.toThrow("Quantity must be greater than 0");
  });

  it("should successfully place an order", async () => {
    const mockResponse = {
      status: "success",
      data: {
        order_ids: ["1644490272000", "1644490272001", "1644490272003"]
      },
      metadata: {
        latency: 30
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const orderData = {
      accessToken: "valid-token",
      quantity: 1,
      product: "D",
      validity: "DAY",
      price: 0,
      instrument_token: "NSE_EQ|INE848E01016",
      order_type: "MARKET",
      transaction_type: "BUY",
      disclosed_quantity: 0,
      trigger_price: 0,
      is_amo: false,
      slice: true
    };

    const result = await placeOrderHandler(orderData, {});
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

    const orderData = {
      accessToken: "invalid-token",
      quantity: 1,
      product: "D",
      validity: "DAY",
      price: 0,
      instrument_token: "NSE_EQ|INE848E01016",
      order_type: "MARKET",
      transaction_type: "BUY"
    };

    await expect(placeOrderHandler(orderData, {})).rejects.toThrow("Error occurred while calling Upstox API");
  });

  it("should validate the response data structure", async () => {
    const mockResponse = {
      status: "success",
      data: {
        order_ids: ["1644490272000", "1644490272001", "1644490272003"]
      },
      metadata: {
        latency: 30
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const orderData = {
      accessToken: "valid-token",
      quantity: 1,
      product: "D",
      validity: "DAY",
      price: 0,
      instrument_token: "NSE_EQ|INE848E01016",
      order_type: "MARKET",
      transaction_type: "BUY"
    };

    const result = await placeOrderHandler(orderData, {});
    const content = result.content[0];
    if (content.type === "text") {
      const parsedData = JSON.parse(content.text);
      expect(parsedData).toHaveProperty("status");
      expect(parsedData).toHaveProperty("data");
      expect(parsedData).toHaveProperty("metadata");
      expect(parsedData.data).toHaveProperty("order_ids");
      expect(Array.isArray(parsedData.data.order_ids)).toBe(true);
      expect(parsedData.metadata).toHaveProperty("latency");
    }
  });
}); 