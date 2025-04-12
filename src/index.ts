import app from "./app";
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getProfileSchema, getProfileHandler, getFundsMarginSchema, getFundsMarginHandler, getHoldingsSchema, getHoldingsHandler, getPositionsSchema, getPositionsHandler } from "./tools";
import { GetProfileArgs, GetFundsMarginArgs, GetHoldingsArgs, GetPositionsArgs } from "./types";

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
		this.server.tool("get-holdings", getHoldingsSchema, async (args, extra) => {
			return getHoldingsHandler(args as GetHoldingsArgs, extra);
		});
		this.server.tool("get-positions", getPositionsSchema, async (args, extra) => {
			return getPositionsHandler(args as GetPositionsArgs, extra);
		});
	}
}

// Export the MCP server directly
export default MyMCP.mount("/sse");
