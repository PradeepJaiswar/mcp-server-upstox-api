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

# Optional - defaults to 3000
PORT=3000
```

### Run the Server

To start the MCP server:
```bash
npm start
```

Your MCP server will be running at `http://localhost:3000` (or your specified PORT).

## Using with Claude

In your Claude conversation, you can reference this MCP server to interact with the Upstox API:

```
# Profile information
Use the MCP server at http://localhost:3000 to fetch my Upstox profile information.

```

## Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/get-profile` | GET | Fetch user profile 
