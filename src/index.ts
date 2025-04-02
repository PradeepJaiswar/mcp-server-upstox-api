import 'dotenv/config';
import { Command } from 'commander';
import express from 'express';
import bodyParser from 'body-parser';
import { commands } from './commands';
import { UpstoxService } from './services/upstox.service';
import { 
  APP_INFO, 
  CLI_FLAGS, 
  CLIENT_CONFIG, 
  ENDPOINTS, 
  API_RESPONSE_STATUS, 
  ERROR_CODES, 
  ERROR_MESSAGES 
} from './constants';

// Initialize the program for CLI
const program = new Command();
program
  .name(APP_INFO.NAME)
  .description(APP_INFO.DESCRIPTION)
  .version(APP_INFO.VERSION);

// Register all commands
commands.forEach(command => command.register(program));

// Start HTTP server if in server mode
if (process.argv.includes(CLI_FLAGS.SERVER) || process.argv.includes(CLI_FLAGS.SERVER_SHORT)) {
  const app = express();
  const port = process.env.PORT || CLIENT_CONFIG.DEFAULT_PORT;
  
  // Middleware
  app.use(bodyParser.json());
  
  // API routes
  const upstoxService = new UpstoxService();
  
  // Get profile endpoint
  app.get(ENDPOINTS.GET_PROFILE, async (req, res) => {
    try {
      const profileResponse = await upstoxService.getProfile();
      res.json(profileResponse);
    } catch (error) {
      // This should not typically happen as the service now handles errors in a standardized way
      res.status(500).json({
        status: API_RESPONSE_STATUS.ERROR,
        errors: [{
          error_code: ERROR_CODES.INTERNAL_SERVER_ERROR,
          message: error instanceof Error ? error.message : String(error),
          property_path: null,
          invalid_value: null
        }]
      });
    }
  });
  
  // Get funds and margin endpoint
  app.get(ENDPOINTS.GET_FUNDS_MARGIN, async (req, res) => {
    try {
      // Extract segment parameter from query if present
      const segment = req.query.segment as string | undefined;
      const fundsMarginResponse = await upstoxService.getFundsAndMargin(segment);
      res.json(fundsMarginResponse);
    } catch (error) {
      res.status(500).json({
        status: API_RESPONSE_STATUS.ERROR,
        errors: [{
          error_code: ERROR_CODES.INTERNAL_SERVER_ERROR,
          message: error instanceof Error ? error.message : String(error),
          property_path: null,
          invalid_value: null
        }]
      });
    }
  });
  
  // Get long-term holdings endpoint
  app.get(ENDPOINTS.LONG_TERM_HOLDINGS, async (req, res) => {
    try {
      const holdingsResponse = await upstoxService.getLongTermHoldings();
      res.json(holdingsResponse);
    } catch (error) {
      res.status(500).json({
        status: API_RESPONSE_STATUS.ERROR,
        errors: [{
          error_code: ERROR_CODES.INTERNAL_SERVER_ERROR,
          message: error instanceof Error ? error.message : String(error),
          property_path: null,
          invalid_value: null
        }]
      });
    }
  });
  
  // Generic command endpoint
  app.post('/:command', async (req, res) => {
    const command = req.params.command;
    const params = req.body;
    
    // Execute command logic based on the command name
    try {
      if (command === 'get-profile') {
        const profile = await upstoxService.getProfile();
        res.json(profile);
      } else if (command === 'get-funds-margin') {
        const segment = params.segment;
        const fundsMargin = await upstoxService.getFundsAndMargin(segment);
        res.json(fundsMargin);
      } else if (command === 'long-term-holdings') {
        const holdings = await upstoxService.getLongTermHoldings();
        res.json(holdings);
      } else {
        res.status(404).json({ 
          status: API_RESPONSE_STATUS.ERROR,
          errors: [{
            error_code: ERROR_CODES.COMMAND_NOT_FOUND,
            message: ERROR_MESSAGES.COMMAND_NOT_FOUND(command),
            property_path: null,
            invalid_value: null
          }]
        });
      }
    } catch (error) {
      res.status(500).json({
        status: API_RESPONSE_STATUS.ERROR,
        errors: [{
          error_code: ERROR_CODES.INTERNAL_SERVER_ERROR,
          message: error instanceof Error ? error.message : String(error),
          property_path: null,
          invalid_value: null
        }]
      });
    }
  });
  
  // Start server
  app.listen(port, () => {
    console.log(`MCP Service server running on port ${port}`);
  });
} else {
  // Parse command line arguments for CLI mode
  program.parse(process.argv);
  
  // Display help by default if no command is specified
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}