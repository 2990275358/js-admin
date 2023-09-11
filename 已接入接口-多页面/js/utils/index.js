/**
 * 获取dom元素
 * @param {String} selector 选择器
 * @param {Boolean} isAll 是否选择全部
 * @returns {Element} 选择的dom
 */
function queryDom(selector, isAll = false) {
  if (isAll) {
    return document.querySelectorAll(selector);
  }
  return document.querySelector(selector);
}
/**
 * 给当前操作的dom加上类名，其他未操作dom删除类名
 * @param {HTMLEmelent} target 当前的dom
 * @param {String} selector 类选择器,需要带上"."
 * @param {String} className 要设置的类名，不需要带"."
 */
function setActiveClass(target, selector, className) {
  const itemAll = queryDom(selector, true);
  for (const el of itemAll) {
    el.classList.remove(className);
  }
  target.classList.add(className);
}
/**
 * 消息提醒
 * @param {Object} obj 消息配置 {text:"",type:"err"|"success"|"warning"}
 */
const messageColorMap = {
  err: ["#FEF0EF", "#F67172", "icon-shibai"],
  warning: ["#FDF5EB", "#E6A23C", "icon-jinggao"],
  success: ["#EFF9EA", "#6FC442", "icon-chenggong"],
};
const message = (obj, type = "success") => {
  let config = typeof obj === "object" ? obj : {};
  if (typeof obj === "string") config = { text: obj, type };
  const div = document.createElement("div");
  const colors = messageColorMap[config.type] || messageColorMap["success"];
  div.innerHTML = `<i style="font-size:18px;margin-right:10px;" class="iconfont ${colors[2]}"></i>${obj.text}`;
  Object.assign(div.style, {
    width: "380px",
    height: "40px",
    borderRadius: "5px",
    padding: "10px",
    boxSizing: "border-box",
    position: "absolute",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "16px",
  });
  div.style.backgroundColor = colors[0];
  div.style.color = colors[1];
  document.body.appendChild(div);
  setTimeout((_) => document.body.removeChild(div), 800);
};
/**
 * 返回图片blob链接
 * @param {*} file 图片文件
 * @returns
 */
function getImgUrl(file) {
  const blob = new Blob([file], { type: file.type });
  return URL.createObjectURL(blob);
}
/**
 * 给元素添加一个图标 菜单、按钮
 * @param {String} icon 图标类名
 * @param {String} text 文字
 * @param {Dom} el dom元素
 */
function setIcon(icon, text, el) {
  const i = document.createElement("i");
  i.classList.add("iconfont", icon);
  i.style.marginRight = "5px";
  el.appendChild(i);
  el.appendChild(document.createTextNode(text));
}
/**
 * 将对象的key转为全部小写
 * @param {object} obj 要处理的对象
 * @returns 转换后的对象
 */
function bigKeyToLower(obj) {
  const result = {};
  for (const key in obj) {
    result[key.toLowerCase()] = obj[key];
  }
  return result;
}
/**
 * 时间格式转换
 * @param {Number} timestamp 时间戳
 * @param {String} format 格式
 * @returns
 */
function formatTime(timestamp, format = "yyyy/MM/dd HH:mm:ss") {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  format = format.replace(/yyyy/g, year);
  format = format.replace(/MM/g, month.toString().padStart(2, "0"));
  format = format.replace(/dd/g, day.toString().padStart(2, "0"));
  format = format.replace(/HH/g, hour.toString().padStart(2, "0"));
  format = format.replace(/mm/g, minute.toString().padStart(2, "0"));
  format = format.replace(/ss/g, second.toString().padStart(2, "0"));

  return format;
}

/**
 * 数组的简单去重，根据数组内对象的某一字段匹配进行去重
 * @param {array} arr 要去重的数组
 * @param {string} key 判断的键值默认为id
 * @returns 处理过后的数组
 */
function rd(arr, key = "id") {
  arr = Array.isArray(arr) ? arr : [];
  const result = arr.reduce((pre, cur) => {
    if (!pre.some((item) => item[key] === cur[key])) {
      pre.push(cur);
    }
    return pre;
  }, []);
  return result;
}
/**
 * 获取数据类型
 * @param {*} data 要判断的数据
 * @returns 判断的类型
 */
const verifyType = (data) => {
  let result = typeof data;
  if (result !== "object") return result;
  return Object.prototype.toString
    .call(data)
    .match(/\[object\s(.*)\]/)[1]
    .toLowerCase();
};
const clone = (originValue) => {
  if (
    verifyType(originValue) === "null" ||
    verifyType(originValue) === "undefined"
  )
    return {};
  return { ...originValue };
};
clone.deep = (originValue) => {
  if (
    verifyType(originValue) === "null" ||
    verifyType(originValue) === "undefined"
  )
    return {};
  const map = new WeakMap();
  function _recursion(originValue, map) {
    // 判断如果是Symbol的value，那么创建一个新的Symbol
    if (typeof originValue === "symbol") {
      return Symbol(originValue.description);
    }

    // 判断如果是函数类型，那么直接使用同一个函数
    if (typeof originValue === "function") {
      return originValue;
    }

    // 判断传入的originValue是否是一个对象类型
    if (typeof originValue !== "object") {
      return originValue;
    }

    if (originValue instanceof Set) {
      return new Set([...originValue]);
    }
    if (originValue instanceof Map) {
      return new Map([...originValue]);
    }
    if (map.has(originValue)) {
      return map.get(originValue);
    }
    // 判断传入的originValue是数组还是对象
    const newObject = Array.isArray(originValue) ? [] : {};
    map.set(originValue, newObject);
    for (const key in originValue) {
      newObject[key] = _recursion(originValue[key], map);
    }
    // 对Symbol的key进行特殊处理
    const symbolKye = Object.getOwnPropertySymbols(originValue);
    for (const sKey of symbolKye) {
      newObject[sKey] = _recursion(originValue[sKey], map);
    }
    return newObject;
  }
  return _recursion(originValue, map);
};
const util = {
  queryDom,
  setIcon,
  setActiveClass,
  bigKeyToLower,
  formatTime,
  getImgUrl,
  message,
  rd,
  verifyType,
  clone,
};

export {
  queryDom,
  setIcon,
  setActiveClass,
  bigKeyToLower,
  formatTime,
  getImgUrl,
  message,
  rd,
  verifyType,
  clone,
};

export default util;
