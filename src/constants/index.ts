import { ParseUUIDPipeOptions } from '@nestjs/common';

export const ERR_MESSAGES = {
  USER_NOT_FOUND: 'User is not found',
  OLD_PASSWORD_WRONG: 'Old password is wrong',
  TRACK_NOT_FOUND: 'Track is not found',
};

export const PARSE_UUID_PIPE_OPTIONS: ParseUUIDPipeOptions = { version: '4' };
