import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getHoldingsHandler } from '../src/tools/get-holdings';

// Mock the global fetch function
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('get-holdings command', () => {
  const accessToken = process.env.UPSTOX_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('UPSTOX_ACCESS_TOKEN is not set in .env file');
  }

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should successfully fetch holdings information with valid access token', async () => {
    // Mock successful API response
    const mockApiResponse = {
      ok: true,
      json: async () => ({
        status: 'success',
        data: [
          {
            isin: 'INE669E01016',
            cnc_used_quantity: 10,
            collateral_type: 'EQUITY',
            company_name: 'RELIANCE INDUSTRIES LTD',
            haircut: 0.5,
            product: 'CNC',
            quantity: 10,
            trading_symbol: 'RELIANCE',
            tradingsymbol: 'RELIANCE',
            last_price: 2500.50,
            close_price: 2490.75,
            pnl: 98.50,
            day_change: 9.75,
            day_change_percentage: 0.39,
            instrument_token: 'NSE:RELIANCE',
            average_price: 2402.00,
            collateral_quantity: 5,
            collateral_update_quantity: 0,
            t1_quantity: 0,
            exchange: 'NSE'
          }
        ]
      })
    };
    mockFetch.mockResolvedValueOnce(mockApiResponse);

    const response = await getHoldingsHandler({ accessToken }, {});
    
    expect(response).toHaveProperty('content');
    expect(response.content).toBeInstanceOf(Array);
    expect(response.content[0]).toHaveProperty('type', 'text');
    
    // Parse the JSON string in the response
    const parsedContent = JSON.parse(response.content[0].text);
    expect(parsedContent).toHaveProperty('status', 'success');
    expect(parsedContent.data).toBeInstanceOf(Array);
    expect(parsedContent.data[0]).toHaveProperty('isin', 'INE669E01016');
    expect(parsedContent.data[0]).toHaveProperty('company_name', 'RELIANCE INDUSTRIES LTD');
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
      await getHoldingsHandler({ accessToken: 'invalid_token' }, {});
      // If we reach here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Error occurred while calling Upstox API');
    }
  });

  it('should return holdings data in correct format', async () => {
    // Mock successful API response
    const mockApiResponse = {
      ok: true,
      json: async () => ({
        status: 'success',
        data: [
          {
            isin: 'INE669E01016',
            cnc_used_quantity: 10,
            collateral_type: 'EQUITY',
            company_name: 'RELIANCE INDUSTRIES LTD',
            haircut: 0.5,
            product: 'CNC',
            quantity: 10,
            trading_symbol: 'RELIANCE',
            tradingsymbol: 'RELIANCE',
            last_price: 2500.50,
            close_price: 2490.75,
            pnl: 98.50,
            day_change: 9.75,
            day_change_percentage: 0.39,
            instrument_token: 'NSE:RELIANCE',
            average_price: 2402.00,
            collateral_quantity: 5,
            collateral_update_quantity: 0,
            t1_quantity: 0,
            exchange: 'NSE'
          }
        ]
      })
    };
    mockFetch.mockResolvedValueOnce(mockApiResponse);

    const response = await getHoldingsHandler({ accessToken }, {});
    
    expect(response).toHaveProperty('content');
    expect(response.content).toBeInstanceOf(Array);
    expect(response.content[0]).toHaveProperty('type', 'text');
    
    // Parse the JSON string in the response
    const parsedContent = JSON.parse(response.content[0].text);
    expect(parsedContent).toHaveProperty('status', 'success');
    expect(parsedContent).toHaveProperty('data');
    
    const holding = parsedContent.data[0];
    // Check data types
    expect(typeof holding.isin).toBe('string');
    expect(typeof holding.cnc_used_quantity).toBe('number');
    expect(typeof holding.collateral_type).toBe('string');
    expect(typeof holding.company_name).toBe('string');
    expect(typeof holding.haircut).toBe('number');
    expect(typeof holding.product).toBe('string');
    expect(typeof holding.quantity).toBe('number');
    expect(typeof holding.trading_symbol).toBe('string');
    expect(typeof holding.last_price).toBe('number');
    expect(typeof holding.close_price).toBe('number');
    expect(typeof holding.pnl).toBe('number');
    expect(typeof holding.day_change).toBe('number');
    expect(typeof holding.day_change_percentage).toBe('number');
    expect(typeof holding.instrument_token).toBe('string');
    expect(typeof holding.average_price).toBe('number');
    expect(typeof holding.collateral_quantity).toBe('number');
    expect(typeof holding.collateral_update_quantity).toBe('number');
    expect(typeof holding.t1_quantity).toBe('number');
    expect(typeof holding.exchange).toBe('string');
  });
}); 