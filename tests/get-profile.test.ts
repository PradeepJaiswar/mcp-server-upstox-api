import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProfileHandler } from '../src/tools/get-profile';
import { ToolResponse } from '../src/tools/types';

// Mock the global fetch function
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('get-profile command', () => {
  const accessToken = process.env.UPSTOX_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('UPSTOX_ACCESS_TOKEN is not set in .env file');
  }

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should successfully fetch profile information with valid access token', async () => {
    // Mock successful API response
    const mockApiResponse = {
      ok: true,
      json: async () => ({
        status: 'success',
        data: {
          email: 'test@example.com',
          exchanges: ['NSE', 'BSE'],
          products: ['D', 'I', 'CO', 'O', 'MTF'],
          broker: 'UPSTOX',
          user_id: '12345',
          user_name: 'Test User',
          order_types: ['MARKET', 'LIMIT'],
          user_type: 'individual',
          poa: true,
          ddpi: true,
          is_active: true
        }
      })
    };
    mockFetch.mockResolvedValueOnce(mockApiResponse);

    const response = await getProfileHandler({ accessToken }, {});
    
    expect(response).toHaveProperty('content');
    expect(response.content).toBeInstanceOf(Array);
    expect(response.content[0]).toHaveProperty('type', 'text');
    
    // Parse the JSON string in the response
    const parsedContent = JSON.parse(response.content[0].text);
    expect(parsedContent).toHaveProperty('status', 'success');
    expect(parsedContent.data).toHaveProperty('user_id', '12345');
    expect(parsedContent.data).toHaveProperty('email', 'test@example.com');
    expect(parsedContent.data).toHaveProperty('user_name', 'Test User');
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
      await getProfileHandler({ accessToken: 'invalid_token' }, {});
      // If we reach here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Error occurred while calling Upstox API');
    }
  });

  it('should return profile data in correct format', async () => {
    // Mock successful API response
    const mockApiResponse = {
      ok: true,
      json: async () => ({
        status: 'success',
        data: {
          email: 'test@example.com',
          exchanges: ['NSE', 'BSE'],
          products: ['D', 'I', 'CO', 'O', 'MTF'],
          broker: 'UPSTOX',
          user_id: '12345',
          user_name: 'Test User',
          order_types: ['MARKET', 'LIMIT'],
          user_type: 'individual',
          poa: true,
          ddpi: true,
          is_active: true
        }
      })
    };
    mockFetch.mockResolvedValueOnce(mockApiResponse);

    const response = await getProfileHandler({ accessToken }, {});
    
    expect(response).toHaveProperty('content');
    expect(response.content).toBeInstanceOf(Array);
    expect(response.content[0]).toHaveProperty('type', 'text');
    
    // Parse the JSON string in the response
    const parsedContent = JSON.parse(response.content[0].text);
    expect(parsedContent).toHaveProperty('status', 'success');
    expect(parsedContent).toHaveProperty('data');
    
    const { data } = parsedContent;
    // Check data types
    expect(typeof data.user_id).toBe('string');
    expect(typeof data.email).toBe('string');
    expect(typeof data.user_name).toBe('string');
    expect(Array.isArray(data.exchanges)).toBe(true);
    expect(Array.isArray(data.products)).toBe(true);
    expect(Array.isArray(data.order_types)).toBe(true);
    expect(typeof data.user_type).toBe('string');
    expect(typeof data.poa).toBe('boolean');
    expect(typeof data.ddpi).toBe('boolean');
    expect(typeof data.is_active).toBe('boolean');
  });
}); 