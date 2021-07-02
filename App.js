import React, { createRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context/src/SafeAreaContext";
import RootNavigator from "./src/routes";
import { Provider } from "mobx-react/src/Provider";
import stores from "./src/stores";
import analytics from "@react-native-firebase/analytics";

const navigationRef = createRef();
const routeNameRef = createRef();

class App extends React.Component {
  render() {
    console.log('stores', stores);
    return (
      <Provider {...stores}>
        <SafeAreaProvider>
          <NavigationContainer
            ref={navigationRef}
            children={RootNavigator()}
            onReady={onNavigationReady}
            onStateChange={onNavigationStateChange}/>
        </SafeAreaProvider>
      </Provider>
    );
  };
}

const onNavigationReady = () => {
  const currentRouteName = navigationRef?.current?.getCurrentRoute()?.name;
  console.log('NavigationContainer:onReady():currentRouteName', currentRouteName);
  routeNameRef.current = currentRouteName;
};

const onNavigationStateChange = async () => {
  const previousRouteName = routeNameRef.current;
  const currentRouteName = navigationRef.current.getCurrentRoute().name;

  if (previousRouteName !== currentRouteName) {
    console.log('NavigationContainer:onNavigationStateChange()', previousRouteName, '->', currentRouteName);
    // 추적코드
    await analytics().logScreenView({
      screen_name: currentRouteName,
      screen_class: currentRouteName,
    });
  }

  // Save the current route name for later comparison
  routeNameRef.current = currentRouteName;
};

export default App;
