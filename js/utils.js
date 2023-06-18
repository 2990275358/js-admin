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
const message = (obj) => {
  const div = document.createElement("div");
  const colors = [];
  switch (obj.type) {
    case "err":
      colors.push("#FEF0EF", "#F67172", "icon-shibai");
      break;
    case "warning":
      colors.push("#FDF5EB", "#E6A23C", "icon-jinggao");
      break;
    case "success":
      colors.push("#EFF9EA", "#6FC442", "icon-chenggong");
      break;
    default:
      colors.push("#EFF9EA", "#6FC442", "icon-chenggong");
      break;
  }
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
function setIcon(icon, text, el) {
  const i = document.createElement("i");
  i.classList.add("iconfont", icon);
  i.style.marginRight = "5px";
  el.appendChild(i);
  el.appendChild(document.createTextNode(text));
}
