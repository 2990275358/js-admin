/**
 * 判断是否是一个纯对象
 * @param {Object} obj 要判断的对象
 * @returns 判断的结果
 */
const isPainObject = (obj) => {
  if (typeof obj !== "object" || obj === null) return false;
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
};
/**
 * 将对象拼接成get请求参数
 * @param data 要拼接的对象
 * @returns 拼接后的字符串
 */
const qs = (data) => {
  if (Object.keys(data).length === 0) return "";
  let str = "";
  for (const key in data) {
    str += `${key}=${data[key]}&`;
  }
  str = str.substring(0, str.length - 1);
  return encodeURI(str);
};

qs.parse = (str) => {
  if (typeof str !== "string" || str === "") return {};
  str = /^\?/.test(str) ? str.substring(1) : str;
  const strArr = str.split("&"),
    result = {},
    len = strArr.length;
  if (len === 0) return {};
  for (let i = 0; i < len; i++) {
    const target = strArr[i].split("=");
    result[target[0]] = decodeURI(target[1]);
  }
  return result;
};

const timeOutControl = (promise, controller, timeout = 6000) => {
  const timeErr = new Error("请求超时");
  const errPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(timeErr);
    }, timeout);
  });
  return Promise.race([promise, errPromise]).catch((err) => {
    if (err.message === "请求超时") {
      controller.abort();
    }
    return Promise.reject(err);
  });
};
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}
function funcExtend(a, b, that) {
  const keys = Object.keys(b);
  const len = keys.length;
  for (let i = 0; i < len; i++) {
    const key = keys[i];
    const val = b[key];
    if (that && typeof val === "function") {
      a[key] = bind(val, that);
    } else {
      a[key] = val;
    }
  }
  return a;
}

export { isPainObject, qs, timeOutControl, bind, funcExtend };
