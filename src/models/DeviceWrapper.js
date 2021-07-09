import { Device } from "react-native-ble-plx";
import { action } from "mobx";
import { boundMethod } from "autobind-decorator";

export const MAX_RSSI_COUNT = 100;

export class DeviceWrapper extends Device {
  rssi_log: number[] = [];
  rssi_min: number;
  rssi_max: number;
  detected_count: number = 0;
  marked: boolean = false;

  constructor(device: Device) {
    super(device);
    this.set(device);
  }

  @boundMethod
  set(device: Device | Object) {
    ++this.detected_count;

    this.pushRSSI(device?.rssi);

    const properties = {};
    if (!device.name) properties.name = this.name;

    Object.assign(this, { ...device, ...properties });
  }

  @boundMethod
  pushRSSI(rssi: number) {
    if (!rssi) return;
    if (rssi > 0) {
      console.warn(this.id, 'RSSI is Greater than zero', rssi);
      return;
    }

    this.rssi_log.push(rssi);
    if (this.rssi_log.length > MAX_RSSI_COUNT) {
      this.rssi_log.splice(0, this.rssi_log.length - MAX_RSSI_COUNT);
    }

    if (!this.rssi_max || (rssi > this.rssi_max)) this.rssi_max = rssi;
    if (!this.rssi_min || (this.rssi_min > rssi)) this.rssi_min = rssi;
  }

  @boundMethod
  rssiAverage(count: number = 5, digits: number): number {
    const rssi_log = this.rssi_log.slice(count * -1);

    let sum = 0;
    rssi_log.forEach((rssi) => sum += rssi);

    const average = sum / rssi_log.length;

    if (typeof digits !== 'number') return average;
    return average.toFixed(digits);
  }
}
