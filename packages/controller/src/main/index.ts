import { CLEAR, START_BACKUP, START_REAPER, STOP_BACKUP, STOP_REAPER } from "@cachemap/constants";
import EventEmitter from "eventemitter3";
import { EventData } from "..";
import validateArgs from "../helpers/validateArgs";

export class Controller extends EventEmitter {
  public clearCaches({ name, type }: EventData = {}): void {
    if (!validateArgs({ name, type })) {
      throw new Error("@cachemap/controller expected event data to include 'name' or 'type' props");
    }

    this.emit(CLEAR, { name, type });
  }

  public startBackups({ name, type }: EventData = {}): void {
    if (!validateArgs({ name, type })) {
      throw new Error("@cachemap/controller expected event data to include 'name' or 'type' props");
    }

    this.emit(START_BACKUP, { name, type });
  }

  public startReapers({ name, type }: EventData = {}): void {
    if (!validateArgs({ name, type })) {
      throw new Error("@cachemap/controller expected event data to include 'name' or 'type' props");
    }

    this.emit(START_REAPER, { name, type });
  }

  public stopBackups({ name, type }: EventData = {}): void {
    if (!validateArgs({ name, type })) {
      throw new Error("@cachemap/controller expected event data to include 'name' or 'type' props");
    }

    this.emit(STOP_BACKUP, { name, type });
  }

  public stopReapers({ name, type }: EventData = {}): void {
    if (!validateArgs({ name, type })) {
      throw new Error("@cachemap/controller expected event data to include 'name' or 'type' props");
    }

    this.emit(STOP_REAPER, { name, type });
  }
}

export const controller = new Controller();

export default controller;
