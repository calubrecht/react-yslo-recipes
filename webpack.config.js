/* webpack.config.js */
const path = require('path');
var webpack = require('webpack');

var isMock = 'false'
var apiPort = 'null';
var apiServer='null';
var mode='production';

var setupAPI = function(env) {
  switch (env.BUILDENV) {
    case 'devMock':
      isMock = 'true';
      mode = 'development';
      break;
    case 'devLive':
      isMock = 'false';
      mode ='development';
      apiPort = '"80"';
    case 'production':
    default:
      isMock = 'false';
      mode = 'production'
      apiPort = 'null';
      break;
  }
}

module.exports = env => {
  setupAPI(env); 
  
  return {
  // Tell webpack to begin building its 
  // dependency graph from this file.
  mode: env.BUILDENV === 'production' ? 'production': 'development',
  devtool: env.BUILDENV === 'production' ? '' : 'inline-source-map',
  devServer: {
    contentBase: './public',
    host: '0.0.0.0',
    port: 3000,
    disableHostCheck: true
  },
  entry: path.join(__dirname, 'src', 'index.tsx'),
  // And to place the output in the `build` directory
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules:
    [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: 'url-loader'
      },
      {
        test: /\.css$/,
        use: 'url-loader'
      }

    ]
  },
  plugins: [
    new webpack.DefinePlugin(
      {
        REACT_APP_MOCK: env.BUILDENV === 'devMock' ? 'true' : 'false',
        REACT_APP_PORT: env.BUILDENV === 'devLive' ? '"80"' : 'null',
        REACT_APP_API_SERVER: apiServer
      }
    )
  ],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js'],
  },
  externals: {
    'react': 'React',
    'react-dom' : 'ReactDOM'
  }
 };
}
