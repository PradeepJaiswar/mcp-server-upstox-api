import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFundsMarginHandler } from '../src/tools/get-funds-margin';
import { MARKET_SEGMENTS } from '../src/constants';

// Mock the global fetch function
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('get-funds-margin command', () => {
  const accessToken = process.env.UPSTOX_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('UPSTOX_ACCESS_TOKEN is not set in .env file');
  }

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should successfully fetch funds and margin information with valid access token', async () => {
    // Mock successful API response
    const mockApiResponse = {
      ok: true,
      json: async () => ({
        status: 'success',
        data: {
          equity: {
            used_margin: 10000,
            payin_amount: 50000,
            span_margin: 8000,
            adhoc_margin: 2000,
            notional_cash: 40000,
            available_margin: 30000,
            exposure_margin: 5000
          },
          commodity: {
            used_margin: 5000,
            payin_amount: 25000,
            span_margin: 4000,
            adhoc_margin: 1000,
            notional_cash: 20000,
            available_margin: 15000,
            exposure_margin: 2500
          }
        }
      })
    };
    mockFetch.mockResolvedValueOnce(mockApiResponse);

    const response = await getFundsMarginHandler({ accessToken }, {});
    
    expect(response).toHaveProperty('content');
    expect(response.content).toBeInstanceOf(Array);
    expect(response.content[0]).toHaveProperty('type', 'text');
    
    // Parse the JSON string in the response
    const parsedContent = JSON.parse(response.content[0].text);
    expect(parsedContent).toHaveProperty('status', 'success');
    expect(parsedContent.data).toHaveProperty('equity');
    expect(parsedContent.data).toHaveProperty('commodity');
  });

  it('should fetch funds and margin for specific segment when provided', async () => {
    // Mock successful API response for equity segment
    const mockApiResponse = {
      ok: true,
      json: async () => ({
        status: 'success',
        data: {
          equity: {
            used_margin: 10000,
            payin_amount: 50000,
            span_margin: 8000,
            adhoc_margin: 2000,
            notional_cash: 40000,
            available_margin: 30000,
            exposure_margin: 5000
          }
        }
      })
    };
    mockFetch.mockResolvedValueOnce(mockApiResponse);

    const response = await getFundsMarginHandler({ 
      accessToken, 
      segment: MARKET_SEGMENTS.EQUITY 
    }, {});
    
    expect(response).toHaveProperty('content');
    expect(response.content).toBeInstanceOf(Array);
    expect(response.content[0]).toHaveProperty('type', 'text');
    
    // Parse the JSON string in the response
    const parsedContent = JSON.parse(response.content[0].text);
    expect(parsedContent).toHaveProperty('status', 'success');
    expect(parsedContent.data).toHaveProperty('equity');
    expect(parsedContent.data).not.toHaveProperty('commodity');
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
      await getFundsMarginHandler({ accessToken: 'invalid_token' }, {});
      // If we reach here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Error occurred while calling Upstox API');
    }
  });

  it('should return funds and margin data in correct format', async () => {
    // Mock successful API response
    const mockApiResponse = {
      ok: true,
      json: async () => ({
        status: 'success',
        data: {
          equity: {
            used_margin: 10000,
            payin_amount: 50000,
            span_margin: 8000,
            adhoc_margin: 2000,
            notional_cash: 40000,
            available_margin: 30000,
            exposure_margin: 5000
          }
        }
      })
    };
    mockFetch.mockResolvedValueOnce(mockApiResponse);

    const response = await getFundsMarginHandler({ accessToken }, {});
    
    expect(response).toHaveProperty('content');
    expect(response.content).toBeInstanceOf(Array);
    expect(response.content[0]).toHaveProperty('type', 'text');
    
    // Parse the JSON string in the response
    const parsedContent = JSON.parse(response.content[0].text);
    expect(parsedContent).toHaveProperty('status', 'success');
    expect(parsedContent).toHaveProperty('data');
    
    const { data } = parsedContent;
    if (data.equity) {
      // Check data types for equity segment
      expect(typeof data.equity.used_margin).toBe('number');
      expect(typeof data.equity.payin_amount).toBe('number');
      expect(typeof data.equity.span_margin).toBe('number');
      expect(typeof data.equity.adhoc_margin).toBe('number');
      expect(typeof data.equity.notional_cash).toBe('number');
      expect(typeof data.equity.available_margin).toBe('number');
      expect(typeof data.equity.exposure_margin).toBe('number');
    }
    
    if (data.commodity) {
      // Check data types for commodity segment
      expect(typeof data.commodity.used_margin).toBe('number');
      expect(typeof data.commodity.payin_amount).toBe('number');
      expect(typeof data.commodity.span_margin).toBe('number');
      expect(typeof data.commodity.adhoc_margin).toBe('number');
      expect(typeof data.commodity.notional_cash).toBe('number');
      expect(typeof data.commodity.available_margin).toBe('number');
      expect(typeof data.commodity.exposure_margin).toBe('number');
    }
  });
}); 