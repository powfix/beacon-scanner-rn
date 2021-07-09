import React from "react";
import PlatformTouchable from "react-native-platform-touchable";
import { Text, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import { DeviceWrapper } from "../models/DeviceWrapper";
import StringUtils from "../utils/StringUtils";

export class DeviceComponent extends React.Component {

  static propTypes = {
    device: PropTypes.instanceOf(DeviceWrapper).isRequired,
    onPress: PropTypes.func,
  }

  state = {
    rssi: null,
  };

  onPress = () => {
    this.props.device.marked = !this.props.device.marked;
    typeof this.props.onPress === 'function' && this.props.onPress(this.props.device);
  };

  render() {
    const averageText = this.props.device.rssi_log.length >= this.props.average_pool_size ? `avg(${this.props.average_pool_size})` : `avg(${this.props.device.rssi_log.length}/${this.props.average_pool_size})`;

    return (
      <TouchableOpacity style={{marginVertical: 4}} background={PlatformTouchable.Ripple('#00FF00', false)} onPress={this.onPress}>
        <View style={{flexDirection: 'row', alignItems: 'center', overflow: 'hidden', borderRadius: 8, backgroundColor: '#eaeaea'}}>
          <View style={{alignSelf: 'stretch', width: 10, backgroundColor: this.props.device.marked ? '#FF0000' : 'transparent'}}/>

          <View style={{flex: 1, flexDirection: 'row', paddingVertical: 15, paddingLeft: 10, paddingRight: 18}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Text style={{fontSize: 18, color: this.props.device.name ? '#000' : '#AAA', fontWeight: 'bold'}}>{this.props.device.name || '이름없음'}</Text>
              <Text style={{marginTop: 4, fontSize: 14}}>{this.props.device.id}</Text>
            </View>

            <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{alignSelf: 'center', marginLeft: 8, fontSize: 12, fontWeight: 'bold', color: 'black'}}><Text>{averageText}. </Text>{this.props.device.rssiAverage(this.props.average_pool_size)}</Text>
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
      </TouchableOpacity>
    )
  }
}
