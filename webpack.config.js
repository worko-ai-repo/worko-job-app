/**
 * @see https://webpack.js.org/guides/typescript/
 * @see https://programoholic.medium.com/build-and-deploy-serverless-application-with-webpack-584163367390
 * @description
 *  1. Reduce the build size of the application from more than `250MB` to 2–3 MB per lambda using webpack
 */

const path = require("path");
const slsw = require("serverless-webpack");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const TerserPlugin = require("terser-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  mode: slsw.lib.webpack.isLocal ? "development" : "production", // Use "production" for deployment

  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },

  plugins: [new ForkTsCheckerWebpackPlugin()],

  /**
   * Optimization for Lambda deployment
   */
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },

  /**
   * Reduce build output to prevent memory issues
   */
  stats: "errors-only",

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          // disable type checker - we will use it in fork plugin
          transpileOnly: true,
        },
        include: [path.resolve(__dirname, "src")],
        exclude: /node_modules/,
      },
    ],
  },
  node: false,
  externals: [nodeExternals()],
};
