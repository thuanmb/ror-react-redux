/* eslint-disable global-require */
module.exports = (env = {}) => {
  const path = require('path');
  const webpack = require('webpack');
  const ExtractTextPlugin = require('extract-text-webpack-plugin');
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

  const babelConfig = {
    babelrc: false,
    cacheDirectory: !env.production,
    presets: [
      'react',
      ['es2015', { modules: false }],
      'stage-1',
      'stage-2',
      'stage-3',
    ],
    plugins: [
      'transform-runtime',
    ],
  };

  const styleConfigProduction = {
    test: /\.(scss|css)$/,
    exclude: /node_modules/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [{
        loader: 'css-loader',
        options: {
          sourceMap: false,
          minimize: true,
        },
      }, {
        loader: 'postcss-loader',
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: false,
        },
      }],
    }),
  };

  const styleConfigDevelopment = {
    test: /\.(scss|css)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true,
        },
      }, {
        loader: 'postcss-loader',
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      },
    ],
  };

  const CONSTANTS = {
    railsAssetPath: '../app/assets/my-project',
    webpackAssetPath: './public/assets',
    webpackPublicPath: '/assets/',
    outputJSPath: 'js',
    outputStylePath: 'styles',
    outputImagePath: 'imgs',
  };

  const config = {

    context: __dirname,
    entry: [
      './main.jsx',
    ],

    output: {
      path: path.resolve(
        __dirname,
        (env.watch || env.production) ?
          CONSTANTS.railsAssetPath :
          CONSTANTS.webpackAssetPath),
      publicPath: CONSTANTS.webpackPublicPath,
      filename: `${CONSTANTS.outputJSPath}/my-project-main.js`,
    },

    devtool: !env.production ? 'source-map' : false,
    devServer: {
      hot: true,
      port: 3001,
      open: true,
      contentBase: path.resolve(__dirname, 'public'),
      historyApiFallback: true,
      stats: {
        colors: true,
        timings: true,
        chunks: false,
        cached: false,
        cachedAssets: false,
        children: false,
      },
    },
    stats: 'minimal',
    watch: env.watch,
    plugins: [
      new webpack.LoaderOptionsPlugin({
        debug: !env.production,
        minimize: env.production,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': env.production ? '"production"' : '"development"',
        __DEV__: !env.production,
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        _: 'lodash',
      }),
    ],

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [
            path.resolve(__dirname, './'),
          ],
          enforce: 'pre',
          loader: 'eslint-loader',
        },
        {
          test: /\.jsx?$/,
          include: [
            path.resolve(__dirname, './'),
          ],
          loader: 'babel-loader',
          options: babelConfig,
        },
        {
          test: /\.(eot|ttf|svg|woff|woff2)[.]*/,
          exclude: /imgs/,
          loader: 'url-loader',
          options: {
            limit: 200000,
          },
        },
        {
          test: /\.(jpe?g|png|svg)[.]*/,
          include: /imgs/,
          loader: 'file-loader',
          options: {
            name: `${CONSTANTS.outputImagePath}/[name].[ext]`,
          },
        },
      ],
    },
    resolve: {
      alias: {
        Api: path.resolve(__dirname, './core/api'),
        NodeModulesPath: path.resolve(__dirname, '../node_modules'),
        ComponentsPath: path.resolve(__dirname, './components'),
        ActionsPath: path.resolve(__dirname, './actions'),
        CorePath: path.resolve(__dirname, './core'),
        StylesPath: path.resolve(__dirname, './styles'),
        CommonComponents: path.resolve(__dirname, './components/common/common'),
      },
      extensions: ['.js', '.jsx', '.scss'],
    },

  };

  if (env.production) {
    config.module.rules.push(styleConfigProduction);
    config.plugins.push(new ExtractTextPlugin({
      filename: `${CONSTANTS.outputStylePath}/my-project-main.css`,
      disable: false,
      allChunks: true,
    }));
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());
    config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
  } else {
    config.module.rules.push(styleConfigDevelopment);
    babelConfig.plugins.unshift('react-hot-loader/babel');
    config.entry.unshift('react-hot-loader/patch', 'webpack-dev-server/client?http://localhost:3001', 'webpack/hot/only-dev-server');
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
    config.plugins.push(new webpack.NamedModulesPlugin());
    config.plugins.push(new HardSourceWebpackPlugin({
      cacheDirectory: './cache/[confighash]',
      recordsPath: './cache/[confighash]/records.json',
      configHash: (webpackConfig) => require('node-object-hash')().hash(webpackConfig),
      environmentHash: () => new Promise((resolve, reject) => {
        require('fs').readFile(path.resolve(__dirname, '..', 'yarn.lock'), (err, src) => {
          if (err) {
            return reject(err);
          }
          return resolve(require('crypto').createHash('md5').update(src).digest('hex'));
        });
      }),
    }));
  }

  if (env.analyse) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
};

