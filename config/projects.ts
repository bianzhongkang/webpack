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

export default project;
