import app from "./app";
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getProfileSchema, getProfileHandler } from "./tools";

export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Demo",
		version: "1.0.0",
	});

	async init() {
		this.server.tool("get-profile", getProfileSchema, getProfileHandler);
	}
}

// Export the MCP server directly
export default MyMCP.mount("/sse");
