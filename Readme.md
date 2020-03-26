## Requirements

- Xcode 10.x+
- Nodejs 10.x
- react-native CLI (e.g. `npm install -g react-native-cli`)

## Setup

- `$ cd tracer/`
- `$ npm install`
- `$ cd ios/ && pod install` (if you don't have the cocoapods ruby gem installed, run `$ gem install cocoapods` then try again).

## Running locally

- `$ cd tracer/`
- `$ npm start` # runs Metro Bundler on :8081
- `$ open ios/tracer.xcworkspace/` and then Xcode -> Product -> Build/Run
