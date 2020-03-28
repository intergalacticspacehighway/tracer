import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider, Appbar} from 'react-native-paper';
import {theme} from './src/theme';
import {colors} from './src/theme/colors';
import {BottomTabNavigator} from 'navigators';

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <Appbar.Header>
        <Appbar.Action onPress={() => {}} icon="arrow-left" />
      </Appbar.Header>
      <SafeAreaView>
        <StatusBar backgroundColor={colors['cool-blue-100']} />
      </SafeAreaView>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
