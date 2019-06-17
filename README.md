# Fanosity Clients

This repo is for all the Fanosity frontend reactjs experiences (currently the App and Website).  Placing the app and website
in the same repository will allow us to better share common components and assets without having to manage several
separate projects.  One downside to this approach is that when we move to CI, we will most have builds processed for 
clients that may have not changed.

## Common

### Setup 

To setup this project you will need to have node 8.10 or higher, using a node version manager will make this easier:
https://github.com/nvm-sh/nvm


Install modules for all clients:
```bash
yarn
```
or
```bash
npm i
```

## Running

### Website

To start the website, run the following:
```bash
yarn web:start
```
or
```bash
npm run web:start
```

### App

#### iOS

Run the following to start the react-native app in an iOS simulator:
```bash
react-native run-ios
```

#### Android

**TODO: Add docs for android**


#### JS Server (Metro Bundler)
If you see the following (or similar) in the terminal window:
```bash
  const data = _interopRequireDefault(require("fs"));
  ^^^^^
SyntaxError: Use of const in strict mode.
    at exports.runInThisContext (vm.js:73:16)
    at Module._compile (module.js:443:25)
    at Object.Module._extensions..js (module.js:478:10)
    at Module.load (module.js:355:32)
    at Function.Module._load (module.js:310:12)

```
Then there is an issue with your default node env.  One possible solution is to run react-native server in a terminal that has the proper node configured.  

* Open a terminal in the project root directory
* Verify your node version `node --version` (should be 8.10 or higher)
    * If your node version is incorrect, you can use nvm: `nvm use 8.10`
* Start the metro bundler: `react-native start` or `yarn app:start`

### Tests

Tests are mostly working (there are a few issues with running a test on the root `<App/>` for mobile, but the tests pass).

To run tests:
```bash
yarn test
```

## Building


### Android

Key store should be in the following place `android/app/android-app-keystore`

Gradle file (`~/.gradle/gradle.properties`) should look like this: 
```bash
MYAPP_RELEASE_STORE_FILE=android-app-keystore
MYAPP_RELEASE_KEY_ALIAS=upload
MYAPP_RELEASE_STORE_PASSWORD=*********
MYAPP_RELEASE_KEY_PASSWORD=*********
```

Make sure the directory `android/app/src/main/assets` exists
```bash
mkdir android/app/src/main/assets
```

```bash
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

