import { CLEAR, START, STOP } from "@cachemap/constants";
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

  public startReapers({ name, type }: EventData = {}): void {
    if (!validateArgs({ name, type })) {
      throw new Error("@cachemap/controller expected event data to include 'name' or 'type' props");
    }

    this.emit(START, { name, type });
  }

  public stopReapers({ name, type }: EventData = {}): void {
    if (!validateArgs({ name, type })) {
      throw new Error("@cachemap/controller expected event data to include 'name' or 'type' props");
    }

    this.emit(STOP, { name, type });
  }
}

export default new Controller();
