const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)
const { transformer } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-qrcode-svg/textEncodingTransformation")
};

module.exports = withNativeWind(config, { input: './global.css' })