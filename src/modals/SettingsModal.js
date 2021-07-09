import { Button, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { CenterModal } from "./CenterModal";
import React from "react";
import PropTypes from "prop-types";
import StringUtils from "../utils/StringUtils";

const REFRESH_RATE_MIN = 200;
const REFRESH_RATE_MAX = 10000;

const AVERAGE_POOL_SIZE_MIN = 1;
const AVERAGE_POOL_SIZE_MAX = 20;

export class SettingsModal extends React.PureComponent {

  static propTypes = {
    onChangeRefreshRate: PropTypes.func,
    onChangeAveragePoolSize: PropTypes.func,
    onClose: PropTypes.func,
  };

  state = {
    refresh_rate: 1000,
    average_pool_size: 5,
  };

  constructor(props) {
    super(props);
    if (props?.refresh_rate) this.state.refresh_rate = props.refresh_rate;
    if (props?.average_pool_size) this.state.average_pool_size = props.average_pool_size;
  }

  onPressSave = () => {
    typeof this.props.onChangeRefreshRate === 'function' && this.props.onChangeRefreshRate(this.state.refresh_rate);
    typeof this.props.onChangeAveragePoolSize === 'function' && this.props.onChangeAveragePoolSize(this.state.average_pool_size);
    typeof this.props.onClose === 'function' && this.props.onClose();
  };

  render() {
    return (
      <CenterModal visible={this.props.visible} transparent animationType={'fade'} contentContainerStyle={{backgroundColor: '#333'}}>
        <Text style={{color: '#FFF', fontSize: 16, fontWeight: 'normal', textAlign: 'center'}}>새로고침 주기(Refresh rate)</Text>
        <Slider
          style={{width: 200, height: 40}}
          minimumValue={REFRESH_RATE_MIN}
          maximumValue={REFRESH_RATE_MAX}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          step={100}
          value={this.state.refresh_rate}
          onValueChange={(value) => this.setState({refresh_rate: value})}/>
        <Text style={{color: '#FFF'}}>{StringUtils.numberWithCommas(this.state.refresh_rate)}ms</Text>

        <Text style={{marginTop: 30, color: '#FFF', fontSize: 16, fontWeight: 'normal', textAlign: 'center'}}>평균값 샘플 개수{'\n'}(RSSI pool size when calc average)</Text>
        <Slider
          style={{width: 200, height: 40}}
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
