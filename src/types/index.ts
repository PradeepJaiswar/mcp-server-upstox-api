import { z } from "zod";

export interface ToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

export interface ToolHandler<T> {
  (args: T): Promise<ToolResponse>;
}

export interface GetProfileArgs {
  accessToken: string;
} 