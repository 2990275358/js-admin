import { queryDom, getImgUrl, message, rd } from "./utils/index.js";
import { cache } from "./utils/local_cache.js";
import { getColumns, addConfig, filterConfig } from "./config/goods.config.js";
import { rform } from "./render/render-form.js";
import RenderTable from "./render/render-table.js";
import DataModeel from "./utils/data_model.js";
import { uploadImage } from "./request/file.api.js";
import {
  getGoodsList,
  addGoods,
  updateGoods,
  removeGoods,
} from "./request/goods.api.js";

// 检验是否登录
function setLoginInfo() {
  if (cache.getItem("jsa_isLogin")) return;
  window.location.href = "register.html";
}
setLoginInfo();

const columns = getColumns(callBack);
let isUpdate = true;
let rTable = null;
let goodsId = "";
let isTeacherOk = [];
let hintDialog = null;
let imgs = [];
function callBack(type, data) {
  goodsId = data.id;
  if (type === "del") {
    isUpdate = false;
    hintDialog.querySelector(".dialog-content").textContent = "确定删除吗？";
    hintDialog.showModal();
  } else if (type === "edt") {
    // 将要编辑的信息回显
    for (const config of addConfig) {
      if (config.name === "price") {
        config.value = data["price"].replace("￥", "");
        continue;
      }
      config.value = data[config.name];
    }
    setImgs(data.imgs);
    queryDom(".add-dialog .dialog-content").innerHTML = "";
    isTeacherOk = rform.render(addConfig, ".add-dialog .dialog-content");
    rform.bindEvent(addConfig, (i, bool) => (isTeacherOk[i] = bool));
    queryDom(".add-dialog").showModal();
    isUpdate = true;
  }
}
function setImgs(urls) {
  const imgBox = queryDom(".img-box");
  clearImgs();
  imgs = urls;
  for (const url of urls) {
    const img = document.createElement("img");
    img.className = "btn-info";
    img.src = "http://localhost:9000/" + url;
    imgBox.appendChild(img);
  }
}
function clearImgs() {
  imgs = [];
  queryDom(".img-box").innerHTML = "";
}
window.onload = async () => {
  // 查询用户列表
  const goodsList = await getGoodsList();
  const dataControl = new DataModeel(goodsList);
  rTable = new RenderTable({
    columns,
    option: {
      zebraColor: "#F0F0F0",
      isZebra: false,
    },
    data: goodsList,
  });
  rTable.createTable();
  let ids = [];
  hintDialog = queryDom(".hint-dialog");
  const addDialog = queryDom(".add-dialog");
  isTeacherOk = rform.render(addConfig, ".add-dialog .dialog-content");
  rform.bindEvent(addConfig, (i, bool) => (isTeacherOk[i] = bool));
  rform.render(filterConfig, ".filter");
  // 处理选择的图片
  queryDom("#fileInput").addEventListener("input", async function () {
    const { files } = this;
    const result = await uploadImage(files);
    if (!result) return;
    setImgs(result);
  });
  // 清空所有图片
  queryDom(".dialog-img .clear").addEventListener("click", clearImgs);
  queryDom(".navbar .del").addEventListener("click", () => {
    const rids = rTable.checkedValue();
    if (rids.length != 0) {
      ids = rids;
      hintDialog.querySelector(".dialog-content").textContent =
        "确定删除所有选择吗？";
      hintDialog.showModal();
      return;
    }
    message({ text: "您还没有选择", type: "warning" });
  });
  // 点击添加按钮
  queryDom(".navbar .add").addEventListener("click", () => {
    isUpdate = false;
    for (const config of addConfig) {
      config.value ? (config.value = null) : undefined;
    }
    queryDom(".add-dialog .dialog-content").innerHTML = "";
    isTeacherOk = rform.render(addConfig, ".add-dialog .dialog-content");
    rform.bindEvent(addConfig, (i, bool) => (isTeacherOk[i] = bool));
    addDialog.showModal();
  });
  // 取消删除
  queryDom(".hint-dialog .cancel").addEventListener("click", () =>
    hintDialog.close()
  );
  // 取消添加
  queryDom(".add-dialog .cancel").addEventListener("click", () =>
    addDialog.close()
  );
  // 确认批量删除
  queryDom(".hint-dialog .confrim").addEventListener("click", () => {
    if (isUpdate) {
      for (const id of ids) {
        removeGoods(id).then((_) => {
          rTable.removeTr(id);
        });
      }
    } else {
      removeGoods(goodsId).then((_) => {
        rTable.removeTr(goodsId);
      });
    }
    hintDialog.close();
  });
  // 确认添加/修改
  queryDom(".add-dialog .confrim").addEventListener("click", async () => {
    const result = Object.assign(rform.getFormInfo(addConfig), { imgs });
    if (isUpdate) {
      const isSuccess = await updateGoods(goodsId, result);
      if (!isSuccess) return;
      rTable.updateTr(result, goodsId);
      dataControl.update(goodsId, result);
    } else {
      if (!rform.checkPass(isTeacherOk)) {
        message({
          text: "请完成输入验证",
          type: "warning",
        });
        return;
      }
      const isSuccess = await addGoods(result);
      if (!isSuccess) return;
      const data = await getGoodsList();
      dataControl.set(data);
      rTable.refresh(data);
    }
    imgs = [];
    addDialog.close();
  });

  // 过滤
  queryDom(".filter-btn").addEventListener("click", function () {
    const { reserch } = rform.getFormInfo(filterConfig);
    const searchProvince = dataControl.filter({ province: reserch });
    const searchCity = dataControl.filter({ city: reserch });
    const searchName = dataControl.filter({ name: reserch });
    const result = rd([...searchCity, ...searchName, ...searchProvince]);
    rTable.refresh(result);
  });
};
