import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SplashScreen from "../screens/SplashScreen";
import MainScreen from '../screens/MainScreen';

const Stack = createStackNavigator();

const ContainerStack = () => (
	<Stack.Navigator
		initialRouteName={'SplashScreen'}
		screenOptions={{gestureEnabled: true, headerShown: false}}>
		<Stack.Screen name={'SplashScreen'} component={SplashScreen} options={{title: 'Splash'}}/>
		<Stack.Screen name={'MainScreen'} component={MainScreen} options={{title: 'Main'}}/>
	</Stack.Navigator>
);

export default ContainerStack;
