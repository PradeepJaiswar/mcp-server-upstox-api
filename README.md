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
Use the MCP server at http://localhost:3000 to fetch my Upstox profile information.
```

## Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/get-profile` | GET | Fetch user profile information |
| `/get-funds-margin` | GET | Get funds and margin details (optional query param: `segment`) |

## CLI Examples

The package also includes a CLI for direct interaction:

```bash
# Get user profile
npm start get-profile

# Get funds and margin
npm start get-funds-margin

# Get funds for specific segment (SEC = equity, COM = commodity)
npm start get-funds-margin --segment SEC
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