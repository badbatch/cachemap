import { ArgsError, constants } from '@cachemap/utils';
import { EventEmitter } from 'eventemitter3';
import { validateArgs } from '../helpers/validateArgs.ts';
import { type EventData } from '../types.ts';

export class Controller extends EventEmitter {
  public clearCaches({ name, type }: EventData = {}): void {
    if (!validateArgs({ name, type })) {
      throw new ArgsError("@cachemap/controller expected event data to include 'name' or 'type' props.");
    }

    this.emit(constants.CLEAR, { name, type });
  }

  public startBackups({ name, type }: EventData = {}): void {
    if (!validateArgs({ name, type })) {
      throw new ArgsError("@cachemap/controller expected event data to include 'name' or 'type' props.");
    }

    this.emit(constants.START_BACKUP, { name, type });
  }

  public startReapers({ name, type }: EventData = {}): void {
    if (!validateArgs({ name, type })) {
      throw new ArgsError("@cachemap/controller expected event data to include 'name' or 'type' props.");
    }

    this.emit(constants.START_REAPER, { name, type });
  }

  public stopBackups({ name, type }: EventData = {}): void {
    if (!validateArgs({ name, type })) {
      throw new ArgsError("@cachemap/controller expected event data to include 'name' or 'type' props.");
    }

    this.emit(constants.STOP_BACKUP, { name, type });
  }

  public stopReapers({ name, type }: EventData = {}): void {
    if (!validateArgs({ name, type })) {
      throw new ArgsError("@cachemap/controller expected event data to include 'name' or 'type' props.");
    }

    this.emit(constants.STOP_REAPER, { name, type });
  }
}

export const instance = new Controller();
