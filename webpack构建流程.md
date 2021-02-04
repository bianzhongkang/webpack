# 使用 webpack 搭建一个自定义的框架

简单介绍一下如何搭建一个支持日常生产的框架

主要使用 webpack + react + typescript 进行构建

具体步骤如下

### 1. 确定使用 Visual Studio Code 进行开发

使用 VS Code 进行开发，需要安装如下几个插件:

#### 1) EditorConfig fro VS Code

统一编辑器编码风格，需要在根目录插入 `.editorconfig` 配置文件，具体配置如下：

```

# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true

# Matches multiple files with brace expansion notation
# Set default charset
[*.{js,py}]
charset = utf-8

# 4 space indentation
[*.py]
indent_style = space
indent_size = 4

# Tab indentation (no size specified)
[Makefile]
indent_style = tab

# Indentation override for all JS under lib directory
[lib/**.js]
indent_style = space
indent_size = 2

# Matches the exact files either package.json or .travis.yml
[{package.json,.travis.yml}]
indent_style = space
indent_size = 2

```

#### 2) ESLint

主要用于项目内脚本文件的编码风格统一以及错误提示，之后会安装具体依赖库以及添加配置文件

#### 3） stylelint

主要用于项目内样式文件的编码风格统一以及错误提示，之后后安装具体依赖库以及添加配置文件




### 2. 初始化一个新的项目

首先创建一个空的文件夹，在这个文件夹内进行 `yarn init` 以及 `git init` 操作，得到这样一个 `package.json` 如下：

```json

{
  "name": "demo",
  "version": "1.0.0",
  "private": true,
  "author": "TutuMaH <625706468@qq.com>",
  "license": "MIT"
}

```

在根目录添加 `.gitignore` 文件，用来忽略对应的文件，用于 git 的版本控制：

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

.eslintcache

```

#### 1) 安装 typescript 以及 ts-node

`yarn add -D typescript ts-node`

可以通过 `tsc --init` 生成 `tsconfig.json` 配置文件，或者直接在根目录插入如下配置:

```json

{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */
    /* Basic Options */
    // "incremental": true,                   /* Enable incremental compilation */
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    "allowJs": true,                          /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    "jsx": "react-jsx",                       /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    // "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    // "outDir": "./",                        /* Redirect output structure to the directory. */
    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
    // "removeComments": true,                /* Do not emit comments to output. */
    "noEmit": true,                           /* Do not emit outputs. */
    "importHelpers": true,                    /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */
    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */
    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    "noFallthroughCasesInSwitch": true,       /* Report errors for fallthrough cases in switch statement. */
    // "noUncheckedIndexedAccess": true,      /* Include 'undefined' in index signature results */
    /* Module Resolution Options */
    "moduleResolution": "node",               /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    "baseUrl": "./",                          /* Base directory to resolve non-absolute module names. */
    "paths": {
      "@/*": [
        "src/*"
      ],
    },                                        /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    "allowSyntheticDefaultImports": true,     /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */
    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */
    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
    /* Advanced Options */
    "skipLibCheck": true,                     /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true  /* Disallow inconsistently-cased references to the same file. */
  },
  "include": [
    "src"
  ]
}


```


#### 2) 安装 eslint 依赖库 react-app

`yarn add -D eslint-config-react-app @typescript-eslint/eslint-plugin @typescript-eslint/parser babel-eslint eslint eslint-plugin-flowtype eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks eslint-webpack-plugin`

`eslint-webpack-plugin` 是 webpack 的 plugin，后续会进行配置

#### 3) 安装 eslint 依赖库 react-app/jest

`yarn add -D eslint-plugin-jest eslint-plugin-testing-library`

#### 4) 安装 prettier 使得 vscode 能够自动修正代码风格

`yarn add -D prettier eslint-plugin-prettier eslint-config-prettier`

#### 5) 在 package.json 中添加 eslintConfig

browserslist 是 babel 要使用的配置，为之后 babel 配置用

添加 config 使配置生效:

```json

{
  ...
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest",
      "plugin:prettier/recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    "rules": {
      "@typescript-eslint/no-var-requires": "off"
    }
  },
  ...
}

```


#### 6) 添加 stylelint 配置库

`yarn add -D stylelint stylelint-config-standard stylelint-order stylelint-config-sass-guidelines stylelint-webpack-plugin`

`stylelint-webpack-plugin` 是 webpack 中使用的一个 plugin，之后在 webpack 配置中会添加

在根目录添加 `.stylelintrc.json` 使配置生效:

```json

{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-sass-guidelines"
  ],
  "plugins": [
    "stylelint-order"
  ]
}

```

### 3. 安装及配置 webpack

`yarn add -D webpack webpack-cli webpack-dev-server html-webpack-plugin`

`webpack-dev-server` 由于 `webpack 5.0`，如果版本低于 `4.0`, 不会正常刷新页面，需要使用 `yarn add -D webpack-dev-server@next` 重新安装

`html-webpack-plugin` 是 webpack 生成 html 文件的插件

#### 1) 添加 babel-loader

`yarn add -D babel-loader @babel/core @babel/preset-env @babel/preset-typescript @babel/preset-react @babel/plugin-transform-runtime @babel/preset-plugin-transform-runtime @babel/runtime-corejs3 @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread`

因为 babel 不仅仅在 webpack 中使用，所以我们把一些公用的 babel config 放在 `package.json` 中

```json

{
  ...
  "babel": {
    "presets": [
      [
        "@babel/preset-env",
        {
          "useBuiltIns": false
        }
      ],
      [
        "@babel/preset-react",
        {
          "runtime": "automatic"
        }
      ],
      "@babel/preset-typescript"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
  ...
}

```

使用在 webpack.config 的 modules 中的 babel-loader 的配置如下：

```js

{
  test: /\.ts$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      plugins: [
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
      ],
    },
  },
},

```

#### 2) 添加 react 热重载

首先安装 react 和 react-dom，以及他们的声明文件：

`yarn add react react-dom`

`yarn add -D @types/react @types/react-dom`

然后使用 `@pmmmwh/react-refresh-webpack-plugin` 这个插件来进行热重载：
 
`yarn add -D @pmmmwh/react-refresh-webpack-plugin react-refresh type-fest`

可以根据库的介绍来进行配置 webpack.config：

```js

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
// ... your other imports

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  // It is suggested to run both `react-refresh/babel` and the plugin in the `development` mode only,
  // even though both of them have optimisations in place to do nothing in the `production` mode.
  // If you would like to override Webpack's defaults for modes, you can also use the `none` mode -
  // you then will need to set `forceEnable: true` in the plugin's options.
  mode: isDevelopment ? 'development' : 'production',
  module: {
    rules: [
      // ... other rules
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          // ... other loaders
          {
            loader: require.resolve('babel-loader'),
            options: {
              // ... other options
              plugins: [
                // ... other plugins
                isDevelopment && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // ... other plugins
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  // ... other configuration options
};

```

需要注意的一点是，在使用 `"@pmmmwh/react-refresh-webpack-plugin": "^0.4.3"` 这个版本的库，与 `"webpack-dev-server": "^4.0.0-beta.0"` 的默认设置会有冲突，导致热重载不会发生，解决方法很简单：

```js
...
  devServer: {
      static: {
        watch: false,
      },
  ...
  }
```

将 watch 设置为 false 即可

具体issues: [git 链接](https://github.com/webpack/webpack-dev-server/issues/2893)

#### 3) 下面将一步一步的进行 webpack 配置

首先安装 cross-env 来为 process.env 添加环境变量

`yarn add -D cross-env`

然后可以在 `package.json` 中添加 scripts 配置

```json

...
"scripts": {
  "start": "cross-env NODE_ENV=development webpack serve",
  "build": "cross-env NODE_ENV=production webpack"
},
...

```

然后可以在根目录添加一个 `webpack.config.ts` 文件作为 webpack 的配置文件

然后在配置中添加环境变量的值

```js

/** 是否为开发环境 */
const isEnvDevelopment =
  process.env.NODE_ENV === "development" ? true : undefined;
/** 是否为生产环境 */
const isEnvProduction =
  process.env.NODE_ENV === "production" ? true : undefined;
/** 是否使用 Source maps */
const shouldUseSourceMap = false;

```

这里再安装一个 lodash，使用它的 compact 方法去除数组中的空值，后续项目中也可以使用

`yarn add lodash`

当然也要安装 lodash 的声明库

`yarn add -D @types/lodash`


#### 4) 简单的 entry 和 output 配置

```js

/** 常用路径 */
const paths = {
  appPath: path.resolve(__dirname, "."),
  appBuild: path.resolve(__dirname, "build"),
  appSrc: path.resolve(__dirname, "src"),
  appHtml: path.resolve(__dirname, "public/index.html"),
};

{
  mode: isEnvProduction
    ? "production"
    : isEnvDevelopment
    ? "development"
    : "none",
  bail: isEnvProduction,
  entry: {
    index: "./src/index.tsx",
  },
  output: {
    path: paths.appBuild,
    pathinfo: isEnvDevelopment,
    filename: isEnvProduction
      ? "static/js/[name].[contenthash:8].js"
      : isEnvDevelopment && "static/js/[name].bundle.js",
    chunkFilename: isEnvProduction
      ? "static/js/[name].[contenthash:8].chunk.js"
      : isEnvDevelopment && "static/js/[name].chunk.js",
    publicPath: "/",
  },
  ...
}

```

#### 5) optimization 配置

optimization 主要是针对于性能优化，webpack 默认提供 `terser-webpack-plugin` 进行性能优化

但是 `terser-webpack-plugin` 打包会默认生成一个 license.txt 文件

所以我们这里使用一个自定义的插件来覆盖原有的代码压缩插件

`yarn add -D terser-webpack-plugin @types/terser-webpack-plugin`

```js

{
  ...
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
      },
    },
    runtimeChunk: {
      name: (entrypoint: { name: string }) => `runtime-${entrypoint.name}`,
    },
  },
  ...
}

```

#### 5) resolve 配置

这里我们主要那个用 resolve 来做关于解析后缀名和别名设置

```js

/** 是否使用 Source maps */
const shouldUseSourceMap = false;

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

{
  ...
  resolve: {
    extensions: moduleFileExtensions.map((ext) => `.${ext}`),
    alias: {
      "react-native": "react-native-web",
      "@": paths.appSrc,
    },
  },
  ...
}

```

我们的 `tsconfig.json` 在之前已经添加了对 src 目录的解析

```json

{
  "compilerOptions": {
    ...
    "paths": {
      "@/*": [
        "src/*"
    ],
    ...
  }
}

```

如果有别的别名需求可以自行添加

#### 6) module 配置

说到 module 主要就是涉及到了 loaders, 就是对各种类型文件的处理

脚本文件我们之前已经使用了 babel-loader 进行处理，这里我们主要介绍 css 文件的处理方式

首先安装必要的一些 loader

`yarn add -D sass sass-loader resolve-url-loader style-loader css-loader postcss-loader mini-css-extract-plugin @types/mini-css-extract-plugin`

首先声明一个生成 css 文件的方法

```ts

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

```

然后添加 module 配置:

```ts

// 样式文件匹配正则
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

{
  ...
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
            presets: [
              "@babel/preset-typescript",
              ["@babel/preset-env", { useBuiltIns: false }],
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
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
        test: /\.(png|jpg|jpeg|gif|bmp|svg)$/i,
        type: "asset",
        generator: {
          filename: "static/image/[name].[hash:8].[ext]",
        },
        include: paths.appSrc,
        exclude: /node_modules/,
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset",
        generator: {
          filename: "static/font/[name].[hash:8].[ext]",
        },
        include: paths.appSrc,
        exclude: /node_modules/,
      },
      {
        type: "asset/resource",
        generator: {
          filename: "static/media/[name].[hash:8].[ext]",
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
  plugins: {
    ...
    isEnvProduction &&
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:8].css",
        chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
      }),
  }
}

```

这里的 `postcss-loader` 只是引用了这个 loader 具体配置会在之后进行

#### 7) plugins 配置

plugins 就是 webpack 中使用的一些插件

比如我们之前用来 react 热重载的插件 ReactRefreshWebpackPlugin

下面就会安装一些 webpack 用到的插件，已经安装过的插件不再这里重复安装

`yarn add -D react-dev-utils @types/react-dev-utils case-sensitive-paths-webpack-plugin @types/case-sensitive-paths-webpack-plugin clean-webpack-plugin webpack-bundle-analyzer @types/webpack-bundle-analyzer`

`react-dev-utils` 是 create-react-app 内置的一个功能库，这里部分插件会用到

`Configuration` 作为 webpack 的配置接口，但是 webpack-dev-server 也有个同名文件 `Configuration` 现在并没有 `"webpack-dev-server": "^4.0.0-beta.0"` 的配置文件，所以暂时自己写了一个简单的配置接口

typescript 有时候会弄串导致类型声明失败，这个时候就把 webpack-dev-server 中的 `Configuration` 改个名称就行

然后配置 plugins ：

```ts

{
  ...
  plugins: compact([
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: paths.appHtml,
        },
        {
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
      )
    ),
    isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
    isEnvDevelopment && new ReactRefreshWebpackPlugin(),
    isEnvProduction &&
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:8].css",
        chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
      }),
    isEnvDevelopment && new CaseSensitivePathsPlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    new ModuleNotFoundPlugin(paths.appPath),
    isEnvProduction &&
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
    isEnvProduction && new CleanWebpackPlugin(),
    isEnvProduction && new webpack.ids.HashedModuleIdsPlugin(),
    isEnvProduction && new BundleAnalyzerPlugin(),
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
  ]),
  ...
}

```

这些 plugins 的作用就不在这一一介绍，可以自己百度一下

至此 webpack 基本配置完成，下面贴一下整体的 `webpack.config.ts` 的代码：

```ts

import path from "path";
import { compact } from "lodash";
import webpack, { Configuration } from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import StylelintPlugin from "stylelint-webpack-plugin";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");

/** 是否为开发环境 */
const isEnvDevelopment =
  process.env.NODE_ENV === "development" ? true : undefined;
/** 是否为生产环境 */
const isEnvProduction =
  process.env.NODE_ENV === "production" ? true : undefined;
/** 是否使用 Source maps */
const shouldUseSourceMap = false;
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
  appHtml: path.resolve(__dirname, "public/index.html"),
  appNodeModules: path.resolve(__dirname, "node_modules"),
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
const webpackConfig: DevConfiguration = {
  mode: isEnvProduction
    ? "production"
    : isEnvDevelopment
    ? "development"
    : "none",
  bail: isEnvProduction,
  entry: {
    index: ["./src/index.tsx"],
  },
  output: {
    path: paths.appBuild,
    pathinfo: isEnvDevelopment,
    filename: isEnvProduction
      ? "static/js/[name].[contenthash:8].js"
      : isEnvDevelopment && "static/js/[name].bundle.js",
    chunkFilename: isEnvProduction
      ? "static/js/[name].[contenthash:8].chunk.js"
      : isEnvDevelopment && "static/js/[name].chunk.js",
    publicPath: "/",
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
            presets: [
              "@babel/preset-typescript",
              ["@babel/preset-env", { useBuiltIns: false }],
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
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
        test: /\.(png|jpg|jpeg|gif|bmp|svg)$/i,
        type: "asset",
        generator: {
          filename: "static/image/[name].[hash:8].[ext]",
        },
        include: paths.appSrc,
        exclude: /node_modules/,
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset",
        generator: {
          filename: "static/font/[name].[hash:8].[ext]",
        },
        include: paths.appSrc,
        exclude: /node_modules/,
      },
      {
        type: "asset/resource",
        generator: {
          filename: "static/media/[name].[hash:8].[ext]",
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
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: paths.appHtml,
        },
        {
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
      )
    ),
    isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
    isEnvDevelopment && new ReactRefreshWebpackPlugin(),
    isEnvProduction &&
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:8].css",
        chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
      }),
    isEnvDevelopment && new CaseSensitivePathsPlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    new ModuleNotFoundPlugin(paths.appPath),
    isEnvProduction &&
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
    isEnvProduction && new CleanWebpackPlugin(),
    isEnvProduction && new webpack.ids.HashedModuleIdsPlugin(),
    isEnvProduction && new BundleAnalyzerPlugin(),
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
  ]),
};

/** 测试环境接口声明 */
interface DevConfiguration extends Configuration {
  devServer?: {
    static: {
      watch: boolean;
    };
  };
}

if (isEnvDevelopment) {
  webpackConfig.devServer = {
    static: {
      watch: false,
    },
  };
}

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

export default webpackConfig;


```


#### 8) postcss-loader 配置

`yarn add -D cssnano postcss postcss-flexbugs-fixes postcss-normalize postcss-preset-env postcss-px-to-viewport`

在之前的 `postcss-loader` 部分进行配置:

```ts

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
        [
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

```

`postcss-px-to-viewport` 可以根据项目是否是移动端项目来选择是否添加


#### 9) 添加一个简单的 serve

`yarn add -D serve`

然后在 package.json 中添加

```json

{
  ...
  "scripts": {
    ...
    "serve": "serve -s build -l 8080"
  },
  ...
}

```

`yarn serve` 就会在 `8080` 端口访问 `build` 文件夹内的静态资源


### 4. 安装和配置 jest 非必须步骤

`yarn add -D jest ts-jest babel-jest jest-circus @testing-library/jest-dom jest-watch-typeahead @testing-library/react react-app-polyfill`

在根目录生成 `jest.config.ts` 文件，内容如下：

```ts

{
  /*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

const jestConfig = {
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  // bail: 0,

  // The directory where Jest should store its cached dependency information
  // cacheDirectory: "C:\\Users\\Ecma\\AppData\\Local\\Temp\\jest",

  // Automatically clear mock calls and instances between every test
  // clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  // collectCoverage: false,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of regexp pattern strings used to skip coverage collection
  // coveragePathIgnorePatterns: [
  //   "\\\\node_modules\\\\"
  // ],

  // Indicates which provider should be used to instrument code for coverage
  // coverageProvider: "babel",

  // A list of reporter names that Jest uses when writing coverage reports
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],

  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: undefined,

  // A path to a custom dependency extractor
  // dependencyExtractor: undefined,

  // Make calling deprecated APIs throw helpful error messages
  // errorOnDeprecated: false,

  // Force coverage collection from ignored files using an array of glob patterns
  // forceCoverageMatch: [],

  // A path to a module which exports an async function that is triggered once before all test suites
  // globalSetup: undefined,

  // A path to a module which exports an async function that is triggered once after all test suites
  // globalTeardown: undefined,

  // A set of global variables that need to be available in all test environments
  // globals: {},

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  // maxWorkers: "50%",

  // An array of directory names to be searched recursively up from the requiring module's location
  // moduleDirectories: [
  //   "node_modules"
  // ],

  // An array of file extensions your modules use
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    "^react-native$": "react-native-web",
    "^@$": "<rootDir>/src",
  },

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  // modulePathIgnorePatterns: [],

  // Activates notifications for test results
  // notify: false,

  // An enum that specifies notification mode. Requires { notify: true }
  // notifyMode: "failure-change",

  // A preset that is used as a base for Jest's configuration
  preset: "ts-jest",

  // Run tests from one or more projects
  // projects: undefined,

  // Use this configuration option to add custom reporters to Jest
  // reporters: undefined,

  // Automatically reset mock state between every test
  resetMocks: true,

  // Reset the module registry before running each individual test
  // resetModules: false,

  // A path to a custom resolver
  // resolver: undefined,

  // Automatically restore mock state between every test
  // restoreMocks: false,

  // The root directory that Jest should scan for tests and modules within
  // rootDir: undefined,

  // A list of paths to directories that Jest should use to search for files in
  roots: ["<rootDir>/src"],

  // Allows you to use a custom runner instead of Jest's default test runner
  // runner: "jest-runner",

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: ["react-app-polyfill/jsdom"],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  // slowTestThreshold: 5,

  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  // snapshotSerializers: [],

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // Options that will be passed to the testEnvironment
  // testEnvironmentOptions: {},

  // Adds a location field to test results
  // testLocationInResults: false,

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}",
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  // testPathIgnorePatterns: [
  //   "\\\\node_modules\\\\"
  // ],

  // The regexp pattern or array of patterns that Jest uses to detect test files
  // testRegex: [],

  // This option allows the use of a custom results processor
  // testResultsProcessor: undefined,

  // This option allows use of a custom test runner
  testRunner: "jest-circus/runner",

  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
  // testURL: "http://localhost",

  // Setting this value to "fake" allows the use of fake timers for functions such as "setTimeout"
  // timers: "real",

  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)":
      "<rootDir>/config/jest/fileTransform.js",
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
    "^.+\\.module\\.(css|sass|scss)$",
  ],

  // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
  // unmockedModulePathPatterns: undefined,

  // Indicates whether each individual test should be reported during the run
  // verbose: undefined,

  // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
  // watchPathIgnorePatterns: [],

  // Whether to use watchman for file crawling
  // watchman: true,

  // The Jest watch plugin system provides a way to hook into specific parts of Jest and to define watch mode menu prompts that execute code on key press. Combined, these features allow you to develop interactive experiences custom for your workflow.
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
};

export default jestConfig;

}

```

其中需要手动插入两个 `transformers` 文件，这里把配置放在根目录 `config/jest` 目录下

```js
// cssTransform.js

// This is a custom Jest transformer turning style imports into empty objects.
// http://facebook.github.io/jest/docs/en/webpack.html

module.exports = {
  process() {
    return "module.exports = {};";
  },
  getCacheKey() {
    // The output is always the same.
    return "cssTransform";
  },
};


```

```js
// fileTransform.js
const path = require("path");
const camelcase = require("camelcase");

// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/en/webpack.html

module.exports = {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));

    if (filename.match(/\.svg$/)) {
      // Based on how SVGR generates a component name:
      // https://github.com/smooth-code/svgr/blob/01b194cf967347d43d4cbe6b434404731b87cf27/packages/core/src/state.js#L6
      const pascalCaseFilename = camelcase(path.parse(filename).name, {
        pascalCase: true,
      });
      const componentName = `Svg${pascalCaseFilename}`;
      return `const React = require('react');
      module.exports = {
        __esModule: true,
        default: ${assetFilename},
        ReactComponent: React.forwardRef(function ${componentName}(props, ref) {
          return {
            $$typeof: Symbol.for('react.element'),
            type: 'svg',
            ref: ref,
            key: null,
            props: Object.assign({}, props, {
              children: ${assetFilename}
            })
          };
        }),
      };`;
    }

    return `module.exports = ${assetFilename};`;
  },
};

```

jest 的 setupFilesAfterEnv 配置，这里放在 `scr` 目录下

```ts
// src/setupTests.ts

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

```

这些测试配置可以根据个人习惯来配置

最后在 `package.json` 中插入 jest 测试语句

```json

{
  ...
  "scripts": {
    ...
    "test": "jest --watchAll"
  },
  ...
}

```




到此基本框架搭建完成，SPA 项目可以直接使用当前配置

如果出现多个项目整合在一个框架内的情况，可以自行添加配置


添加了多项入口的配置，以及一些项目配置
