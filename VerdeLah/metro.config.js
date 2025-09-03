const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for AWS SDK
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: 'react-native-crypto',
  stream: 'readable-stream',
  buffer: '@craftzdog/react-native-buffer',
};

// Add support for .env files
config.resolver.sourceExts = [...config.resolver.sourceExts, 'env'];

module.exports = config;
