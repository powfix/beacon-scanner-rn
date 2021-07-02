import React from "react";
import { Button, Text, View } from "react-native";
import { inject } from "mobx-react/src/inject";
import { SkypeIndicator } from "react-native-indicators";

class Screen extends React.Component {

  state = {
    color: '#000',
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center'}}>
        <SkypeIndicator style={{flex: 0}} color={this.state.color}/>
        <Text style={{marginTop: 18}}>메인</Text>
      </View>
    )
  }
}

export default inject('sessionStore')(Screen);
