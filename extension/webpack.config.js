const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");

module.exports = {
  entry: "./background.js",
  optimization: {
    minimize: false,
  },
  output: {
    filename: "background.js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.config().parsed),
    }),
  ],
};
