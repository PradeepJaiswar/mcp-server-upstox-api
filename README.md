# mcp-server-upstox-api

A simple MCP server for integrating with the Upstox trading API.

## Quick Start

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mcp-server-upstox-api.git
cd mcp-server-upstox-api
```

2. Install dependencies:
```bash
npm install
```

3. Create an `.env` file in the root directory:
```bash
# Required for authentication with Upstox
UPSTOX_ACCESS_TOKEN=your_upstox_access_token_here

# Optional - defaults to 3000
PORT=3000
```

### Run the Server

To start the MCP server:
```bash
npm run start:server
```

Your MCP server will be running at `http://localhost:3000` (or your specified PORT).

## Using with Claude

In your Claude conversation, you can reference this MCP server to interact with the Upstox API:

```
# Profile information
Use the MCP server at http://localhost:3000 to fetch my Upstox profile information.

# Funds and margin details
Use the MCP server at http://localhost:3000 to get my Upstox funds and margin details.

# Funds for a specific segment
Use the MCP server at http://localhost:3000 to get my Upstox funds for the SEC segment.

# Long-term holdings
Use the MCP server at http://localhost:3000 to fetch my Upstox long-term holdings portfolio.

# Short-term positions
Use the MCP server at http://localhost:3000 to get my Upstox short-term positions.

# Place an order
Use the MCP server at http://localhost:3000 to place a buy order for 1 share of TCS on NSE at market price.
```

## Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/get-profile` | GET | Fetch user profile information |
| `/get-funds-margin` | GET | Get funds and margin details (optional query param: `segment`) |
| `/long-term-holdings` | GET | Fetch long-term holdings portfolio information |
| `/short-term-positions` | GET | Fetch short-term positions information |
| `/place-order` | POST | Place a new order (requires order details in request body) |

## CLI Examples

The package also includes a CLI for direct interaction:

```bash
# Get user profile
npm start get-profile

# Get funds and margin
npm start get-funds-margin

# Get funds for specific segment (SEC = equity, COM = commodity)
npm start get-funds-margin --segment SEC

# Get long-term holdings
npm start long-term-holdings

# Get short-term positions
npm start short-term-positions

# Place a market buy order
npm start place-order --instrument NSE_EQ|INE848E01016 --quantity 1 --transaction BUY

# Place a limit sell order
npm start place-order --instrument NSE_EQ|INE848E01016 --quantity 1 --transaction SELL --type LIMIT --price 500
```

## Example Client Code

```typescript
// Import the client
import { UpstoxClient } from './src/clients/upstox.client';

// Create client instance
const client = new UpstoxClient('http://localhost:3000');

// Get profile
const profile = await client.getProfile();
console.log(profile);
```

See the `examples/` directory for complete demonstrations.