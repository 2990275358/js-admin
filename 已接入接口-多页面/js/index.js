import { queryDom, setIcon, setActiveClass } from "./utils/index.js";
import { cache } from "./utils/local_cache.js";
import { menuData } from "./data.js";

class MenuControl {
  menuInfo = [];
  constructor(goods) {
    if (!Array.isArray(goods) || goods.length === 0) {
      console.warn("初始化参数有误！");
      return;
    }
    this.menuInfo = this.toTree(goods);
  }
  toTree(arr = []) {
    const newArr = [];
    arr.map((res) => {
      res.children = arr.filter((ret) => ret.pid == res.id);
      if (!res.pid) {
        newArr.push(res);
      }
    });
    return newArr;
  }
  getMenus() {
    return this.menuInfo;
  }
}
const navigationList = [{ name: "用户管理", path: "user.html" }];
let curPath = "user.html";
// 设置登录信息
function setLoginInfo() {
  if (!cache.getItem("jsa_isLogin")) {
    window.location.href = "register.html";
    return;
  }
  const info = cache.getItem("jsa_loginInfo");
  queryDom(".user-name").innerText = `欢迎，${info.name}`;
  queryDom(".page-avatar").setAttribute(
    "src",
    `http://localhost:9000/${info.avatar}`
  );
  queryDom(".page-avatar").classList.remove("none");
}
/**
 * 创建一个导航
 * @param {Object} data 导航的内容
 * @returns
 */
function createNavigation(data) {
  const div = document.createElement("div");
  const img = document.createElement("img");
  img.setAttribute("src", "img/cha_icon.png");
  img.setAttribute("alt", "叉");
  img.classList.add("small-icon", "cha");
  Object.assign(div.dataset, {
    path: data.path,
  });
  div.classList.add("navigation-item", "flex");
  const span = document.createElement("span");
  span.textContent = data.name;
  div.appendChild(span);
  div.appendChild(img);
  if (curPath == data.path) {
    div.classList.add("navigation-active");
  }
  // 给导航元素绑定点击事件，点击跳转到对应页面
  div.addEventListener("click", function (e) {
    e.stopPropagation();
    const target =
      Object.keys(e.target.dataset).length === 0
        ? e.target.parentElement
        : e.target;
    const { path } = target.dataset;
    if (curPath === path) return;
    setRouter(path);
    // 获取所有菜单，设置菜单的选中状态
    const menuItemAllEl = queryDom(".menu-item", "true");
    for (const el of menuItemAllEl) {
      const { path: itemPath, type } = el.dataset;
      if (itemPath === curPath && type === "2") {
        setActiveClass(el, ".menu-item", "item-active");
      }
    }
    setActiveClass(target, ".navigation-item", "navigation-active");
  });
  // 给导航元素的叉绑定点击事件，点击删除对应的元素
  img.addEventListener("click", function (e) {
    e.stopPropagation();
    const target = e.target.parentElement;
    const { path } = target.dataset;
    if (curPath === path)
      return message({
        text: "正处于当前路由，不能删除~",
        type: "warning",
      });
    const index = navigationList.findIndex((res) => res.path === path);
    navigationList.splice(index, 1);
    const child = target.parentElement.childNodes[index];
    target.parentElement.removeChild(child);
  });
  return div;
}
function setNavigation() {
  const divs = [];
  for (const item of navigationList) {
    divs.push(createNavigation(item));
  }
  divs.forEach((div) => queryDom(".navigation").appendChild(div));
}
// 设置路由
function setRouter(path) {
  queryDom(".iframe").setAttribute("src", path);
  curPath = path;
}
function createMenu(selector) {
  const menuC = new MenuControl(menuData);
  const menuInfo = menuC.getMenus();
  const ul = document.createElement("ul");
  ul.classList.add("menu");
  for (const menu of menuInfo) {
    const li = document.createElement("li");
    li.classList.add("menu-item");
    if (menu.icon) {
      setIcon(menu.icon, menu.name, li);
    } else {
      li.textContent = menu.name;
    }
    if (menu.type === "1") {
      const img = document.createElement("img");
      img.setAttribute("src", "img/pull_down_icon.png");
      img.setAttribute("alt", "下拉");
      img.classList.add("pull-down", "normal-icon", "spin-icon");
      li.insertBefore(img, li.firstChild);
      const cul = document.createElement("ul");
      for (const cmenu of menu.children) {
        const cli = document.createElement("li");
        if (cmenu.icon) {
          setIcon(cmenu.icon, cmenu.name, cli);
        } else {
          cli.textContent = cmenu.name;
        }
        Object.assign(cli.dataset, {
          name: cmenu.name,
          path: cmenu.path,
          type: cmenu.type,
        });
        // 给当前路由添加激活样式
        if (curPath === cmenu.path) {
          setActiveClass(cli, ".menu-item", "item-active");
        }
        cli.classList.add("menu-item", "menu-children");
        cul.appendChild(cli);
      }
      li.appendChild(cul);
    }
    Object.assign(li.dataset, {
      name: menu.name,
      path: menu.path,
      type: menu.type,
    });
    ul.appendChild(li);
  }
  queryDom(selector).appendChild(ul);
  // 给菜单绑定事件
  ul.addEventListener("click", function (e) {
    e.stopPropagation();
    const target = e.target;
    const { name, type, path } = target.dataset;
    if (type === "1") {
      const childrenEls = target.children;
      // 图片的翻转，表示展开还是关闭二级菜单
      if (childrenEls[0].classList.contains("spin-icon")) {
        childrenEls[0].classList.remove("spin-icon");
        childrenEls[1].classList.add("none");
      } else {
        childrenEls[0].classList.add("spin-icon");
        childrenEls[1].classList.remove("none");
      }
    } else if (target.nodeName === "LI" && curPath != path) {
      if (!cache.getItem("jsa_isLogin") && path !== "register.html") {
        return message({ text: "您还没有登录呢", type: "err" });
      }
      setRouter(path);
      if (!navigationList.some((res) => res.name === name)) {
        navigationList.push({ name, path });
        const div = createNavigation({ name, path });
        setActiveClass(div, ".navigation-item", "navigation-active");
        queryDom(".navigation").appendChild(div);
      } else {
        const navAll = queryDom(".navigation-item", true);
        for (const nav of navAll) {
          if (nav.dataset.path === path) {
            setActiveClass(nav, ".navigation-item", "navigation-active");
            break;
          }
        }
      }
      setActiveClass(target, ".menu-item", "item-active");
    }
  });
  setNavigation(navigationList);
}
window.onload = () => {
  // 检查是否登录，登录了将信息展示在页面
  setLoginInfo();
  // 创建菜单
  createMenu(".menu-box");
  queryDom(".loginout").addEventListener("click", () => {
    const isOut = prompt("确定要退出吗？y/n");
    if (isOut === "y") {
      cache.remove("jsa_isLogin");
      setLoginInfo();
    }
  });
};
