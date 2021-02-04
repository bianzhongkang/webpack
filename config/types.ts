/** 项目基础配置接口 */
export interface ProjectType {
  /** 项目是否为单页应用 */
  isSPA: boolean;
  /** 项目是否为 H5 应用, 主要用来区分是否开启 px to vw 转换 */
  isMobileApp: boolean;
  /** 项目是否为原生应用，用来区分 html 引用资源时相对路径还是绝对路径，为热更新设置 */
  isNative: boolean;
  /** 项目 html 页面的 title */
  title: string | { [name: string]: string };
  /** 项目使用的公共路径的基础路径，作为之后配置 publicPath 的基础，例如：some/where/ */
  basePath?: string;
  /** 当项目为原生应用时生成的 html 文件地址，例如：some/where */
  nativeHtmlPath?: string;
  /** 项目是否开启 source map 默认为 false */
  sourceMap?: boolean;
  /** 需要复制的依赖文件列表数组,
   * 注意，如果要使用 vendorsList，templatesList 必须为 pug
   * html 文件在测试环境不支持引入 vendors 文件
   * 但 pug 文件不支持 <%= htmlWebpackPlugin.options.title %> 写法
   * 折中两种模板共同使用 */
  vendorsList?: string[];
  /** 针对特殊页面使用特殊的模板文件，模板文件在 public 目录下，
   * 暂时只支持 .html, .pug，使用模板请完整定义文件名：index.html */
  templatesList?: string | { [name: string]: string };
  /** 项目进行数据交互时的 baseUrl */
  apiBaseUrl?: string;
  /** 当项目为热更新项目时使用的开发 Host 地址 */
  nativeDevHost?: string;
  /** 当项目为热更新项目时使用的生产 Host 地址 */
  nativeProdHost?: string;
}

/** 项目增强配置接口 */
export interface ProjectPlusType extends ProjectType {
  /** 当前项目名称 */
  name: string;
  /** 项目工作目录 */
  cwd: string;
  /** 项目使用的公共路径，网页应用为绝对路径 `/`, 原生应用为相对路径 `./` */
  publicPath: string;
  /** 是否启用 vconsole 控制台 */
  useVconsole: boolean;
  /** 是否启用 analyzer 包分析工具 */
  useAnalyzer: boolean;
  /** 当页面过多时，项目打开速度很慢，这个时候可以传入一个页面如：index,作为单页应用打开 */
  mpaSinglePage: string | undefined;
  /** 当项目为热更新 isNative 时，判断资源使用开发还是生产环境 */
  nativeIsDev: boolean;
  /** 当项目为热更新 isNative 时，使用的 Host 地址 */
  nativeHost: string | undefined;
}
