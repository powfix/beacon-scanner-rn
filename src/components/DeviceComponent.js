import React from "react";
import PlatformTouchable from "react-native-platform-touchable";
import { Text, View } from "react-native";
import PropTypes from "prop-types";
import { DeviceWrapper } from "../models/DeviceWrapper";

export class DeviceComponent extends React.Component {

  static propTypes = {
    device: PropTypes.instanceOf(DeviceWrapper).isRequired,
  }

  state = {
    rssi: null,
  };

  render() {
    return (
      <PlatformTouchable style={{borderRadius: 8, backgroundColor: '#eaeaea', marginVertical: 4}} background={PlatformTouchable.Ripple('#00FF00', false)}>
        <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 18}}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <Text style={{fontSize: 16, color: 'black'}}>{this.props.device.name}{this.props.device.name && <Text style={{color: 'red', fontWeight: 'bold'}}>({this.props.device.name})</Text>}</Text>
            <Text style={{fontSize: 12}}>{this.props.device.id}<Text>{this.props.device.detected_count}회</Text></Text>
          </View>

          <View style={{flexDirection: 'column'}}>
            <Text style={{alignSelf: 'center', marginLeft: 8, fontSize: 20, fontWeight: 'bold', color: 'black'}}>{this.props.device.rssi}</Text>
            <Text style={{alignSelf: 'center', marginLeft: 8, fontSize: 12, fontWeight: 'bold', color: 'black'}}><Text>avg. </Text>{this.props.device.rssiAverage()}</Text>

            <View style={{flexDirection: 'row'}}>
              <Text style={{alignSelf: 'center', marginLeft: 8, fontSize: 12, fontWeight: 'bold', color: 'black'}}><Text>⬇ </Text>{this.props.device.rssi_min || '-'}</Text>
              <Text style={{alignSelf: 'center', marginLeft: 8, fontSize: 12, fontWeight: 'bold', color: 'black'}}><Text>⬆ </Text>{this.props.device.rssi_max || '-'}</Text>
            </View>
          </View>
        </View>
      </PlatformTouchable>
    )
  }
}
