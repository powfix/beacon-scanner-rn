import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ContainerStack from "./ContainerStack";

const Stack = createStackNavigator();

const RootNavigator = () => (
  <Stack.Navigator
    initialRouteName={'ContainerStack'}
    screenOptions={{
      gestureEnabled: false,
      animationEnabled: false,
      headerShown: false,
      cardStyle: { backgroundColor: 'transparent' },
      cardOverlayEnabled: true,
    }}
    headerMode={'none'}
    mode={'modal'}>
    <Stack.Screen name={'ContainerStack'} component={ContainerStack}/>
  </Stack.Navigator>
);

export default RootNavigator;