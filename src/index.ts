import app from "./app";
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getProfileSchema, getProfileHandler, getFundsMarginSchema, getFundsMarginHandler, getHoldingsSchema, getHoldingsHandler, getPositionsSchema, getPositionsHandler, getMtfPositionsSchema, getMtfPositionsHandler, getOrderBookSchema, getOrderBookHandler, getOrderDetailsSchema, getOrderDetailsHandler, getTradesSchema, getTradesHandler, getOrderTradesSchema, getOrderTradesHandler, getOrderHistorySchema, getOrderHistoryHandler } from "./tools";
import { GetProfileArgs, GetFundsMarginArgs, GetHoldingsArgs, GetPositionsArgs, GetMtfPositionsArgs, GetOrderDetailsArgs } from "./types";

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
		this.server.tool("get-mtf-positions", getMtfPositionsSchema, async (args, extra) => {
			return getMtfPositionsHandler(args as GetMtfPositionsArgs, extra);
		});
		this.server.tool("get-order-book", getOrderBookSchema, async (args, extra) => {
			return getOrderBookHandler(args as { accessToken: string }, extra);
		});
		this.server.tool("get-order-details", getOrderDetailsSchema, async (args, extra) => {
			return getOrderDetailsHandler(args as GetOrderDetailsArgs, extra);
		});
		this.server.tool("get-trades", getTradesSchema, async (args, extra) => {
			return getTradesHandler(args as { accessToken: string }, extra);
		});
		this.server.tool("get-order-trades", getOrderTradesSchema, async (args, extra) => {
			return getOrderTradesHandler(args as { accessToken: string; orderId: string }, extra);
		});
		this.server.tool("get-order-history", getOrderHistorySchema, async (args, extra) => {
			return getOrderHistoryHandler(args as { accessToken: string; orderId?: string; tag?: string }, extra);
		});
	}
}

// Export the MCP server directly
export default MyMCP.mount("/sse");
