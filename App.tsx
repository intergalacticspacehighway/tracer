import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, AsyncStorage} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider, Appbar} from 'react-native-paper';
import {theme} from './src/theme';
import {colors} from './src/theme/colors';
import {Login} from 'components';
import {BottomTabNavigator} from 'navigators';
import {firebaseAuth} from 'firebase';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {createUserRecord, useUserStore} from 'services';
import Drawer from 'react-native-drawer';
import {CustomDrawerContent} from './src/navigators/drawer';
import SideMenu from 'react-native-side-menu';
import {useTranslation} from 'react-i18next';
import './src/localization';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {i18n} = useTranslation();
  const [defaultLangLoaded, setDefaultLangLoaded] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const {user} = useUserStore();

  function onAuthStateChanged(user: any) {
    if (user) {
      const _user: FirebaseAuthTypes.User = user._user;
      // console.log("user ", _user);
      try {
        createUserRecord(_user);
      } catch (e) {}
    } else {
      //@ts-ignore
    }
  }

  useEffect(() => {
    const subscriber = firebaseAuth.onAuthStateChanged(onAuthStateChanged);

    return subscriber;
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('defaultLang')
      .then(res => {
        if (res) {
          i18n.changeLanguage(res);
        }
        setDefaultLangLoaded(true);
      })
      .catch((e: any) => {
        setDefaultLangLoaded(true);
      });
  }, [i18n, setDefaultLangLoaded]);

  if (!defaultLangLoaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar backgroundColor={colors['cool-blue-100']} />
      {console.log('user man ', user)}
      {user.uuid ? (
        <SideMenu
          isOpen={isMenuOpen}
          menu={<CustomDrawerContent handleClose={closeMenu} />}>
          <Appbar.Header>
            <Appbar.Action onPress={toggleMenu} icon="menu"></Appbar.Action>
            <Appbar.Content title="Fight Covid-19"></Appbar.Content>
          </Appbar.Header>
          <NavigationContainer>
            <BottomTabNavigator />
          </NavigationContainer>
        </SideMenu>
      ) : (
        <Login />
      )}
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
