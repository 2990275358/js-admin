const columns = [
  {
    label: "选择",
    key: "check",
    type: "check",
  },
  {
    label: "用户名",
    key: "name",
  },
  {
    label: "用户性别",
    key: "sex",
  },
  {
    label: "用户爱好",
    key: "hobby",
  },
  {
    label: "所在城市",
    key: "city",
    format: (_, data) => {
      return data.province + data.city;
    },
  },
  {
    label: "头像",
    key: "avatar",
    type: "img",
  },
  {
    label: "操作",
    type: "btn",
    options: [
      { text: "删除", type: "del", icon: "" },
      { text: "编辑", type: "edt", icon: "" },
    ],
    cb: callBack,
  },
];
const registerConfig = [
  {
    label: "姓名",
    type: "text",
    name: "name",
    rule: [
      {
        text: "用户名不能为空~",
        required: true,
      },
      {
        text: "用户名只能为英文",
        regex: /^[a-zA-Z]+$/,
      },
    ],
    className: "name",
    eventType: "blur",
  },
  {
    label: "邮箱",
    type: "text",
    name: "email",
    rule: [
      {
        text: "邮箱不能为空~",
        required: true,
      },
      {
        text: "邮箱格式输入错误~",
        regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      },
    ],
    className: "email",
    eventType: "blur",
  },
  {
    label: "密码",
    type: "password",
    name: "password",
    rule: [
      {
        text: "密码不能为空~",
        required: true,
      },
    ],
    className: "password",
    eventType: "blur",
  },
  {
    label: "确认密码",
    type: "password",
    name: "checkpas",
    rule: [
      {
        text: "请确认密码~",
        required: true,
      },
      {
        text: "两次密码不一致~",
        isCheckPassword: true,
        pasClassName: "password",
      },
    ],
    className: "checkpas",
    eventType: "blur",
    isJump: true,
  },
  {
    label: "性别",
    type: "radio",
    options: ["男", "女"],
    name: "sex",
    value: "女",
    className: "radio sex",
    eventType: "blur",
  },
  {
    label: "爱好",
    type: "checkbox",
    name: "hobby",
    tie: "、",
    options: hobbys,
    className: "checkbox hobby",
    eventType: "blur",
  },
  {
    label: "所在城市",
    type: "select",
    name: ["province", "city"],
    options: {
      levelOneClassName: "province",
      levelTwoClassName: "city",
      levelOne: provinces,
      levelTwo: citys,
    },
    className: "select",
    eventType: "blur",
  },
];
// 筛选的配置
const filterConfig = [
  {
    label: "姓名",
    type: "text",
    name: "name",
    className: "name",
    eventType: "blur",
  },
  {
    label: "邮箱",
    type: "text",
    name: "email",
    className: "email",
    eventType: "blur",
  },
  {
    label: "性别",
    type: "radio",
    options: ["男", "女"],
    name: "sex",
    value: "女",
    className: "radio sex",
    eventType: "blur",
  },
  {
    label: "爱好",
    type: "checkbox",
    name: "hobby",
    tie: "、",
    options: hobbys,
    className: "checkbox hobby",
    eventType: "blur",
  },
  {
    label: "查询",
    type: "btn",
    className: "my-btn add filter-btn",
  },
];
let userList = userModel.getList();
const rTable = new RenderTable({
  columns,
  option: {
    zebraColor: "#F0F0F0",
  },
  data: userList,
});
// 用来做校验通过验证
let isOk = [];
// 区分修改和添加
let isUpdate = false;
// 行的id，做修改用
let trId = "";
function callBack(type, data) {
  if (type === "del") {
    const isYes = prompt("确定要删除吗？y/n");
    if (isYes === "y") {
      rTable.removeTr(data.id);
      userModel.remove(data.id);
      message({ text: "删除成功~", type: "success" });
    }
  }
  if (type === "edt") {
    // 将要编辑的信息回显
    for (const config of registerConfig) {
      config.value = data[config.name];
    }
    trId = data.id;
    queryDom(".add-dialog .dialog-content").innerHTML = "";
    isOk = rform.render(registerConfig, ".add-dialog .dialog-content");
    rform.bindEvent(registerConfig, (i, bool) => (isOk[i] = bool));
    queryDom(".add-dialog").showModal();
    isUpdate = true;
    message({ text: "编辑成功~", type: "success" });
  }
}
window.onload = () => {
  rTable.createTable();
  let ids = [];
  const hintDialog = queryDom(".hint-dialog");
  const addDialog = queryDom(".add-dialog");
  rform.render(filterConfig, ".filter");
  queryDom(".navbar .del").addEventListener("click", () => {
    const rids = rTable.checkedValue();
    if (rids.length != 0) {
      ids = rids;
      hintDialog.showModal();
      return;
    }
    message({ text: "您还没有选择", type: "warning" });
  });

  let avatar = "";
  // 取消删除
  queryDom(".hint-dialog .cancel").addEventListener("click", () => {
    hintDialog.close();
  });
  // 确认删除
  queryDom(".hint-dialog .confrim").addEventListener("click", () => {
    for (const id of ids) {
      userModel.remove(id);
      rTable.removeTr(id);
    }
    hintDialog.close();
    message({ text: "操作成功~", type: "sueecss" });
  });
  // 添加取消
  queryDom(".add-dialog .cancel").addEventListener("click", () =>
    addDialog.close()
  );
  // 打开添加的模态框
  queryDom(".navbar .add").addEventListener("click", () => {
    isUpdate = false;
    for (const config of registerConfig) {
      config.value ? (config.value = null) : undefined;
    }
    queryDom(".add-dialog .dialog-content").innerHTML = "";
    isOk = rform.render(registerConfig, ".add-dialog .dialog-content");
    rform.bindEvent(registerConfig, (i, bool) => (isOk[i] = bool));
    addDialog.showModal();
  });
  // 确认添加
  queryDom(".add-dialog .confrim").addEventListener("click", () => {
    const result = rform.getFormInfo(registerConfig, ["checkpas"]);
    const data = {
      ...result,
      avatar,
    };
    if (isUpdate) {
      rTable.updateTr(data, trId);
    } else {
      if (!rform.checkPass(isOk)) {
        message({
          text: "请完成输入验证",
          type: "warning",
        });
        return;
      }
      const isHas = userModel.has({ email: result.email });
      if (isHas) {
        message({ text: "邮箱已经存在了~", type: "warning" });
        return;
      }
      message({
        text: "添加成功~",
        type: "success",
      });
      userModel.add(data);
      rTable.addTr(data, userList.length);
    }
    addDialog.close();
  });
  queryDom("#fileInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    const url = getImgUrl(file);
    const realBtn = queryDom("#imgBtn");
    realBtn.style.backgroundImage = "url(" + url + ")";
    realBtn.style.backgroundSize = "cover";
    realBtn.style.backgroundPosition = "0";
    avatar = url;
  });
  // 过滤
  queryDom(".filter-btn").addEventListener("click", function () {
    const result = rform.getFormInfo(filterConfig);
    rTable.refresh(userModel.filter(result));
  });
};
