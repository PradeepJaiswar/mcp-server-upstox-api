import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMtfPositionsHandler } from "../src/tools/get-mtf-positions";

describe("getMtfPositionsHandler", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should require an access token", async () => {
    await expect(getMtfPositionsHandler({ accessToken: "" }, {})).rejects.toThrow("Access token is required");
  });

  it("should successfully fetch MTF positions", async () => {
    const mockResponse = {
      status: "success",
      data: [
        {
          exchange: "NSE",
          multiplier: 1,
          value: 10000,
          pnl: 500,
          product: "MIS",
          instrument_token: "12345",
          average_price: 100,
          buy_value: 10000,
          overnight_quantity: 0,
          day_buy_value: 10000,
          day_buy_price: 100,
          overnight_buy_amount: 0,
          overnight_buy_quantity: 0,
          day_buy_quantity: 100,
          day_sell_value: 0,
          day_sell_price: 0,
          overnight_sell_amount: 0,
          overnight_sell_quantity: 0,
          day_sell_quantity: 0,
          quantity: 100,
          last_price: 105,
          unrealised: 500,
          realised: 0,
          sell_value: 0,
          trading_symbol: "RELIANCE",
          close_price: 105,
          buy_price: 100,
          sell_price: 0
        }
      ],
      metadata: {
        latency: 100
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await getMtfPositionsHandler({ accessToken: "valid-token" }, {});
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

    await expect(getMtfPositionsHandler({ accessToken: "invalid-token" }, {})).rejects.toThrow("Error occurred while calling Upstox API");
  });

  it("should validate the response data structure", async () => {
    const mockResponse = {
      status: "success",
      data: [
        {
          exchange: "NSE",
          multiplier: 1,
          value: 10000,
          pnl: 500,
          product: "MIS",
          instrument_token: "12345",
          average_price: 100,
          buy_value: 10000,
          overnight_quantity: 0,
          day_buy_value: 10000,
          day_buy_price: 100,
          overnight_buy_amount: 0,
          overnight_buy_quantity: 0,
          day_buy_quantity: 100,
          day_sell_value: 0,
          day_sell_price: 0,
          overnight_sell_amount: 0,
          overnight_sell_quantity: 0,
          day_sell_quantity: 0,
          quantity: 100,
          last_price: 105,
          unrealised: 500,
          realised: 0,
          sell_value: 0,
          trading_symbol: "RELIANCE",
          close_price: 105,
          buy_price: 100,
          sell_price: 0
        }
      ],
      metadata: {
        latency: 100
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await getMtfPositionsHandler({ accessToken: "valid-token" }, {});
    const content = result.content[0];
    if (content.type === "text") {
      const parsedData = JSON.parse(content.text);
      expect(parsedData).toHaveProperty("status");
      expect(parsedData).toHaveProperty("data");
      expect(parsedData).toHaveProperty("metadata");
      expect(Array.isArray(parsedData.data)).toBe(true);
      expect(parsedData.data[0]).toHaveProperty("exchange");
      expect(parsedData.data[0]).toHaveProperty("trading_symbol");
      expect(parsedData.data[0]).toHaveProperty("quantity");
    }
  });
}); 