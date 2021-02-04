import axios from "axios";

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

// 创建 axios 实例
const Axios = axios.create(options);

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    const err = error;
    err.message = error.message || error.response.statusText;

    if (
      error.response &&
      error.response.status &&
      Number(error.response.status) === 903
    )
      err.message = "您尚未登录或登录会话已过期";

    if (error.message === "Network Error")
      err.message = "网络错误，请检查网络连接！";

    if (error.message === `timeout of ${options.timeout}ms exceeded`)
      err.message = "请求超时";

    return Promise.reject(err);
  }
);

export default Axios;
