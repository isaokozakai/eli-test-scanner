const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  projectRoot: __dirname,
  resolver: {
    extraNodeModules: {
        'react-native-gesture-handler': path.resolve(__dirname, '../node_modules/react-native-gesture-handler'),
        '@react-navigation/native-stack': path.resolve(__dirname, '../node_modules/@react-navigation/native-stack'),
    },
  },
  watchFolders: [
    path.resolve(__dirname, '../'),
  ],
};

module.exports = mergeConfig(defaultConfig, config);
