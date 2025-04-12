import app from "./app";
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getProfileSchema, getProfileHandler, getFundsMarginSchema, getFundsMarginHandler } from "./tools";
import { GetProfileArgs, GetFundsMarginArgs } from "./types";

export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Demo",
		version: "1.0.0",
	});

	async init() {
		this.server.tool("get-profile", getProfileSchema, async (args, extra) => {
			return getProfileHandler(args as GetProfileArgs, extra);
		});
		this.server.tool("get-funds-margin", getFundsMarginSchema, async (args, extra) => {
			return getFundsMarginHandler(args as GetFundsMarginArgs, extra);
		});
	}
}

// Export the MCP server directly
export default MyMCP.mount("/sse");
