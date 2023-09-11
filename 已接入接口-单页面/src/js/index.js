import _ from "./utils/index.js";
import { cache } from "./utils/local_cache.js";
import { pubsub } from "./utils/pubsub.js";
import RenderDialog from "./render/render-dialog.js";
import { MenuControl } from "./utils/index.js";
import { HOST, menuData } from "./config/common.config.js";
// 生成页面内容
import loginOrRegister from "./register.js";
import renderContent from "./conten.js";
import renderOther from "./other.js";

let localInfo = null;
let curPath = "user";
const navigationList = [];
// 生成dialog框
const hintDialog = new RenderDialog({
  className: "dialog hint-dialog",
  content: "确定退出吗？",
  click: handleLoginOut,
});
// 创建导航，生成导航块
function createNavigation(data) {
  const { name, path } = data;
  const [divEl, divAppend] = _.createdEl("div", {
    class: "navigation-item flex",
    "data-path": path,
  });
  const [imgEL] = _.createdEl("img", {
    class: "small-icon cha",
    src: "img/cha_icon.png",
    alt: "叉",
  });
  const [spanEl] = _.createdEl("span", { text: name });
  divAppend([spanEl, imgEL]);
  return divEl;
}
// 处理点击菜单
function handleClickMenuItem(e) {
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
    changePath(path);
    setNavigation({ name, path });
    _.setActiveClass(target, ".menu-item", "item-active");
  }
}
function queryActiveNav(path) {
  const navigationEls = _.queryDom(".navigation-item", true);
  for (const navigation of navigationEls) {
    if (navigation.dataset["path"] === path) {
      return navigation;
    }
  }
}
// 设置导航
function setNavigation(data) {
  if (navigationList.some((item) => item.name === data.name)) {
    const navigation = queryActiveNav(data["path"]);
    _.setActiveClass(navigation, ".navigation-item", "navigation-active");
    return;
  }
  navigationList.push(data);
  const div = createNavigation(data);
  _.setActiveClass(div, ".navigation-item", "navigation-active");
  _.queryDom(".navigation").appendChild(div);
}
// 创建菜单
function createMenu(selector) {
  const menuC = new MenuControl(menuData);
  const menuInfo = menuC.getMenus();
  const [ul, ulAppend] = _.createdEl("ul", { class: "menu" });
  for (const menu of menuInfo) {
    const [li] = _.createdEl("li", { class: "menu-item" });
    if (menu.icon) {
      _.setIcon(menu.icon, menu.name, li);
    } else {
      li.textContent = menu.name;
    }
    if (menu.type === "1") {
      const [img] = _.createdEl("img", {
        class: "pull-down normal-icon spin-icon",
        src: "img/pull_down_icon.png",
        alt: "下拉",
      });
      li.insertBefore(img, li.firstChild);
      const cul = document.createElement("ul");
      for (const cmenu of menu.children) {
        const cli = document.createElement("li");
        if (cmenu.icon) {
          _.setIcon(cmenu.icon, cmenu.name, cli);
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
          _.setActiveClass(cli, ".menu-item", "item-active");
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
    ulAppend(li);
  }
  _.queryDom(selector).appendChild(ul);
  // 给菜单绑定事件
  ul.addEventListener("click", handleClickMenuItem);
  setNavigation({ name: "用户管理", path: "user" });
}
// 处理退出登录
function handleLoginOut(type) {
  if (type === "confirm") {
    _.setActiveClass(_.queryDom(".main", true)[1], ".main", "none");
    cache.remove("jsa_loginInfo");
    loginOrRegister();
  }
  hintDialog.hied();
}
function changePath(path) {
  if (path === "register") return;
  curPath = path;
  if (["user", "goods"].includes(path)) {
    renderContent(curPath);
    return;
  }
  renderOther(path);
}
function renderMainContent() {
  _.queryDom(".user-name").innerText = `欢迎，${localInfo.name}`;
  _.queryDom(".page-avatar").setAttribute("src", `${HOST}${localInfo.avatar}`);
  _.queryDom(".page-avatar").classList.remove("none");
  _.queryDom(".loginout").addEventListener("click", () => {
    hintDialog.show();
  });
  createMenu(".menu-box");
  changePath("user");
}
// 检查登录状态，设置登录用户信息
function setLoginInfo() {
  const mainEls = _.queryDom(".main", true);
  localInfo = cache.getItem("jsa_loginInfo");
  if (!localInfo) {
    _.setActiveClass(mainEls[1], ".main", "none");
    loginOrRegister();
    changePath("register");
    return;
  }
  _.setActiveClass(mainEls[0], ".main", "none");
  renderMainContent();
}
function handelRemoveNav(imgEl) {
  const parent = imgEl.parentElement;
  const { path } = parent.dataset;
  if (curPath === path) {
    return _.message("当前导航禁止删除", "warning");
  }
  const navigation = queryActiveNav(path);
  // 在路由列表中找到要删除的路由的索引，并删除
  const index = navigationList.findIndex((item) => item.path === path);
  navigationList.splice(index, 1);
  _.queryDom(".navigation").removeChild(navigation);
}

window.onload = () => {
  setLoginInfo();
  pubsub.on("handleLogin", setLoginInfo);
  _.queryDom(".navigation").addEventListener("click", function (e) {
    e.stopPropagation();
    let el = e.target;
    if (el.classList.contains("navigation")) return;
    if (el.nodeName === "IMG") {
      return handelRemoveNav(el);
    }
    el = el.dataset["path"] ? el : el.parentElement;
    const path = el.dataset["path"];
    const menuItemEls = _.queryDom(".menu-item", true);
    changePath(path);
    for (const menu of menuItemEls) {
      if (menu.dataset["path"] === path) {
        _.setActiveClass(menu, ".menu-item", "item-active");
        break;
      }
    }
    // 找到导航当前点击的项设置选中样式
    const curNav = queryActiveNav(path);
    _.setActiveClass(curNav, ".navigation-item", "navigation-active");
  });
};

window.onunload = () => {
  pubsub.off("handleLogin");
};
