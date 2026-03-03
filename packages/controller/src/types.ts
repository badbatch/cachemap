import { type constants } from '@cachemap/utils';

export type EventData = { name: string; type?: string } | { name?: string; type: string };

export type ControllerEvents = {
  [constants.CLEAR]: (data: EventData) => void;
  [constants.START_BACKUP]: (data: EventData) => void;
  [constants.START_REAPER]: (data: EventData) => void;
  [constants.STOP_BACKUP]: (data: EventData) => void;
  [constants.STOP_REAPER]: (data: EventData) => void;
};
