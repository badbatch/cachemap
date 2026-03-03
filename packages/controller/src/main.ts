import { constants } from '@cachemap/utils';
import { EventEmitter } from 'eventemitter3';
import { validateArgs } from './helpers/validateArgs.ts';
import { type ControllerEvents, type EventData } from './types.ts';

export class Controller extends EventEmitter<ControllerEvents> {
  public clearCaches(eventData: EventData): void {
    this._dispatch(constants.CLEAR, eventData);
  }

  public startBackups(eventData: EventData): void {
    this._dispatch(constants.START_BACKUP, eventData);
  }

  public startReapers(eventData: EventData): void {
    this._dispatch(constants.START_REAPER, eventData);
  }

  public stopBackups(eventData: EventData): void {
    this._dispatch(constants.STOP_BACKUP, eventData);
  }

  public stopReapers(eventData: EventData): void {
    this._dispatch(constants.STOP_REAPER, eventData);
  }

  private _dispatch(event: keyof ControllerEvents, data: EventData): void {
    validateArgs(data);
    this.emit(event, data);
  }
}

export const createController = (): Controller => new Controller();
