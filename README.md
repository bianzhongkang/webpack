# 框架介绍

使用本框架必须注意的一些内容

### 1. 使用 Visual Studio Code 进行开发

使用 VS Code 进行开发，需要安装如下几个插件:

#### 1) EditorConfig fro VS Code

用来统一编辑器编码风格

#### 2) ESLint

主要用于项目内脚本文件的编码风格统一以及错误提示

#### 3) stylelint

主要用于项目内样式文件的编码风格统一以及错误提示

### 2. 使用 yarn 安装项目

`yarn install` 在本地 node_modules 目录安装 package.json 里列出的所有依赖

`yarn add <package...>` 在 dependencies 里安装一个或多个包

`yarn add <package...> [--dev/-D]` 在 devDependencies 里安装一个或多个包

`yarn remove <package...>` 从依赖里移除包

### 3. 项目路径介绍

```m

|-- general-frame
    |-- .editorconfig                           // 编辑器风格配置
    |-- .eslintcache                            // eslint 缓存
    |-- .gitignore                              // git 忽略文件
    |-- .stylelintrc.json                       // stylelint 配置
    |-- jest.config.ts                          // jest 配置
    |-- package.json                            // package.json
    |-- README.md                               // readme.md
    |-- tsconfig.json                           // typescript 配置
    |-- webpack.config.ts                       // webpack 配置
    |-- .vscode                                 // vscode 配置
    |   |-- settings.json
    |-- config                                  // 项目配置文件夹
    |   |-- entry.ts                            // webpack 入口获取配置
    |   |-- index.ts                            // **启动项目配置**
    |   |-- projects.ts                         // **具体项目配置**
    |   |-- types.ts                            // 配置中用到的一些类型接口
    |   |-- jest                                // jest 配置中使用的一些 transformer
    |       |-- cssTransform.js
    |       |-- fileTransform.js
    |-- public                                  // html 模板文件夹
    |   |-- index.html
    |-- src                                     // 资源目录
        |-- react-app-env.d.ts                  // typescript 类型声明文件
        |-- reportWebVitals.ts                  // 性能测试工具
        |-- setupTests.ts                       // jest 测试的前置启动环境
        |-- assets                              // 通用资源文件夹
        |-- components                          // 通用组件文件夹
        |-- hooks                               // 通用的 hooks 文件夹
        |-- projects                            // 项目文件夹
        |   |-- mpa                             // 多页项目
        |   |   |-- ...                         // 项目自身的 assets components stores...
        |   |   |-- pages                       // 多页项目的页面文件夹
        |   |       |-- index                   // 多页项目 - index 页面
        |   |       |   |-- index.tsx           // 多页项目 - index 页面 - 入口文件
        |   |       |-- login                   // 多页项目 - login 页面
        |   |           |-- index.tsx           // 多页项目 - login 页面 - 入口文件
        |   |-- spa                             // 单页项目
        |       |-- index.tsx                   // 单页项目 - 入口文件
        |       |-- ...                         // 项目自身的 assets components stores...
        |-- stores                              // redux store - 状态仓库
        |   |-- index.ts                        // store - 入口 
        |   |-- rootReducer.ts                  // rootReducer - 整合 reducer
        |   |-- reducers                        // reducers - 目录下包含所有通用的 reducer
        |       |-- counter.ts
        |-- utils                               // 工具类文件夹
            |-- index.ts                        // 包含常用的一些通用方法

```

### 4. 需要关注的配置文件

#### 1） config/projects.ts

```ts

import { ProjectType } from "./types";

export enum ProjectList {
  /**单页测试项目 */
  spa = "spa",
  /**多页测试项目 */
  mpa = "mpa",
}

/** 项目配置列表对象 */
const project: { [name: string]: ProjectType } = {
  spa: {
    isSPA: true,
    isNative: true,
    isMobileApp: true,
    title: "SPA index",
  },
  mpa: {
    isSPA: false,
    isNative: false,
    isMobileApp: false,
    title: {
      index: "MPA index",
      login: "MPA login",
    },
  },
};
...

```

`projects.ts` 中需要注意的是 `ProjectList` 和 `project`

`ProjectList` 是一个枚举类，如果想要添加一个项目，就在 `ProjectList` 中添加项目名称即可：

项目名称需要和之后在 projects 文件夹内添加的文件夹名称保持一致

```ts

export enum ProjectList {
  ...
  /** 需要添加的项目的注释 */
  testProject = "testProject",
}

```

在 `ProjectList` 添加项目名称之后，就是要在 `project` 中添加对应的设置:

```ts

/** 项目配置列表对象 */
const project: { [name: string]: ProjectType } = {
  ...
  // 要添加的项目名称，需要和 ProjectList 中一致
  testProject: {
    // 必须配置 确定项目是单页应用还是多页应用
    // 主要区别在于入口文件的地址，比如说：
    // 单页应用 spa 的入口文件只有一个，位置是在 src/projects/spa/index.tsx
    // 多页应用 map 的入口文件有两个，位置分别在：
    // src/mpa/pages/index/index.tsx 和 src/mpa/pages/login/index.tsx
    // 仅仅是路径上的差别，入口文件必须是 index.tsx
    isSPA: true,
    // 必须配置 确定项目是否是 APP 内的热更新资源 由于是本地资源，所以只能使用相对路径
    // 主要区别在于页面资源的引用路径 分为绝对路径和相对路径
    // 如果是 APP 内的热更新资源，资源引用路径为../../static/js/xxx.js
    // 如果是热更新资源，则还需要配置一个 nativeHtmlPath 的路径
    // 如果 isNative 为 false，资源引用路径为 /static/js/xxx.js
    isNative: true,
    // 必须配置 确定项目是在移动端还是在 web 端
    // 主要是确定是否开启 px to vw 的单位转换
    isMobileApp: true,
    // 必须配置 项目页面的 title
    // 可以配置一个 string 设置所有页面的 title
    // 或者配置一个 Object 分别配置每一个页面的 titie
    title: "testProject index",
  },
};

```

上面是新建一个项目必须配置的一些配置，下面介绍一些可选配置：

```ts

{
  ...
  // 影响到 publicPath 的设置
  // 如果不设置,绝对路径项目默认为 /,
  // 相对路径项目默认为 ../../，所以对于 Native 项目来说，必须要设置 nativeHtmlPath 才能确保资源的正确引用
  // 设置了 basePath 后，就会在默认的路径后面添加设置的路径名
  // 比如是绝对路径项目中 basePath 设置为 my/path/
  // 打包生成的文件就会是 /my/path/index.html
  // 具体资源的路径就会使 /my/path/static/js/xxx.js
  // 相对路径就是把 / 替换成 ../../
  // 需要注意的是 basePath 的配置规则是 path/path/, string 前不需要 /，后一定要加上 /
  basePath?: string;
  // 当项目为原生应用时改变生成的 html 文件地址
  // 只有当 isNative 为 true 时才会使用到的值
  // 主要是针对 APP 热更新项目中的配置规则
  // 比如说某一个项目，在热更新中配置的地址是 hotUpdate
  // 在热更新中的页面资源就必须是 hotUpdate/project/hotUpdate/index.html
  // 其他资源的地址就是在 hotUpdate/static/js/xxx.js
  // 所以这里的 nativeHtmlPath 就设置成 project/hotUpdate 就行
  // 这个字段主要只是为了改变打包后生成的 html 路径地址
  // 配置规则和 basePath 一样，string 前不需要 /，后一定要加上 /
  nativeHtmlPath?: string;
  // 生产包是否要生成 sourceMap 默认是不生成 一般不需要进行配置
  sourceMap?: boolean;
  // 需要复制的依赖文件列表数组, 默认是从当前项目的 assets/vendors/ 下
  // 复制到打包文件夹 build 下的 /static/vendors/ 里
  // 注意，如果要使用 vendorsList，templatesList 中的 html 模板必须为 pug
  // html 文件在 webpack-dev-server 中不会引入虚拟环境中的 vendors 文件
  // 但 pug 文件不支持 <%= htmlWebpackPlugin.options.title %> 值的引入
  // 所以 .html 和 .pug 都在使用
  // 使用方式 比如说要复制 spa 项目中的 assets/vendors/cat.js 文件
  // 这里就需要在 vendorsList 的添加一个数组 ["cat.js"]
  // 同时在之后的 template.pug 中添加上这个资源的引用
  // 如果说 basePath 没有设置, 就在 .pug body 前添加 script(src="/statics/vendors/cat.js") 即可
  // 对不同的路径，确定资源的引用路径和其他资源一致就行
  // 注意的是如果需要使用复制依赖文件，则必须设置需要依赖页面的模板为 .pug
  vendorsList?: string[];
  // 针对特殊页面使用特殊的模板文件，模板文件在 public 目录下
  // 暂时只支持 .html, .pug，使用模板请完整定义文件名：index.html
  // 配置方式和必填配置 title 一样，可以是一个 string 也可以是一个 obj
  // 如：想要给 mpa 的 login 页面设置一个单独的模板,
  // templatesList: { login: 'login.html' } 即可，不设置则默认使用 index.html 作为模板
  templatesList?: string | { [name: string]: string };
  // 项目进行数据交互时的 baseUrl
  // 本项目中是作为 axios 请求的 baseURL 来使用
  // 配置格式为 /some/api
  // 注意 string 前有 / 结尾没有 /
  apiBaseUrl?: string;
  // 当项目为热更新项目时使用的开发 Host 地址
  // 配置格式为 http://localhost:8080
  nativeDevHost?: string;
  // 当项目为热更新项目时使用的生产 Host 地址
  // 配置格式为 http://localhost:8080
  nativeProdHost?: string;
}

```

#### 2） config/index.ts

```ts

...
/* ========== 需要进行手动配置的部分 start ========== */
/** 当前运行项目名称 */
const name = ProjectList.spa;
/** 当多页项目页面过多时，项目打开速度很慢，这个时候可以传入一个页面如：index,作为单页应用打开 */
const mpaSinglePage = "" || undefined;
/** 仅在热更新项目中使用的参数 判断请求接口环境为开发或者生产环境 */
const nativeIsDev = false;
/** 是否启用 vconsole 控制台 webpack 5 与插件不兼容 暂时弃用 */
const useVconsole = false;
/** 是否启用 analyzer 包分析工具 */
const useAnalyzer = false;
/* ========== 需要进行手动配置的部分 end   ========== */
...

```

vconsole 插件 不太兼容 webpack 5 版本，暂时不启作用

到这里，需要关注的配置项基本已经完成

当新建一个项目之后，就可以项目的类型在 `src/projects/` 下新建对应的文件夹

然后根据项目的类型创建不同路径的入口文件

单页应用为 `src/projects/单页应用名/index.tsx`

多页应用为 `src/projects/多页应用名/pages/多页应用页面名/index.tsx`

具体配置可以参考提供的 spa 和 mpa 项目


### 5. 开发中需要注意的情况

#### 1) 别名的使用

为了方便开发，我们一般会在引用资源时使用别名

在这个框架中，我们一般使用 `@project` 指向当前工作文件夹

对此我们需要做到下面几个设置:

在 `webpack.config.ts` 中：

```ts

{
  resolve: {
    alias: {
      ...
      "@project": path.resolve(__dirname, "src/projects", config.name),
    }
  }
}

```

在 `jest.config.ts` 中：

```ts

{
  ...
  moduleNameMapper: {
    ...
    "^@project/(.*)$": `<rootDir>/src/projects/${config.name}/$1`,
  }
}

```

在 `tsconfig.json` 中：

```json

{
  "compilerOptions": {
    ...
    paths: {
      ...
      "@project/*": [
        "src/projects/spa/*"
      ]
    }
  }
}

```

从配置项可以看出，由于 `webpack.config.ts` 和 `jest.config.ts` 都是脚本文件，所以可以使用 `config.name` 动态配置项目

而`tsconfig.json` 无法使用动态参数所以每次改变项目时，需要手动更改 `@project` 所引用的项目名称

例如：从 spa 项目切换到 mpa 项目

```json

{
  "compilerOptions": {
    ...
    paths: {
      ...
      "@project/*": [
        "src/projects/mpa/*"
      ]
    }
  }
}

```

#### 2) 公用模块不要随意修改

src 项目文件夹下的各种公共模块，例如：

components | hooks | stores | utils

公共模块下的导出模块，请不要随意修改

如果在公共模块无法满足当前项目需求时

可以在当前项目路径下复制一份公共模块的导出

例如：src/components/Button.tsx 无法满足 spa 项目的需求

那么就应该在 spa 项目中新建组件的备份 src/projects/spa/components/Button.tsx

然后修改项目内的组件来满足使用需求，而不是直接修改 src/components/Button.tsx 文件

为方便代码管理，请不要随意更改公用模块的内容

#### 3) 具体项目文件中要避免使用 src/config 下的配置

具体项目中不应该使用框架中的配置文件 `config.ts`

webpack 提供了一个插件来给运行的项目提供具体的变量：

```ts

{
  ...
  plugins: [
    ...
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.BASEURL": JSON.stringify(config.apiBaseUrl),
      "process.env.IS_NATIVE": config.isNative,
      "process.env.NATIVE_HOST": JSON.stringify(config.nativeHost),
    }),
    ...
  ]
  ...
}

```

比如在 `src/utils/axios.ts` 中，为了避免直接从 `src/config/index.ts` 中引用配置

可以使用上面插件提供的变量值来进行环境配置

```ts

...
const options = {
  withCredentials: true,
  timeout: 30000,
  baseURL: process.env.BASEURL,
};

// 针对 热更新静态资源 设置 host 地址
if (process.env.IS_NATIVE) {
  options.baseURL =
    `${process.env.NATIVE_HOST || ""}${process.env.BASEURL || ""}` || undefined;
}
...

```

如果有特殊的项目需求，可以在 `webpack.config.ts` 中添加需要的环境变量

#### 4) webpack-dev-server 访问多页应用时 301 重定向

webpack-dev-server 4.0.0-beta.0 不是正式版本，开启服务时可能会发生页面请求 301 重定向的问题

解决方法：Chrome 浏览器打开开发者工具(F12)，选择 NetWork 选项卡，勾选中下方 Disable cache 即可
