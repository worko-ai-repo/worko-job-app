const path = require("path");
const slsw = require("serverless-webpack");

module.exports = {
  /**
   * Entry point for the Webpack bundling process.
   * Automatically detected by Serverless Webpack (`slsw.lib.entries`) based on your `serverless.ts` function definitions.
   */
  entry: slsw.lib.entries,

  /**
   * Defines the environment for which Webpack is bundling the code.
   * Setting it to 'node' targets Node.js, which is the runtime environment for AWS Lambda.
   */
  target: "node",

  /**
   * Specifies the build mode:
   * - 'development' for local builds to include source maps and easier debugging.
   * - 'production' for optimized and minified code ready for deployment to AWS.
   */
  mode: slsw.lib.webpack.isLocal ? "development" : "production", // Use "production" for deployment

  /**
   * Output settings for the bundled files.
   *
   * @property {string} libraryTarget - Specifies the module format for output, set to 'commonjs' as required by AWS Lambda.
   * @property {string} path - The directory where Webpack will output the bundled files, in this case '.webpack'.
   * @property {string} filename - The output filename pattern for the bundled functions.
   */
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },

  /**
   * Resolves extensions for module imports.
   * Allows importing files without needing to specify their extensions for TypeScript (`.ts`) and JavaScript (`.js`).
   * Automatically resolve '.ts' and '.js' files when importing.
   */
  resolve: {
    extensions: [".ts", ".js"],
  },

  /**
   * Memory optimization for containerized builds
   */
  optimization: {
    splitChunks: false,
    minimize: false,
  },

  /**
   * Reduce build output to prevent memory issues
   */
  stats: "errors-only",

  /**
   * Defines how different file types should be processed (rules).
   *
   * @property {RegExp} test - Specifies which file types should be processed. In this case, `.ts` files.
   * @property {string} use - Specifies the loader to handle TypeScript files, which is `ts-loader`.
   * @property {string[]} include - Restricts the compilation to the 'src' directory where your TypeScript source files are located.
   * @property {RegExp} exclude - Excludes the 'node_modules' directory from TypeScript compilation, as external libraries don't need to be recompiled.
   */
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: [path.resolve(__dirname, "src")],
        exclude: /node_modules/,
      },
    ],
  },
};


