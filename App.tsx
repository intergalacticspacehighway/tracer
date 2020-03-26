import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Nearby} from './src/components/nearby';

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />
        <Nearby />
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
