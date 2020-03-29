import React from 'react';
import {WebView} from 'react-native-webview';
import {ActivityIndicator, Appbar} from 'react-native-paper';

const Spinner = () => (
  <ActivityIndicator
    size="large"
    style={{position: 'absolute', top: 0, right: 0, left: 0, bottom: 0}}
  />
);

export function CovidTest() {
  return (
    <>
      <WebView
        startInLoadingState={true}
        allowsBackForwardNavigationGestures
        originWhitelist={['*']}
        allowsLinkPreview
        source={{
          uri:
            'https://www.evital.in/risk-tests/covid-19/mobile?showProvideInformationForm=false',
        }}
        renderLoading={Spinner}
      />
    </>
  );
}
