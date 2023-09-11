import _ from "./utils/index.js";
import { rform } from "./render/render-form.js";
import RenderTable from "./render/render-table.js";
import RenderDialog from "./render/render-dialog.js";
import DataModel from "./utils/data_model.js";
import {
  getList,
  addData,
  updateData,
  removeData,
} from "./request/user.api.js";
import {
  getGoodsColumns,
  addGoodsConfig,
  filterGoodsConfig,
} from "./config/goods.config.js";
import {
  getUserColumns,
  addUserConfig,
  filterUserConfig,
} from "./config/user.config.js";

const config_map = {
  user: {
    filter: filterUserConfig,
    columns: getUserColumns(() => {}),
    add: addUserConfig,
  },
  goods: {
    filter: filterGoodsConfig,
    columns: getGoodsColumns(() => {}),
    add: addGoodsConfig,
  },
};
const navbarBtns = [
  {
    text: "删除所选",
    imgIcon: "img/remove_icon.png",
    class: "my-btn del",
    click: handleSelectAll,
  },
  {
    text: "添加",
    imgIcon: "img/add_white_icon.png",
    class: "my-btn add",
    click: handleAdd,
  },
];
let addDialog = null;
let ids = [];
let isOks = [];
let imgs = [];
function handleSelectAll() {
  console.log("删除所选");
}
function handleAdd() {
  addDialog.show();
}
// 创建操作按钮
function createdBtn(opt) {
  opt = _.clone.deep(opt);
  const { imgIcon } = opt;
  delete opt.imgIcon;
  const [btnEl] = _.createdEl("div", opt);
  if (imgIcon) {
    const [imgEL] = _.createdEl("img", { class: "middle-icon", src: imgIcon });
    btnEl.insertBefore(imgEL, btnEl.firstChild);
  }
  return btnEl;
}
// 生成表格顶部的工具栏
function renderNavbarBtn() {
  const [navbar, append] = _.createdEl("div", { class: "navbar flex p-lr-20" });
  for (const bOpt of navbarBtns) {
    append(createdBtn(bOpt));
  }
  _.queryDom(".page-content").insertBefore(navbar, _.queryDom(".my-table-box"));
}
function handleClickAddDialog(type) {
  if (type === "cancel") {
    addDialog.hied();
  }
}
function setImgs(urls) {
  const imgBox = _.queryDom(".img-box");
  clearImgs();
  imgs = urls;
  for (const url of urls) {
    const img = document.createElement("img");
    img.className = "btn-info";
    // img.src = "http://localhost:9000/" + url;
    img.src = url;
    imgBox.appendChild(img);
  }
}
function clearImgs() {
  imgs = [];
  _.queryDom(".img-box").innerHTML = "";
}
function handleImgChange(e) {
  const { files } = e.target;
  const urls = [];
  for (const file of files) {
    urls.push(_.getImgUrl(file));
  }
  setImgs(urls);
}
// 更改添加模态框
function changeAddDialog(path) {
  const [contentEl] = _.createdEl("div", {
    class: "dialog-content add-dialog-content",
  });
  const [dialogImg, dialogImgAppend] = _.createdEl("div", {
    class: "dialog-img flex",
  });
  const [imgBoxEl] = _.createdEl("div", { class: "img-box flex" });
  const [labelEL, labelElAppend] = _.createdEl("label", {
    id: "imgBtn",
    class: "btn-info",
  });
  const [inputEl] = _.createdEl("input", {
    class: "fileInput",
    accept: "image/*",
    multiple: "true",
    type: "file",
    style: "left: -9999px; position: absolute",
    change: handleImgChange,
  });
  labelElAppend(inputEl);
  dialogImgAppend([
    imgBoxEl,
    labelEL,
    _.createdEl("div", {
      class: "my-btn kuang clear",
      text: "清空",
      click: clearImgs,
    })[0],
  ]);
  addDialog = new RenderDialog({
    className: "add-dialog dialog",
    title: `添加${path === "user" ? "用户" : "商品"}`,
    content: [contentEl, dialogImg],
    click: handleClickAddDialog,
  });
}

export default async function renderContent(path) {
  // 初始化/还原内容区域
  const nav = _.queryDom(".navbar");
  if (nav) {
    _.queryDom(".page-content").removeChild(nav);
  }
  _.queryDom(".my-table-box").innerHTML = "";
  changeAddDialog(path);
  const columns = config_map[path].columns;
  const addConfig = config_map[path].add;
  const filterConfig = config_map[path].filter;
  isOks = rform.render(addConfig, ".add-dialog-content");
  console.log(isOks);
  // 查询用户列表,并将数据交给数据模型管理
  const list = await getList(path);
  const dataControl = new DataModel(list);
  // 生成表格
  const rTable = new RenderTable({
    columns,
    option: {
      zebraColor: "#F0F0F0",
      isZebra: false,
    },
    data: dataControl.get(),
  });
  rTable.createTable();
  renderNavbarBtn();
}
