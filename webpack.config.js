<<<<<<< HEAD
const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
=======
const path = require('path')
const webpack = require('webpack')
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const SentryPlugin = require('webpack-sentry-plugin')

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
>>>>>>> b6c488a916f936384331143bc6fb76fa658d185f
/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

const HtmlWebpackPlugin = require("html-webpack-plugin");

/*
 * We've enabled HtmlWebpackPlugin for you! This generates a html
 * page for you when you compile webpack, which will make you start
 * developing and prototyping faster.
 *
 * https://github.com/jantimon/html-webpack-plugin
 *
 */

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let pages = ["main"];

module.exports = {
  mode: "development",

  entry: {
    // pageOne: "./src/pageOne.js",
    // pointIndex: "./src/pointIndex.js",
    // pointRule: "./src/pointRule.js",
    // pointHistory: "./src/pointHistory.js",
    main: "./src/main.js"
  },

  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "zt"),
    publicPath: "/zt/"
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js", ".vue", ".css"],
    alias: {
      vue: "vue/dist/vue.js"
    },
    modules: [path.resolve(__dirname, "node_modules")]
  },
  plugins: [
    new VueLoaderPlugin(),
    
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns:['zt/*']
    }),
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
      ignoreOrder: false // Enable to remove warnings about conflicting order
    })
    // new SentryWebpackPlugin({
    //   include: '.',
    //   release: 'jstest@0.0.9',
    //   ignoreFile: '.sentrycliignore',
    //   ignore: ['node_modules', 'webpack.config.js'],
    //   configFile: 'sentry.properties'
    // })
  ],
  module: {
    rules: [
      {
        test: "/.css$/",
        use: [MiniCssExtractPlugin.loader]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        query: {
          limit: 10000
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        query: {
          limit: 10000
        }
      },
      {
        test: /\.(scss|css|less)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true
            }
          },
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /.(js|jsx)$/,
        include: [path.resolve(__dirname, "src")],
        loader: "babel-loader",
        options: {
          plugins: ["syntax-dynamic-import"],
          presets: [
            [
              "@babel/preset-env",
              {
                modules: false
              }
            ]
          ]
        }
      },
      {
        test:/\.(jpg|png|gif)$/,
        use:[{
                loader:"url-loader",
                options:{
                    limit:10000
                }
            }]
    }
    ]
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
          name: "vendors"
        }
      },
      chunks: "all",
      minChunks: 1,
      minSize: 30000,
      name: true
    }
  },
  devtool: "source-map",
  devServer: {
    open: true,
    openPage: "zt/main.html",
    port: "8079",
    hot: true,
    host: "0.0.0.0",
    useLocalIp: true
  }
};

for (let i = 0; i < pages.length; i++) {
  module.exports.plugins.push(
    new HtmlWebpackPlugin({
      filename: `${pages[i]}.html`,
      template: "./src/index.html",
      hash: true,
      excludeChunks: pages.filter(item => {
        return item !== pages[i];
      })
    })
  );
}
