import { z } from "zod";
import { ToolHandler, ToolResponse, GetProfileArgs } from "../types";
import { 
  UPSTOX_API_BASE_URL, 
  UPSTOX_API_PROFILE_ENDPOINT,
  HEADERS,
  ERROR_MESSAGES
} from "../constants";

export const getProfileSchema = {
  accessToken: z.string().min(1, "Access token is required"),
};

const GetProfileArgsSchema = z.object(getProfileSchema);

interface UpstoxProfileResponse {
  status: string;
  data: {
    email: string;
    exchanges: string[];
    products: string[];
    broker: string;
    user_id: string;
    user_name: string;
    order_types: string[];
    user_type: string;
    poa: boolean;
    ddpi: boolean;
    is_active: boolean;
  };
}

export const getProfileHandler: ToolHandler<GetProfileArgs> = async (args: GetProfileArgs, extra: { [key: string]: unknown }): Promise<ToolResponse> => {
  const validatedArgs = GetProfileArgsSchema.parse(args);
  
  const response = await fetch(`${UPSTOX_API_BASE_URL}${UPSTOX_API_PROFILE_ENDPOINT}`, {
    method: "GET",
    headers: {
      "Accept": HEADERS.ACCEPT,
      "Authorization": `Bearer ${validatedArgs.accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.API_ERROR);
  }

  const data = await response.json() as UpstoxProfileResponse;
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(data, null, 2)
    }]
  };
}; 