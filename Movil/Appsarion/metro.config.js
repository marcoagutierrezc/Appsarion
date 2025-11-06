const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

// Use the current working directory as the project root to avoid Windows path case mismatches
const projectRoot = path.resolve(process.cwd());
const config = getDefaultConfig(projectRoot);

module.exports = withNativeWind(config, { input: './globals.css' });