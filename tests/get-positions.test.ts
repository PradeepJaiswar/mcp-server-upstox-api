import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPositionsHandler } from '../src/tools/get-positions';

// Mock the global fetch function
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('get-positions command', () => {
  const accessToken = process.env.UPSTOX_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('UPSTOX_ACCESS_TOKEN is not set in .env file');
  }

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should successfully fetch positions information with valid access token', async () => {
    // Mock successful API response
    const mockApiResponse = {
      ok: true,
      json: async () => ({
        status: 'success',
        data: [
          {
            exchange: 'NSE',
            multiplier: 1,
            value: 250000,
            pnl: 5000,
            product: 'MIS',
            instrument_token: 'NSE:RELIANCE',
            average_price: 2500,
            buy_value: 250000,
            overnight_quantity: 0,
            day_buy_value: 250000,
            day_buy_price: 2500,
            overnight_buy_amount: 0,
            overnight_buy_quantity: 0,
            day_buy_quantity: 100,
            day_sell_value: 0,
            day_sell_price: 0,
            overnight_sell_amount: 0,
            overnight_sell_quantity: 0,
            day_sell_quantity: 0,
            quantity: 100,
            last_price: 2550,
            unrealised: 5000,
            realised: 0,
            sell_value: 0,
            trading_symbol: 'RELIANCE',
            tradingsymbol: 'RELIANCE',
            close_price: 2490,
            buy_price: 2500,
            sell_price: 0
          }
        ]
      })
    };
    mockFetch.mockResolvedValueOnce(mockApiResponse);

    const response = await getPositionsHandler({ accessToken }, {});
    
    expect(response).toHaveProperty('content');
    expect(response.content).toBeInstanceOf(Array);
    expect(response.content[0]).toHaveProperty('type', 'text');
    
    // Parse the JSON string in the response
    const parsedContent = JSON.parse(response.content[0].text);
    expect(parsedContent).toHaveProperty('status', 'success');
    expect(parsedContent.data).toBeInstanceOf(Array);
    expect(parsedContent.data[0]).toHaveProperty('trading_symbol', 'RELIANCE');
    expect(parsedContent.data[0]).toHaveProperty('quantity', 100);
  });

  it('should handle invalid access token', async () => {
    // Mock failed API response
    const mockResponse = {
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    };
    mockFetch.mockResolvedValueOnce(mockResponse);

    try {
      await getPositionsHandler({ accessToken: 'invalid_token' }, {});
      // If we reach here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Error occurred while calling Upstox API');
    }
  });

  it('should return positions data in correct format', async () => {
    // Mock successful API response
    const mockApiResponse = {
      ok: true,
      json: async () => ({
        status: 'success',
        data: [
          {
            exchange: 'NSE',
            multiplier: 1,
            value: 250000,
            pnl: 5000,
            product: 'MIS',
            instrument_token: 'NSE:RELIANCE',
            average_price: 2500,
            buy_value: 250000,
            overnight_quantity: 0,
            day_buy_value: 250000,
            day_buy_price: 2500,
            overnight_buy_amount: 0,
            overnight_buy_quantity: 0,
            day_buy_quantity: 100,
            day_sell_value: 0,
            day_sell_price: 0,
            overnight_sell_amount: 0,
            overnight_sell_quantity: 0,
            day_sell_quantity: 0,
            quantity: 100,
            last_price: 2550,
            unrealised: 5000,
            realised: 0,
            sell_value: 0,
            trading_symbol: 'RELIANCE',
            tradingsymbol: 'RELIANCE',
            close_price: 2490,
            buy_price: 2500,
            sell_price: 0
          }
        ]
      })
    };
    mockFetch.mockResolvedValueOnce(mockApiResponse);

    const response = await getPositionsHandler({ accessToken }, {});
    
    expect(response).toHaveProperty('content');
    expect(response.content).toBeInstanceOf(Array);
    expect(response.content[0]).toHaveProperty('type', 'text');
    
    // Parse the JSON string in the response
    const parsedContent = JSON.parse(response.content[0].text);
    expect(parsedContent).toHaveProperty('status', 'success');
    expect(parsedContent).toHaveProperty('data');
    
    const position = parsedContent.data[0];
    // Check data types
    expect(typeof position.exchange).toBe('string');
    expect(typeof position.multiplier).toBe('number');
    expect(typeof position.value).toBe('number');
    expect(typeof position.pnl).toBe('number');
    expect(typeof position.product).toBe('string');
    expect(typeof position.instrument_token).toBe('string');
    expect(['number', 'object']).toContain(typeof position.average_price);
    expect(typeof position.buy_value).toBe('number');
    expect(typeof position.overnight_quantity).toBe('number');
    expect(typeof position.day_buy_value).toBe('number');
    expect(typeof position.day_buy_price).toBe('number');
    expect(typeof position.overnight_buy_amount).toBe('number');
    expect(typeof position.overnight_buy_quantity).toBe('number');
    expect(typeof position.day_buy_quantity).toBe('number');
    expect(typeof position.day_sell_value).toBe('number');
    expect(typeof position.day_sell_price).toBe('number');
    expect(typeof position.overnight_sell_amount).toBe('number');
    expect(typeof position.overnight_sell_quantity).toBe('number');
    expect(typeof position.day_sell_quantity).toBe('number');
    expect(typeof position.quantity).toBe('number');
    expect(typeof position.last_price).toBe('number');
    expect(typeof position.unrealised).toBe('number');
    expect(typeof position.realised).toBe('number');
    expect(typeof position.sell_value).toBe('number');
    expect(typeof position.trading_symbol).toBe('string');
    expect(typeof position.close_price).toBe('number');
    expect(typeof position.buy_price).toBe('number');
    expect(typeof position.sell_price).toBe('number');
  });
}); 