import React, { useCallback } from "react";
import {
  Alert,
  FlatList,
  Image,
  PermissionsAndroid, Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { inject } from "mobx-react/src/inject";
import { BleManager, Device, ScanMode } from "react-native-ble-plx";
import { BaseScreen } from "./BaseScreen";
import { DeviceComponent } from "../components/DeviceComponent";
import { DeviceWrapper } from "../models/DeviceWrapper";
import PlatformTouchable from "react-native-platform-touchable";
import { CenterModal } from "../modals/CenterModal";
import Slider from '@react-native-community/slider';
import { SettingsModal } from "../modals/SettingsModal";

class Screen extends BaseScreen {

  bleManager = new BleManager({});
  devices = new Map();

  refresh_rate = 1000;
  flush_rate = 2000;
  average_pool_size = 5;

  lastFlush = new Date().getTime();

  state = {
    is_visible_settings_modal: false,
  };

  componentDidMount() {
    super.componentDidMount();
    this.startScan();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.stopScan();
  }

  onChangeRefreshRate = (value) => {
    console.log('onChangeRefreshRate', value);
    this.refresh_rate = value;
    this.startRefreshing(value);
  };

  onChangeFlushRate = (value) => {
    console.log('onChangeFlushRate', value);
    this.flush_rate = value;
  };

  onChangeAveragePoolSize = (value) => {
    console.log('onChangeAveragePoolSize', value);
    this.average_pool_size = value;
  };

  startRefreshing = (refreshRate = this.refresh_rate) => {
    this.stopRefreshing();
    this.removeRefresHandler = setInterval(() => {
      if (this.hasNewDevices) {
        this.setState({}, () => {
          const current = new Date().getTime();
          const shouldFlush = current - this.lastFlush > this.flush_rate;
          if (shouldFlush) {
            console.info('데이터가 렌더 직후 flushEveryRefresh 플래그에 의해 초기화 되었습니다.');
            this.devices.forEach((device: DeviceWrapper) => {
              device.rssi = null;
              device.rssi_log = [];
              device.rssi_min = undefined;
              device.rssi_max = undefined;
              device.detected_count = 0;
            });
            this.lastFlush = current;
          }
        });
        this.hasNewDevices = false;
      }
    }, refreshRate);
  };

  stopRefreshing = () => {
    clearInterval(this.removeRefresHandler);
  };

  startScan = () => {
    const doNext = () => {
      this.startRefreshing();
      this.bleManager.startDeviceScan([], {scanMode: ScanMode.LowLatency}, (err, scannedDevice) => {
        if (err) return;

        if (scannedDevice?.name?.includes('Plutocon')) {
          console.log('scanned device', `${scannedDevice.id}(${scannedDevice.name})`, scannedDevice.rssi);
        }

        if (this.devices.has(scannedDevice.id)) {
          const device: DeviceWrapper = this.devices.get(scannedDevice.id);
          device.set(scannedDevice);
        } else {
          this.devices.set(scannedDevice.id, new DeviceWrapper(scannedDevice));
        }

        this.hasNewDevices = true;
      });
    };

    if (Platform.OS === 'android') {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((granted) => {
        if (!granted) {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            title: '스캔 기능 시 사용',
            message: '주변의 BLE 기기 스캔 시 사용되는 권한입니다. 승인하지 않을 시 기능을 사용할 수 없습니다.'
          }).then((status) => {
            if (status === 'granted') {
              this.startScan();
            } else {
              Alert.alert('권한이 부여되지 않았습니다. 앱 설정에서 허용해주세요. 이후 앱 재실행 필요.');
            }
          });
          return;
        }

        doNext();
      });
    } else {
      doNext();
    }
  };

  stopScan = () => {
    this.bleManager.stopDeviceScan();
  };

  onPressDevice = () => {
    this.setState({});
  };

  onRefresh = () => {
    this.devices.clear();
    this.setState({});
  };

  onPressSetting = () => {
    this.setState({is_visible_settings_modal: true});
  };

  onPressFlush = () => {
    this.devices.clear();
    this.setState({});
  };

  renderItem = ({item}) => (
    <DeviceComponent device={item} onPress={this.onPressDevice} average_pool_size={this.average_pool_size}/>
  );

  renderSettingModal = () => (
    <SettingsModal
      visible={this.state.is_visible_settings_modal}
      onChangeRefreshRate={this.onChangeRefreshRate}
      onChangeFlushRate={this.onChangeFlushRate}
      onChangeAveragePoolSize={this.onChangeAveragePoolSize}
      onClose={() => this.setState({is_visible_settings_modal: false})}/>
  )

  render() {
    const devices = Array.from(this.devices.values()).sort((d1: DeviceWrapper, d2: DeviceWrapper) => {
      if (d1.marked && !d2.marked) return -1;
      if (!d1.marked && d2.marked) return 1;

      if (d1.rssi_log.length > 0 && d2.rssi_log.length <= 0) return -1;
      if (d2.rssi_log.length > 0 && d1.rssi_log.length <= 0) return 1;

      if (d1.rssiAverage() > d2.rssiAverage()) return -1;
      if (d1.rssiAverage() < d2.rssiAverage()) return 1;

      return d2.rssiAverage() - d1.rssiAverage();
    });

    const enableSwipeRefresh = Platform.OS === 'android';

    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#333'}}>
        <StatusBar backgroundColor={'#000'}/>

        <SafeAreaView style={{alignSelf: 'stretch', backgroundColor: '#000'}} barStyle={'light-content'}>
          <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center', paddingVertical: 10, backgroundColor: '#000'}}>
            <View style={{flex: 1, paddingHorizontal: 18}}>
              <Text style={{color: '#FFF', fontWeight: 'bold', fontSize: 20}}>BLE Scanner</Text>
              <Text style={{color: '#FFF', fontSize: 14}}>기능/개발 문의 개발팀 Asha</Text>
            </View>

            <View style={{flexDirection: 'row', paddingHorizontal: 8}}>
              <TouchableOpacity style={{padding: 8}} background={PlatformTouchable.Ripple('#000', true)} onPress={this.onPressFlush}>
                <Image source={require('../images/ic_delete_white_24px.png')}/>
              </TouchableOpacity>

              <TouchableOpacity style={{padding: 8}} background={PlatformTouchable.Ripple('#000', true)} onPress={this.onPressSetting}>
                <Image source={require('../images/ic_settings_white_24px.png')}/>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <FlatList
          style={{alignSelf: 'stretch'}}
          contentContainerStyle={{flexGrow: 1, paddingTop: 10, paddingBottom: 30, paddingHorizontal: 15}}
          keyExtractor={(item) => item.id}
          data={devices}
          renderItem={this.renderItem}
          onRefresh={enableSwipeRefresh ? this.onRefresh : undefined}
          refreshing={false}/>

        {this.renderSettingModal()}
      </View>
    );
  }
}

export default inject('sessionStore')(Screen);
