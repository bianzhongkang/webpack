import path from "path";
import { compact, isObject } from "lodash";
import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import StylelintPlugin from "stylelint-webpack-plugin";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import CopyWebpackPlugin from "copy-webpack-plugin";
import config from "./config";
import entry, { chunkList } from "./config/entry";

const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");

/** 是否为开发环境 */
const isEnvDevelopment =
  process.env.NODE_ENV === "development" ? true : undefined;

/** 是否为生产环境 */
const isEnvProduction =
  process.env.NODE_ENV === "production" ? true : undefined;

/** 是否使用 Source maps */
const shouldUseSourceMap = config.sourceMap;

// 样式文件匹配正则
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

/** 常用路径 */
const paths = {
  appPath: path.resolve(__dirname, "."),
  appBuild: path.resolve(__dirname, "build"),
  appSrc: path.resolve(__dirname, "src"),
};

/** 模块解析后缀名 */
const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx",
];

/** webpack 配置 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const webpackConfig: any = {
  context: config.cwd,
  mode: isEnvProduction
    ? "production"
    : isEnvDevelopment
    ? "development"
    : "none",
  bail: isEnvProduction,
  entry: entry,
  output: {
    path: paths.appBuild,
    pathinfo: isEnvDevelopment,
    filename: isEnvProduction
      ? `${config.basePath}static/js/[name].[contenthash:8].js`
      : isEnvDevelopment && `${config.basePath}static/js/[name].bundle.js`,
    chunkFilename: isEnvProduction
      ? `${config.basePath}static/js/[name].[contenthash:8].chunk.js`
      : isEnvDevelopment && `${config.basePath}static/js/[name].chunk.js`,
    publicPath: isEnvDevelopment ? "/" : config.publicPath,
  },
  optimization: {
    minimize: isEnvProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 2020,
          },
          compress: {
            ecma: 5,
            comparisons: false,
            inline: 2,
            pure_funcs: ["console.log"],
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
          sourceMap: false,
        },
        parallel: true,
        extractComments: false,
      }),
    ],
    splitChunks: {
      chunks: "all",
      name: false,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: "initial",
        },
        commons: {
          minChunks: 2,
          priority: 10,
        },
      },
    },
    runtimeChunk: {
      name: (entrypoint: { name: string }) => `runtime-${entrypoint.name}`,
    },
  },
  resolve: {
    extensions: moduleFileExtensions.map((ext) => `.${ext}`),
    alias: {
      "react-native": "react-native-web",
      "@": paths.appSrc,
      "@project": path.resolve(__dirname, "src/projects", config.name),
    },
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        include: paths.appSrc,
        use: {
          loader: "babel-loader",
          options: {
            plugins: compact([
              [
                "@babel/plugin-transform-runtime",
                {
                  corejs: {
                    version: 3,
                    proposals: true,
                  },
                },
              ],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              [
                "@babel/plugin-proposal-object-rest-spread",
                { loose: true, useBuiltIns: true },
              ],
              isEnvDevelopment && "react-refresh/babel",
            ]),
            cacheDirectory: true,
            cacheCompression: false,
            compact: isEnvProduction,
          },
        },
      },
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        }),
        sideEffects: true,
      },
      {
        test: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          modules: {
            localIdentName: isEnvProduction
              ? "[hash:base64]"
              : isEnvDevelopment && "[path][name]__[local]",
          },
        }),
      },
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 3,
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          },
          "sass-loader"
        ),
        sideEffects: true,
      },
      {
        test: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 3,
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            modules: {
              localIdentName: isEnvProduction
                ? "[hash:base64]"
                : isEnvDevelopment && "[path][name]__[local]",
            },
          },
          "sass-loader"
        ),
      },
      {
        test: /\.pug$/,
        include: path.resolve(__dirname, "public"),
        exclude: /node_modules/,
        use: "pug-loader",
      },
      {
        test: /\.(png|jpg|jpeg|gif|bmp|svg)$/i,
        type: "asset",
        generator: {
          filename: `${config.basePath}static/image/[name].[hash:8].[ext]`,
        },
        include: paths.appSrc,
        exclude: /node_modules/,
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset",
        generator: {
          filename: `${config.basePath}static/font/[name].[hash:8].[ext]`,
        },
        include: paths.appSrc,
        exclude: /node_modules/,
      },
      {
        type: "asset/resource",
        generator: {
          filename: `${config.basePath}static/media/[name].[hash:8].[ext]`,
        },
        include: paths.appSrc,
        exclude: [
          /\.(js|jsx|ts|tsx)$/,
          /\.html$/,
          /\.json$/,
          /node_modules/,
          cssRegex,
          sassRegex,
        ],
      },
    ],
  },
  plugins: compact([
    ...(chunkList?.length
      ? chunkList.map(
          (chunk) =>
            new HtmlWebpackPlugin(
              Object.assign(
                {
                  filename: `${
                    isEnvDevelopment
                      ? "/"
                      : config.isNative
                      ? config.nativeHtmlPath
                      : config.basePath
                  }${chunk}.html`,
                  chunks: ["vendors", "commons", chunk],
                  // favicon: path.resolve(__dirname, "public/favicon.ico"),
                  title: isObject(config.title)
                    ? config.title[chunk]
                    : config.title,
                  inject: true,
                  template: path.resolve(
                    __dirname,
                    `public/${
                      config?.templatesList
                        ? isObject(config.templatesList)
                          ? config.templatesList[chunk] || "index.html"
                          : config.templatesList
                        : "index.html"
                    }`
                  ),
                },
                isEnvProduction
                  ? {
                      minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeRedundantAttributes: true,
                        useShortDoctype: true,
                        removeEmptyAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        keepClosingSlash: true,
                        minifyJS: true,
                        minifyCSS: true,
                        minifyURLs: true,
                      },
                    }
                  : undefined
              )
            )
        )
      : []),
    isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
    isEnvDevelopment && new ReactRefreshWebpackPlugin(),
    isEnvProduction &&
      new MiniCssExtractPlugin({
        filename: `${config.basePath}static/css/[name].[contenthash:8].css`,
        chunkFilename: `${config.basePath}static/css/[name].[contenthash:8].chunk.css`,
      }),
    isEnvDevelopment && new CaseSensitivePathsPlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.BASEURL": JSON.stringify(config.apiBaseUrl),
      "process.env.IS_NATIVE": config.isNative,
      "process.env.NATIVE_HOST": JSON.stringify(config.nativeHost),
    }),
    new ModuleNotFoundPlugin(paths.appPath),
    isEnvProduction &&
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
    isEnvProduction && new CleanWebpackPlugin(),
    isEnvProduction && new webpack.ids.HashedModuleIdsPlugin(),
    new ESLintPlugin({
      extensions: ["js", "mjs", "jsx", "ts", "tsx"],
      formatter: require.resolve("react-dev-utils/eslintFormatter"),
      eslintPath: require.resolve("eslint"),
      context: paths.appSrc,
      cache: true,
      cwd: paths.appPath,
      resolvePluginsRelativeTo: __dirname,
      baseConfig: {
        extends: [require.resolve("eslint-config-react-app/base")],
      },
    }),
    new StylelintPlugin({
      context: paths.appSrc,
    }),
    config.useAnalyzer && new BundleAnalyzerPlugin(),
    ...(config?.vendorsList?.length
      ? [
          new CopyWebpackPlugin({
            patterns: config.vendorsList.map((file) => ({
              from: path.resolve(
                __dirname,
                `src/projects/${config.name}/assets/vendors/${file}`
              ),
              to: path.resolve(__dirname, `build/${config.basePath}static/js/`),
            })),
          }),
        ]
      : []),
  ]),
};

/**
 * 获取样式加载器的通用函数
 * @param cssOptions 样式配置
 * @param preProcessor 预加载 loader 此项目中仅使用 sass-loader
 */
function getStyleLoaders(
  cssOptions: string | { [index: string]: unknown },
  preProcessor?: string
) {
  const loaders = compact([
    isEnvDevelopment && "style-loader",
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: "css-loader",
      options: cssOptions,
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-flexbugs-fixes",
            [
              "postcss-preset-env",
              {
                autoprefixer: {
                  flexbox: "no-2009",
                },
                stage: 3,
              },
            ],
            "postcss-normalize",
            config.isMobileApp && [
              "postcss-px-to-viewport",
              {
                unitToConvert: "px",
                viewportWidth: 750,
                viewportHeight: 1334,
                unitPrecision: 3,
                viewportUnit: "vw",
                fontViewportUnit: "vw",
                selectorBlackList: [".ignore"],
                minPixelValue: 1,
                mediaQuery: false,
                exclude: [/node_modules/],
              },
            ],
            "cssnano",
          ],
        },
        sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
      },
    },
  ]);
  if (preProcessor) {
    loaders.push(
      {
        loader: "resolve-url-loader",
        options: {
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          root: paths.appSrc,
        },
      },
      {
        loader: preProcessor,
        options: {
          sourceMap: true,
        },
      }
    );
  }
  return loaders;
}

// /** 测试环境接口声明 */
// interface DevConfiguration extends Configuration {
//   devServer?: {
//     static?: {
//       watch?: boolean;
//       serveIndex?: boolean;
//     };
//     open?: boolean | string;
//   };
// }

// webpack-dev-server 版本问题
// 如果打开其他页面则会 301 重定向，关闭 谷歌开发者工具 NetWork Disable cache 即可
// 等待 webpack-dev-server 版本稳定后再考虑如何优化
if (isEnvDevelopment) {
  webpackConfig.devServer = {
    static: {
      watch: false,
      serveIndex: true,
    },
    open: `http://localhost:8080/${isEnvDevelopment ? "" : config.basePath}${
      config.mpaSinglePage || "index"
    }.html`,
  };
}

export default webpackConfig;
