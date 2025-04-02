import { GetProfileCommand } from './get-profile.command';
import { GetFundsMarginCommand } from './get-funds-margin.command';
import { LongTermHoldingsCommand } from './long-term-holdings.command';
import { ShortTermPositionsCommand } from './short-term-positions.command';

export const commands = [
  GetProfileCommand,
  GetFundsMarginCommand,
  LongTermHoldingsCommand,
  ShortTermPositionsCommand
];