const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

// Enable WASM asset resolution for expo-sqlite web worker support
config.resolver.assetExts.push("wasm");

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./global.css",
  extraThemes: ["moon", "moon-dark", "grass", "grass-dark"],
});
