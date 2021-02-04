import { GlobSync } from "glob";
import { Configuration } from "webpack";
import config from "./index";

/** GlobSync 的配置文件 */
const options = {
  cwd: config.cwd,
};

/**
 * 符合页面入口的 tsx 文件名称列表 exp:
 * 多页项目: ['XXXX/index.tsx']
 * 单页项目: ['index.tsx']
 */
const list: string[] = new GlobSync(
  config.isSPA ? "index.tsx" : "*/index.tsx",
  options
).found;

/** webpack config entry 配置对象 */
const entry: Configuration["entry"] = {
  /** 简单抽离的共用代码 */
  // vendors: ["react", "react-dom"],
};

/** 入口模块名称列表 */
export const chunkList: string[] = [];

// 处理仅想展示单个页面的状况
let mapList = list;

if (
  !config.isSPA &&
  config.mpaSinglePage &&
  process.env.NODE_ENV === "development"
) {
  mapList = list.filter(
    (value) => value.split("/")[0] === config.mpaSinglePage
  );
}

// 保证 mapList 的有效长度
if (mapList.length > 0) {
  mapList.forEach((val) => {
    /** webpack 入口模块名称 */
    const chunk = config.isSPA ? val.split(".")[0] : val.split("/")[0];
    // 配置入口
    entry[chunk] = {
      import: `./${val}`,
      // dependOn: "vendors",
    };
    // 入口数组复制
    chunkList.push(chunk);
  });
}

export default entry;
