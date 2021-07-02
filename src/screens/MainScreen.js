import React, { useCallback } from "react";
import { FlatList, SafeAreaView, StatusBar, Text, View } from "react-native";
import { inject } from "mobx-react/src/inject";
import { BleManager, Device, ScanMode } from "react-native-ble-plx";
import { BaseScreen } from "./BaseScreen";
import { DeviceComponent } from "../components/DeviceComponent";
import { DeviceWrapper } from "../models/DeviceWrapper";

class Screen extends BaseScreen {

  bleManager = new BleManager({});
  devices = new Map();

  state = {
    color: '#000',
  };

  componentDidMount() {
    super.componentDidMount();
    this.startScan();
    this.removeRefresHandler = setInterval(() => {
      if (this.hasNewDevices) {
        this.setState({});
        this.hasNewDevices = false;
      }
    }, 1000);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    clearInterval(this.removeRefresHandler);
    this.stopScan();
  }

  startScan = () => {
    this.bleManager.startDeviceScan([], {scanMode: ScanMode.LowLatency}, (err, scannedDevice) => {
      if (err) return;

      // console.log('scanned device', scannedDevice.id);
      if (this.devices.has(scannedDevice.id)) {
        const device: DeviceWrapper = this.devices.get(scannedDevice.id);
        device.set(scannedDevice);
      } else {
        this.devices.set(scannedDevice.id, new DeviceWrapper(scannedDevice));
      }

      this.hasNewDevices = true;
    });
  };

  stopScan = () => {
    this.bleManager.stopDeviceScan();
  };

  onPressDevice = () => {
    this.setState({});
  };

  renderItem = ({item}) => (
    <DeviceComponent device={item} onPress={this.onPressDevice}/>
  );

  render() {
    const devices = Array.from(this.devices.values()).sort((d1: DeviceWrapper, d2: DeviceWrapper) => {
      if (d1.marked && !d2.marked) return -1;
      if (!d1.marked && d2.marked) return 1;

      if (d1.rssiAverage() > d2.rssiAverage()) return -1;
      if (d1.rssiAverage() < d2.rssiAverage()) return 1;

      return d2.rssiAverage() - d1.rssiAverage();
    });

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#333'}}>
        <StatusBar backgroundColor={'#333'}/>

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <FlatList
            style={{alignSelf: 'stretch'}}
            contentContainerStyle={{flexGrow: 1, paddingTop: 30, paddingBottom: 30, paddingHorizontal: 15}}
            keyExtractor={(item) => item.id}
            data={devices}
            renderItem={this.renderItem}/>
        </View>
      </SafeAreaView>
    );
  }
}

export default inject('sessionStore')(Screen);
