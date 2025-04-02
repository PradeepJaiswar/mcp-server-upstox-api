# mcp-server-upstox-api

A library for interacting with the Upstox trading API.

## Usage

### Installation

Install with npm:

```shell
npm install mcp-server-upstox-api
```

Or with yarn:

```shell
yarn add mcp-server-upstox-api
```

### Example Usage

```typescript
// Import the API client
import { UpstoxClient } from 'mcp-server-upstox-api';

// Create a client instance
const client = new UpstoxClient('http://localhost:3000');

// Get user profile
const profileResponse = await client.getProfile();
console.log('Profile Response:', JSON.stringify(profileResponse, null, 2));

// Get funds and margin with an optional segment parameter
const fundsResponse = await client.getFundsAndMargin('SEC');
console.log('Funds Response:', JSON.stringify(fundsResponse, null, 2));
```

## API Reference

### UpstoxClient

The main client for interacting with the Upstox API.

#### `constructor(baseUrl: string)`

Creates a new instance of the Upstox client.

- `baseUrl`: Base URL of the MCP server (e.g., http://localhost:3000)

#### `getProfile(): Promise<UpstoxResponse<UserProfile>>`

Get user profile information from Upstox.

Returns a promise that resolves to a standardized response containing user profile data.

#### `getFundsAndMargin(segment?: string): Promise<UpstoxResponse<FundsAndMargin>>`

Get user funds and margin information from Upstox.

- `segment`: Optional segment filter ('SEC' for equity, 'COM' for commodity)

Returns a promise that resolves to a standardized response containing funds and margin data.

## Server Usage

This package can also be used as a standalone server, providing API endpoints that proxy requests to the Upstox API.

### Starting the Server

```shell
# Install package globally
npm install -g mcp-server-upstox-api

# Set required environment variables
export UPSTOX_ACCESS_TOKEN=your_upstox_access_token_here

# Start the server
mcp-server-upstox --server
```

Or run directly with npx:

```shell
UPSTOX_ACCESS_TOKEN=your_token npx mcp-server-upstox --server
```

### Environment Variables

The server requires the following environment variables:

- `UPSTOX_API_URL`: The base URL for the Upstox API (defaults to https://api.upstox.com)
- `UPSTOX_ACCESS_TOKEN`: Your Upstox API access token
- `PORT`: The port to run the server on (defaults to 3000)

### API Endpoints

When running in server mode, the following endpoints are available:

| Endpoint | Method | Description | Query Parameters |
|----------|--------|-------------|-----------------|
| `/get-profile` | GET | Retrieve user profile information | None |
| `/get-funds-margin` | GET | Retrieve funds and margin details | `segment` (optional) |
| `/:command` | POST | Generic command endpoint | Command-specific body parameters |

## CLI Usage

The package also provides a command-line interface for direct interaction with the Upstox API.

### Commands

```shell
# Get user profile
npx mcp-server-upstox get-profile

# Get funds and margin information
npx mcp-server-upstox get-funds-margin

# Get funds and margin for a specific segment
npx mcp-server-upstox get-funds-margin --segment SEC
```

## Error Handling

All API responses follow a standardized format:

### Success Response

```json
{
  "status": "success",
  "data": {
    // Response data specific to the endpoint
  }
}
```

### Error Response

```json
{
  "status": "error",
  "errors": [
    {
      "error_code": "ERROR_CODE",
      "message": "Detailed error message",
      "property_path": "field_name",
      "invalid_value": "value_causing_error"
    }
  ]
}
```

## Development

### Setup

```shell
# Clone the repository
git clone https://github.com/yourusername/mcp-server-upstox-api.git

# Navigate to project directory
cd mcp-server-upstox-api

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Upstox API credentials
```

### Running Locally

```shell
# Start the server
npm run start:server

# Run a CLI command
npm start get-profile
```

## License

MIT