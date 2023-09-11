import { queryDom, rd, message, getImgUrl } from "./utils/index.js";
import { cache } from "./utils/local_cache.js";
import { rform } from "./render/render-form.js";
import {
  getUserList,
  addUser,
  updateUser,
  removeUser,
} from "./request/user.api.js";
import { uploadImage } from "./request/file.api.js";
import RenderTable from "./render/render-table.js";
import DataModel from "./utils/data_model.js";
import {
  getColumns,
  registerConfig,
  filterConfig,
} from "./config/user.config.js";
const columns = getColumns(callBack);

let rTable = null;
// 用来做校验通过验证
let isOk = [];
// 区分修改和删除 false-删除 true-修改
let isUpdate = true;
// 行的id，做修改和删除用
let trId = "";
let hintDialog = null;
let avatar = "";
// 点击表格按钮
function callBack(type, data) {
  trId = data.id;
  if (type === "del") {
    const { id } = cache.getItem("jsa_loginInfo");
    if (id === trId) {
      return message({ text: "自己无法删除自己~", type: "warning" });
    }
    isUpdate = false;
    hintDialog.querySelector(".dialog-content").textContent = "确定删除吗？";
    hintDialog.showModal();
  }
  if (type === "edt") {
    // 将要编辑的信息回显
    for (const config of registerConfig) {
      config.value = data[config.name];
    }
    const btn = queryDom(".btn-info");
    btn.style.backgroundImage = `url(http://localhost:9000/${data.avatar})`;
    btn.style.backgroundSize = `100%`;
    btn.style.backgroundPosition = "center center";
    avatar = data.avatar;
    queryDom(".add-dialog .dialog-content").innerHTML = "";
    isOk = rform.render(registerConfig, ".add-dialog .dialog-content");
    rform.bindEvent(registerConfig, (i, bool) => (isOk[i] = bool));
    queryDom(".add-dialog").showModal();
    isUpdate = true;
  }
}

// 是否登录验证
function setLoginInfo() {
  if (cache.getItem("jsa_isLogin")) return;
  window.location.href = "register.html";
}
setLoginInfo();

window.onload = async () => {
  // 查询用户列表
  const { data } = await getUserList();
  const dataControl = new DataModel(data);
  const fileInput = queryDom("#fileInput");
  rTable = new RenderTable({
    columns,
    option: {
      zebraColor: "#F0F0F0",
    },
    data,
  });
  rTable.createTable();

  let ids = [];
  hintDialog = queryDom(".hint-dialog");
  const addDialog = queryDom(".add-dialog");
  rform.render(filterConfig, ".filter");
  fileInput.addEventListener("input", async function () {
    const { files } = this;
    const url = getImgUrl(files[0]);
    const result = await uploadImage(files);
    if (!result) return;
    const btn = queryDom(".btn-info");
    btn.style.backgroundImage = `url(${url})`;
    btn.style.backgroundSize = `100%`;
    btn.style.backgroundPosition = "center center";
    avatar = result[0];
  });
  // 点击删除所有按钮
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
  // 取消删除
  queryDom(".hint-dialog .cancel").addEventListener("click", () => {
    hintDialog.close();
  });
  // 确认删除
  queryDom(".hint-dialog .confrim").addEventListener("click", () => {
    const { id: localId } = cache.getItem("jsa_loginInfo");
    if (isUpdate) {
      for (const id of ids) {
        if (id === localId) continue;
        removeUser(id).then((_) => {
          rTable.removeTr(id);
        });
      }
    } else {
      removeUser(trId).then((_) => {
        rTable.removeTr(trId);
      });
    }
    hintDialog.close();
  });
  // 添加取消
  queryDom(".add-dialog .cancel").addEventListener("click", () =>
    addDialog.close()
  );
  // 打开添加的模态框
  queryDom(".navbar .add").addEventListener("click", () => {
    isUpdate = false;
    for (const config of registerConfig) {
      config.value && !["男", "女"].includes(config.value)
        ? (config.value = null)
        : undefined;
    }
    queryDom(".add-dialog .dialog-content").innerHTML = "";
    isOk = rform.render(registerConfig, ".add-dialog .dialog-content");
    rform.bindEvent(registerConfig, (i, bool) => (isOk[i] = bool));
    addDialog.showModal();
  });
  // 确认添加/编辑
  queryDom(".add-dialog .confrim").addEventListener("click", async () => {
    const result = Object.assign(
      rform.getFormInfo(registerConfig, ["checkpas"]),
      { avatar }
    );
    if (isUpdate) {
      // 修改用户
      const isSuccess = await updateUser(trId, result);
      if (!isSuccess) return;
      rTable.updateTr(result, trId);
      // 更新数据控制中的数据，避免后面筛选或其他操作时数据与服务器不一致
      dataControl.update(trId, result);
      addDialog.close();
    } else {
      if (!rform.checkPass(isOk)) {
        message({
          text: "请完成输入验证",
          type: "warning",
        });
        return;
      }
      // 添加用户
      const isSuccess = await addUser(result);
      if (!isSuccess) return addDialog.close();
      const { data: userList } = await getUserList();
      rTable.refresh(userList);
      dataControl.set(userList);
      addDialog.close();
    }
  });
  // 过滤
  queryDom(".filter-btn").addEventListener("click", function () {
    const { reserch, sex } = rform.getFormInfo(filterConfig);
    const searchName = dataControl.filter({ name: reserch });
    const searchEmail = dataControl.filter({ email: reserch });
    let result = rd([...searchEmail, ...searchName]);
    if (sex !== "全部") {
      result = result.filter((item) => item["sex"] === sex);
    }
    rTable.refresh(result);
  });
};
