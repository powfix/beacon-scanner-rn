import React from "react";
import PlatformTouchable from "react-native-platform-touchable";
import { Text, View } from "react-native";
import PropTypes from "prop-types";
import { DeviceWrapper } from "../models/DeviceWrapper";
import StringUtils from "../utils/StringUtils";

export class DeviceComponent extends React.Component {

  static propTypes = {
    device: PropTypes.instanceOf(DeviceWrapper).isRequired,
  }

  state = {
    rssi: null,
  };

  render() {
    return (
      <PlatformTouchable style={{marginVertical: 4}} background={PlatformTouchable.Ripple('#00FF00', false)} onPress={() => this.props.device.marked = !this.props.device.marked}>
        <View style={{flexDirection: 'row', overflow: 'hidden', borderRadius: 8, backgroundColor: '#eaeaea'}}>
          <View style={{alignSelf: 'stretch', width: 10, backgroundColor: this.props.device.marked ? '#FF0000' : 'transparent'}}/>

          <View style={{flex: 1, flexDirection: 'row', paddingVertical: 15, paddingLeft: 10, paddingRight: 18}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>{this.props.device.name}</Text>
              <Text style={{marginTop: 4, fontSize: 14}}>{this.props.device.id}</Text>
            </View>

            <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{alignSelf: 'center', marginLeft: 8, fontSize: 12, fontWeight: 'bold', color: 'black'}}><Text>avg. </Text>{this.props.device.rssiAverage()}</Text>
                <Text style={{alignSelf: 'center', marginLeft: 8, fontSize: 24, fontWeight: 'bold', color: 'black'}}>{this.props.device.rssi}</Text>
              </View>

              <View style={{marginTop: 4, flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text style={{alignSelf: 'center', marginLeft: 8, fontSize: 12, fontWeight: 'bold', color: 'black'}}><Text>🔗 </Text>{this.props.device.isConnectable ? 'YES' : 'NO'}</Text>
                <Text style={{alignSelf: 'center', marginLeft: 8, fontSize: 12, fontWeight: 'bold', color: 'black'}}><Text>🤚 </Text>{StringUtils.numberWithCommas(this.props.device.detected_count) || '-'}회</Text>
                <Text style={{alignSelf: 'center', marginLeft: 8, fontSize: 12, fontWeight: 'bold', color: 'black'}}><Text>⬇ </Text>{this.props.device.rssi_min || '-'}</Text>
                <Text style={{alignSelf: 'center', marginLeft: 8, fontSize: 12, fontWeight: 'bold', color: 'black'}}><Text>⬆ </Text>{this.props.device.rssi_max || '-'}</Text>
              </View>
            </View>
          </View>
        </View>
      </PlatformTouchable>
    )
  }
}
