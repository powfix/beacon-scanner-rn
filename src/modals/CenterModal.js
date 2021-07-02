import { Dimensions, Modal, TouchableWithoutFeedback, View } from "react-native";
import React from "react";
import PropTypes from "prop-types";

export class CenterModal extends Modal {

  static propTypes = {
    onPressOutSide: PropTypes.func,
    containerStyle: PropTypes.object,
    contentContainerStyle: PropTypes.object,
  };

  render() {
    return (
      <Modal {...this.props}>
        <TouchableWithoutFeedback onPress={this.onPressOutSide}>
          <View style={[{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center'}, this.props.containerStyle]}>
            <View style={[{width: Dimensions.get('window').width * 0.8, flexDirection: 'column', backgroundColor: '#FFF', borderRadius: 4, paddingHorizontal: 30, alignItems: 'center', justifyContent: 'center', paddingTop: 35, paddingBottom: 35}, this.props.contentContainerStyle]}>
              {this.props.children}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}