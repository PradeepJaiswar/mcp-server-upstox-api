import { ENVIRONMENTS, UPSTOX_API } from '../constants';

export const config = {
  appName: 'mcp-service',
  version: '1.0.0',
  environment: process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT,
  upstox: {
    apiUrl: process.env.UPSTOX_API_URL || UPSTOX_API.DEFAULT_URL,
    accessToken: process.env.UPSTOX_ACCESS_TOKEN || '',
  }
};