import { z } from "zod";

export type ToolResponse = {
    content: { type: "text"; text: string }[];
};

export type ToolHandler<T> = (params: T, extra: { [key: string]: unknown }) => Promise<ToolResponse>; 