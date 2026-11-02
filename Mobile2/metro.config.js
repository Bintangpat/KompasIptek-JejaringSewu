const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Enable WASM asset resolution for expo-sqlite web worker support
config.resolver.assetExts.push("wasm");

module.exports = withNativeWind(config, { input: "./global.css" });
