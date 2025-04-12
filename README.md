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

### Run the Server

To start the MCP server:
```bash
npm run start
```

Your MCP server will be running at `http://localhost:8787`

## MCP Configuration

### Claude Desktop Configuration

To use this MCP server with Claude Desktop, add the following configuration to your Claude Desktop settings:

```json
{
  "mcpServers": {
    "mcp-server-upstox-api": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:8787/sse"
      ]
    }
  }
}
```

### Cursor MCP Configuration

To use this MCP server with Cursor, add the following configuration to your Cursor MCP settings (usually located at `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "mcp-server-upstox-api": {
      "url": "http://localhost:8787/sse"
    }
  }
}
```

These configurations allow Claude Desktop and Cursor to connect to your local MCP server and use the Upstox API endpoints.

## Using with Claude and Cursor

You can interact with the Upstox API through natural language prompts. Here are some example prompts for each command:

### Profile Information
- "What's my Upstox profile information?"
- "Show me my active segments and products in Upstox"
- "What's my user ID and email in Upstox?"

### Funds and Margin
- "What's my available margin in Upstox?"
- "Show me my equity segment funds and margin details"
- "What's my commodity segment margin availability?"

### Holdings
- "What stocks do I currently hold in Upstox?"
- "Show me my long-term holdings with their current values"
- "What's the total value of my holdings in Upstox?"

### Positions
- "What are my current open positions in Upstox?"
- "Show me my intraday positions with their P&L"
- "What's my total unrealized P&L from current positions?"

### MTF Positions
- "What are my Margin Trade Funding positions?"
- "Show me my MTF positions with their current values"
- "What's the total MTF exposure in my account?"

## Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/get-profile` | GET | Fetch user profile information |
| `/get-funds-margin` | GET | Fetch user funds and margin information. Optional segment parameter can be 'SEC' (Equity) or 'COM' (Commodity) |
| `/get-holdings` | GET | Fetch user long-term holdings information |
| `/get-positions` | GET | Fetch user short-term positions information |
| `/get-mtf-positions` | GET | Fetch user Margin Trade Funding (MTF) positions information |


