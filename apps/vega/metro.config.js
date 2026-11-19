const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const root = path.resolve(__dirname, '../..');
const local = name => path.dirname(require.resolve(name + '/package.json', { paths: [__dirname] }));
module.exports = mergeConfig(getDefaultConfig(__dirname), {
  watchFolders: [path.join(root, 'packages/shared-ui'), path.join(root, 'node_modules')],
  resolver: {
    unstable_enableSymlinks: true,
    nodeModulesPaths: [path.join(__dirname, 'node_modules'), path.join(root, 'node_modules')],
    resolveRequest: (context, name, platform) => {
      if (name === 'react-native' || name.startsWith('react-native/')) {
        return context.resolveRequest(context, name.replace(/^react-native/, '@amazon-devices/react-native-kepler'), platform);
      }
      if (name === 'react' || name.startsWith('react/')) {
        return context.resolveRequest(context, path.join(local('react'), name.slice(5)), platform);
      }
      return context.resolveRequest(context, name, platform);
    },
    platforms: ['kepler', 'native', 'android', 'ios']
  }
});
