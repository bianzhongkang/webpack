import path from "path";
import project, { ProjectList } from "./projects";
import { ProjectPlusType } from "./types";

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

/** 当前项目基础配置 */
const base = project[name];
/** 当项目为原生应用时生成的 html 文件地址 */
const nativeHtmlPath = base.nativeHtmlPath || base.basePath || "";
/** 当前项目附加配置 */
const config: ProjectPlusType = {
  ...base,
  name: name,
  cwd: path.resolve(
    __dirname,
    `../src/projects/${name}`,
    base.isSPA ? "" : "pages"
  ),
  basePath: base.basePath || "",
  nativeHtmlPath,
  sourceMap: base.sourceMap ? true : false,
  publicPath: base.isNative ? (nativeHtmlPath ? `../../` : "./") : `/`,
  mpaSinglePage: base.isSPA ? undefined : mpaSinglePage,
  nativeIsDev,
  nativeHost: nativeIsDev ? base.nativeDevHost : base.nativeProdHost,
  useVconsole,
  useAnalyzer,
};

export default config;
