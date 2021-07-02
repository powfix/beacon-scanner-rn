import React from "react";
import { Button, Text, View } from "react-native";
import { inject } from "mobx-react/src/inject";
import { SkypeIndicator } from "react-native-indicators";

class Screen extends React.Component {

  state = {
    color: '#000',
  };

  navigateMain = () => {
    this.props.navigation.reset({
      index: 0,
      routes: [
        {name: 'MainScreen', params: {}},
      ],
    });
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center'}}>
        <SkypeIndicator style={{flex: 0}} color={this.state.color}/>
        <Text style={{marginTop: 18}}>SplashScreen</Text>

        <View style={{paddingVertical: 18}}>
          <Button title={'메인 화면으로 이동'} onPress={this.navigateMain}/>
        </View>
      </View>
    )
  }
}

export default inject('sessionStore')(Screen);
