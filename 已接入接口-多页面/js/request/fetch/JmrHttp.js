import { isPainObject, qs, timeOutControl } from "./utils.js";

// 拦截器管理，可以注册多个拦截器
class InterceptorsManage {
  constructor() {
    this.eventlist = [];
  }
  use(fn) {
    if (typeof fn !== "function" || this.eventlist.some((f) => f === fn)) {
      return;
    }
    this.eventlist.push(fn);
  }
  call(thisArg, ...arg) {
    let obj = {};
    for (const fn of this.eventlist) {
      obj = Object.assign(obj, fn.call(thisArg, ...arg));
    }
    return obj;
  }
  size() {
    return this.eventlist.length;
  }
}

class JmrHttp {
  defaultConfig = {
    timeout: 6000,
  };
  interceptors = {};
  constructor(config) {
    if (!isPainObject(config)) config = {};
    this.defaultConfig = Object.assign(this.defaultConfig, config);
    this.interceptors = {
      request: new InterceptorsManage(),
      response: new InterceptorsManage(),
    };
  }
  request(config) {
    // 给请求添加默认值
    config = Object.assign(
      {
        method: "GET",
        headers: null,
        params: null,
        body: null,
        responseType: "json",
        signal: null,
      },
      this.defaultConfig,
      config
    );
    // 执行请求拦截
    if (this.interceptors.request.size()) {
      config = this.interceptors.request.call(this, config);
    }
    let {
      url,
      method,
      body,
      headers,
      params,
      signal,
      responseType,
      timeout,
      baseUrl = "",
    } = config;
    // 判断对参数做容错处理
    if (!isPainObject(params)) params = {};
    if (!isPainObject(headers)) {
      headers = { "Content-Type": "application/json" };
    } else if (!headers["Content-Type"]) {
      // 避免传了请求头但是没有传请求类型
      headers["Content-Type"] = "application/json";
    }
    // 做url的拼接
    url = baseUrl + url;
    if (Object.keys(params).length) {
      url += `${/\?/.test(url) ? "&" : "?"}${qs(params)}`;
    }
    if (method.toLowerCase() === "get" && body) {
      url += qs(body);
    }
    // 如果存在body需要做序列化
    if (body && isPainObject(body)) {
      body = JSON.stringify(body);
    }
    // 最后参数的合并
    config = {
      url,
      method,
      headers,
    };
    // 如果存在可取消的签名，则添加上
    const controller = new AbortController();
    Object.assign(config, { signal: controller.signal });
    // get请求不能存在body参数，但是如果传了和params一样处理
    if (method.toLowerCase() !== "get" && body) {
      config = Object.assign(config, { body });
    }
    if (signal) {
      config = Object.assign(config, { signal });
    }
    // fetch请求超时停止的功能，所以通过timeOutControl来实现
    return timeOutControl(
      fetch(url, config)
        .then((response) => {
          if (!/^(2|3)\d{2}/.test(response.status)) {
            return Promise.reject({
              status: response.status,
              msg: response.statusText,
            });
          }
          let result = {};
          // 根据请求类型返回需要的数据类型
          switch (responseType.toLowerCase()) {
            case "text":
              result = response.text();
              break;
            case "arraybuffer":
              result = response.arrayBuffer();
              break;
            case "bolb":
              result = response.blob();
              break;
            default:
              result = response.json();
              break;
          }
          return result;
        })
        .then((res) => {
          // 执行响应拦截
          if (this.interceptors.response.size()) {
            res = this.interceptors.response.call(this, res);
          }
          return Promise.resolve(res);
        }),
      controller,
      timeout
    );
  }
}

["GET", "DELETE", "OPTIONS", "HEAD"].forEach((method) => {
  JmrHttp.prototype[method.toLowerCase()] = function (url, config) {
    if (!isPainObject(config)) config = {};
    return this.request(Object.assign({ url, method }, config));
  };
});
["POST", "PUT", "PATCH"].forEach((method) => {
  JmrHttp.prototype[method.toLowerCase()] = function (url, body, config) {
    if (!isPainObject(config)) config = {};
    if (
      !isPainObject(body) &&
      Object.prototype.toString.call(body) !== "[object FormData]"
    ) {
      body = {};
    }
    if (Object.prototype.toString.call(body) !== "[object FormData]") {
      body = JSON.stringify(body);
    }
    return this.request(
      Object.assign(
        {
          url,
          method,
          body,
        },
        config
      )
    );
  };
});

export default JmrHttp;
