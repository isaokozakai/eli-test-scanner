module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-gesture-handler|@react-navigation|@react-native-community)/)',
  ], 
  moduleNameMapper: {
    '^react-native-gesture-handler$': '<rootDir>/__mocks__/react-native-gesture-handler.ts',
    '^react-native-vision-camera$': '<rootDir>/__mocks__/react-native-vision-camera.ts',
  },
};
