import { Command } from 'commander';
import { UpstoxService } from '../services';
import { SEGMENT_TYPES } from '../constants';

/**
 * GetFundsMarginCommand - Implements the get-funds-margin command to fetch user funds and margin data from Upstox API
 */
export class GetFundsMarginCommand {
  public static register(program: Command): void {
    program
      .command('get-funds-margin')
      .description('Get user funds and margin information from Upstox API')
      .option('--segment <segment>', 'Optional segment filter (SEC for equity, COM for commodity)')
      .action(async (options) => {
        try {
          // Validate segment if provided
          if (options.segment && 
              options.segment !== SEGMENT_TYPES.EQUITY && 
              options.segment !== SEGMENT_TYPES.COMMODITY) {
            console.error(`Invalid segment: ${options.segment}. Valid values are ${SEGMENT_TYPES.EQUITY} (equity) or ${SEGMENT_TYPES.COMMODITY} (commodity).`);
            return;
          }
          
          // Create the service and fetch the funds and margin data
          const upstoxService = new UpstoxService();
          const response = await upstoxService.getFundsAndMargin(options.segment);
          
          // Output the response as formatted JSON
          console.log(JSON.stringify(response, null, 2));
        } catch (error) {
          console.error('Error fetching funds and margin data:', error instanceof Error ? error.message : String(error));
        }
      });
  }
}