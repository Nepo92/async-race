const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const dotEnv = require("dotenv-webpack");

const mode =
  process.env.NODE_WEBPACK_MODE === "development"
    ? "development"
    : "production";

const root = path.resolve(__dirname, "");

const src = path.join(root, "src");
const dist = path.join(root, "dist");

module.exports = {
  mode,
  resolve: {
    extensions: [".js", ".ts"],
  },
  entry: src + "/index.ts",
  output: {
    path: dist,
    filename: "app.js",
  },
  plugins: [
    new dotEnv(),
    new HTMLWebpackPlugin({
      template: src + "/index.html",
      filename: "index.html",
      publicPath: "./",
    }),
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: {
          loader: "ts-loader",
        },
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["postcss-preset-env"],
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.html$/,
        loader: "mustache-loader",
      },
      {
        test: /\.(?:|png|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: () => 'img/[name][ext]',
        },
      },
      {
        test: /\.ttf$/,
        type: "asset/resource",
        generator: {
          filename: "./fonts/[name][ext]",
        },
      },
    ],
  },
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "./dist"),
    },
    historyApiFallback: {
      disableDotRule: true,
    },
  },
};
