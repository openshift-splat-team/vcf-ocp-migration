import * as path from 'path';
import { ConsoleRemotePlugin } from '@openshift-console/dynamic-plugin-sdk-webpack';

const config = new ConsoleRemotePlugin({
  pluginMetadata: {
    name: 'vcf-migration-console',
    version: '0.0.1',
    exposedModules: {
      migrationPlugin: path.resolve(__dirname, 'src/app/index.ts'),
    },
  },
  extensions: path.resolve(__dirname, 'src/console-extensions.json'),
  sharedModules: {
    '@openshift-console/dynamic-plugin-sdk': { singleton: true, requiredVersion: '*' },
    '@openshift-console/dynamic-plugin-sdk-internal': { singleton: true, requiredVersion: '*' },
    '@patternfly/react-core': { singleton: true, requiredVersion: '*' },
    '@patternfly/react-table': { singleton: true, requiredVersion: '*' },
    '@patternfly/react-icons': { singleton: true, requiredVersion: '*' },
    react: { singleton: true, requiredVersion: '*' },
    'react-dom': { singleton: true, requiredVersion: '*' },
    'react-router-dom': { singleton: true, requiredVersion: '*' },
  },
});

export default config;
