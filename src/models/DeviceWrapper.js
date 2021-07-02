import { Device } from "react-native-ble-plx";
import { action } from "mobx";
import { boundMethod } from "autobind-decorator";

export const MAX_RSSI_COUNT = 10;

export class DeviceWrapper extends Device {
  rssi_log: number[] = [];
  rssi_min: number;
  rssi_max: number;
  detected_count: number = 0;

  constructor(device: Device) {
    super(device);
    this.set(device);
  }

  @action
  @boundMethod
  set(device: Device | Object) {
    ++this.detected_count;

    if (device?.rssi) {
      this.rssi_log.push(device.rssi);
      if (this.rssi_log.length > MAX_RSSI_COUNT) {
        this.rssi_log.splice(0, this.rssi_log.length - MAX_RSSI_COUNT);
      }
    }

    Object.assign(this, device);
  }

  @boundMethod
  rssiAverage(count: number = 5): number {
    const rssi_log = this.rssi_log.slice(count * -1);

    let sum = 0;
    rssi_log.forEach((rssi) => sum += rssi);
    const average = sum / count;
    console.log('rssi_log', rssi_log, average);
    return average;
  }
}
