import { Button, Platform, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { CenterModal } from "./CenterModal";
import React from "react";
import PropTypes from "prop-types";
import StringUtils from "../utils/StringUtils";
import CheckBox from '@react-native-community/checkbox';
import PlatformTouchable from "react-native-platform-touchable";
import { MAX_RSSI_COUNT } from "../models/DeviceWrapper";

const REFRESH_RATE_MIN = 200;
const REFRESH_RATE_MAX = 10000;

const AVERAGE_POOL_SIZE_MIN = 1;
const AVERAGE_POOL_SIZE_MAX = MAX_RSSI_COUNT;

export class SettingsModal extends React.PureComponent {

  static propTypes = {
    onChangeRefreshRate: PropTypes.func,
    onChangeAveragePoolSize: PropTypes.func,
    onChangeFlushEveryRefresh: PropTypes.func,
    onClose: PropTypes.func,
  };

  state = {
    refresh_rate: 500,
    average_pool_size: 5,
    flushEveryRefresh: false,
  };

  constructor(props) {
    super(props);
    if (props?.refresh_rate) this.state.refresh_rate = props.refresh_rate;
    if (props?.average_pool_size) this.state.average_pool_size = props.average_pool_size;
  }

  onPressSave = () => {
    typeof this.props.onChangeRefreshRate === 'function' && this.props.onChangeRefreshRate(this.state.refresh_rate);
    typeof this.props.onChangeAveragePoolSize === 'function' && this.props.onChangeAveragePoolSize(this.state.average_pool_size);
    typeof this.props.onChangeFlushEveryRefresh === 'function' && this.props.onChangeFlushEveryRefresh(this.state.flushEveryRefresh);
    typeof this.props.onClose === 'function' && this.props.onClose();
  };

  render() {
    return (
      <CenterModal visible={this.props.visible} transparent animationType={'fade'} contentContainerStyle={{backgroundColor: '#333'}}>
        <Text style={{color: '#FFF', fontSize: 16, fontWeight: 'normal', textAlign: 'center'}}>새로고침 주기(Refresh rate)</Text>
        <Slider
          style={{alignSelf: 'stretch'}}
          minimumValue={REFRESH_RATE_MIN}
          maximumValue={REFRESH_RATE_MAX}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          step={100}
          value={this.state.refresh_rate}
          onValueChange={(value) => this.setState({refresh_rate: value})}/>
        <Text style={{color: '#FFF'}}>{StringUtils.numberWithCommas(this.state.refresh_rate)}ms</Text>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CheckBox value={this.state.flushEveryRefresh} onValueChange={(value) => this.setState({flushEveryRefresh: value})}/>
          <PlatformTouchable style={{}} background={PlatformTouchable.Ripple('#000', true)} onPress={() => this.setState((p) => ({ flushEveryRefresh: !p.flushEveryRefresh }))}>
            <Text style={{color: '#FFF'}}>Flush data every refresh</Text>
          </PlatformTouchable>
        </View>

        <Text style={{marginTop: 30, color: '#FFF', fontSize: 16, fontWeight: 'normal', textAlign: 'center'}}>평균값 산출을 위한 RSSI pool size</Text>
        <Slider
          style={{alignSelf: 'stretch'}}
          minimumValue={AVERAGE_POOL_SIZE_MIN}
          maximumValue={AVERAGE_POOL_SIZE_MAX}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          step={1}
          value={this.state.average_pool_size}
          onValueChange={(value) => this.setState({average_pool_size: value})}/>
        <Text style={{color: '#FFF'}}>{StringUtils.numberWithCommas(this.state.average_pool_size)}개</Text>

        <View style={{marginTop: 18, flexDirection: 'row'}}>
          <Button title={'저장'} onPress={this.onPressSave}/>
        </View>
      </CenterModal>
    );
  }
}
