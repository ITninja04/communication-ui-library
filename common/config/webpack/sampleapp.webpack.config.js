// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = (sampleAppDir, env) => ({
  entry: './src/index.tsx',
  ...(env.production || !env.development ? {} : { devtool: 'eval-source-map' }),
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      // reference internal packlets src directly for hot reloading when developing
      '@azure/communication-react': path.resolve(sampleAppDir, '../../packages/communication-react/src'),
      'react-components': path.resolve(sampleAppDir, '../../packages/react-components/src'),
      'react-composites': path.resolve(sampleAppDir, '../../packages/react-composites/src'),
      'chat-stateful-client': path.resolve(sampleAppDir, '../../packages/chat-stateful-client/src'),
      'chat-component-bindings': path.resolve(sampleAppDir, '../../packages/chat-component-bindings/src'),
      'calling-stateful-client': path.resolve(sampleAppDir, '../../packages/calling-stateful-client/src'),
      'calling-component-bindings': path.resolve(sampleAppDir, '../../packages/calling-component-bindings/src'),
      'acs-ui-common': path.resolve(sampleAppDir, '../../packages/acs-ui-common/src')
    }
  },
  output: {
    path: path.join(sampleAppDir, '/dist'),
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        },
        exclude: /dist/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg/,
        type: 'asset/inline'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    new webpack.DefinePlugin({
      'process.env.PRODUCTION': env.production || !env.development,
      'process.env.NAME': JSON.stringify(require(path.resolve(sampleAppDir, 'package.json')).name),
      'process.env.VERSION': JSON.stringify(require(path.resolve(sampleAppDir, 'package.json')).version)
    }),
    new webpack.DefinePlugin({ __BUILDTIME__: JSON.stringify(new Date().toLocaleString()) })
  ],
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    contentBase: path.resolve(sampleAppDir, 'public'),
    proxy: [
      {
        path: '/token',
        target: 'http://[::1]:8080'
      },
      {
        path: '/refreshToken/*',
        target: 'http://[::1]:8080'
      },
      {
        path: '/isValidThread/*',
        target: 'http://[::1]:8080'
      },
      {
        path: '/createThread',
        target: 'http://[::1]:8080'
      },
      {
        path: '/userConfig/*',
        target: 'http://[::1]:8080'
      },
      {
        path: '/getEndpointUrl',
        target: 'http://[::1]:8080'
      },
      {
        path: '/addUser/*',
        target: 'http://[::1]:8080'
      }
    ]
  }
});

module.exports = webpackConfig;