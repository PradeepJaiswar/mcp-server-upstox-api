import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTradesHandler } from "../src/tools/get-trades";

describe("getTradesHandler", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should require an access token", async () => {
    await expect(getTradesHandler({ accessToken: "" }, {})).rejects.toThrow("Access token is required");
  });

  it("should successfully fetch trades", async () => {
    const mockResponse = {
      status: "success",
      data: [
        {
          exchange: "NSE",
          trading_symbol: "RELIANCE",
          instrument_token: "12345",
          order_id: "220728000000001",
          exchange_order_id: "1000000000000000",
          trade_id: "50001",
          exchange_timestamp: "2023-07-28 09:15:00",
          product: "CNC",
          average_price: 2500.50,
          quantity: 10,
          trade_type: "BUY",
          order_ref_id: "abc123",
          order_side: "BUY"
        }
      ],
      metadata: {
        latency: 5
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await getTradesHandler({ accessToken: "valid-token" }, {});
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

    await expect(getTradesHandler({ accessToken: "invalid-token" }, {})).rejects.toThrow("Error occurred while calling Upstox API");
  });

  it("should validate the response data structure", async () => {
    const mockResponse = {
      status: "success",
      data: [
        {
          exchange: "NSE",
          trading_symbol: "RELIANCE",
          instrument_token: "12345",
          order_id: "220728000000001",
          trade_id: "50001",
          exchange_timestamp: "2023-07-28 09:15:00",
          product: "CNC",
          average_price: 2500.50,
          quantity: 10,
          trade_type: "BUY",
          order_side: "BUY"
        }
      ],
      metadata: {
        latency: 5
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await getTradesHandler({ accessToken: "valid-token" }, {});
    const content = result.content[0];
    if (content.type === "text") {
      const parsedData = JSON.parse(content.text);
      expect(parsedData).toHaveProperty("status");
      expect(parsedData).toHaveProperty("data");
      expect(parsedData).toHaveProperty("metadata");
      expect(Array.isArray(parsedData.data)).toBe(true);
      
      const trade = parsedData.data[0];
      expect(trade).toHaveProperty("exchange");
      expect(trade).toHaveProperty("trading_symbol");
      expect(trade).toHaveProperty("order_id");
      expect(trade).toHaveProperty("trade_id");
      expect(trade).toHaveProperty("quantity");
      expect(trade).toHaveProperty("trade_type");
      expect(trade).toHaveProperty("order_side");
    }
  });
}); 