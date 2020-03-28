import React from 'react';
import {StyleSheet, AsyncStorage} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {Drawer} from 'react-native-paper';
import {Dimensions} from 'react-native';
import {useTranslatedText} from 'components';
import {logout} from 'services';
import {useTranslation} from 'react-i18next';

const DrawerNav = createDrawerNavigator();

export function CustomDrawerContent(props: any) {
  const {i18n} = useTranslation();

  return (
    <Drawer.Section title="Tracer" style={styles.appTitle}>
      <Drawer.Item
        icon="account-arrow-right-outline"
        label={'logout'}
        active={false}
        onPress={logout}
      />

      <Drawer.Item
        label={'English'}
        active={i18n.language === 'en'}
        onPress={() => {
          i18n.changeLanguage('en');
          AsyncStorage.setItem('defaultLang', 'en');
          props.navigation.closeDrawer();
        }}
      />
      <Drawer.Item
        label={'ગુજરાતી'}
        active={i18n.language === 'gu'}
        onPress={() => {
          i18n.changeLanguage('gu');
          AsyncStorage.setItem('defaultLang', 'gu');
          props.navigation.closeDrawer();
        }}
      />
    </Drawer.Section>
  );
}

const styles = StyleSheet.create({
  drawerStyle: {
    width: Dimensions.get('window').width / 1.5,
  },
  appTitle: {
    marginVertical: 10,
  },
});
