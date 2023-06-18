const columns = [
  {
    label: "序号",
    key: "index",
    type: "index",
    width: "30px",
  },
  {
    label: "用户名",
    key: "name",
  },
  {
    label: "所在省份",
    key: "province",
  },
  {
    label: "所在城市",
    key: "city",
  },
  {
    label: "手机号",
    key: "phone",
  },
  {
    label: "商品名",
    key: "goodsName",
  },
  {
    label: "总数量",
    key: "total",
  },
  {
    label: "总金额",
    key: "totalMoney",
    format: (val) => {
      return `￥${Number(val).toFixed(2)}`;
    },
  },
  {
    label: "操作",
    type: "btn",
    options: [
      { text: "删除", type: "del", icon: "icon-shanchu" },
      { text: "编辑", type: "edt", icon: "icon-bianjishuru" },
    ],
    cb: callBack,
  },
];
const orderConfig = [
  {
    label: "用户名",
    type: "text",
    name: "name",
    rule: [
      {
        text: "用户名不能为空~",
        required: true,
      },
    ],
    className: "name",
    eventType: "blur",
  },
  {
    label: "手机号",
    type: "text",
    name: "phone",
    rule: [
      {
        text: "手机号不能为空~",
        required: true,
      },
    ],
    className: "phone",
    eventType: "blur",
  },
  {
    label: "商品名",
    type: "text",
    name: "goodsName",
    rule: [
      {
        text: "商品名不能为空~",
        required: true,
      },
    ],
    className: "goodsName",
    eventType: "blur",
  },
  {
    label: "总数量",
    type: "text",
    name: "total",
    rule: [
      {
        text: "总数不能为空~",
        required: true,
      },
      {
        text: "数量不能少于1",
        regex: /\d*[1-9]\d*/,
      },
    ],
    className: "total",
    eventType: "blur",
  },
  {
    label: "总金额",
    type: "text",
    name: "totalMoney",
    rule: [
      {
        text: "总金额不能为空~",
        required: true,
      },
      {
        text: "只能输入数字和.",
        regex: /^\d*\.?\d*$/,
      },
    ],
    className: "totalMoney",
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
const orderList = orderModel.getList();
const rTable = new RenderTable({
  columns,
  option: {
    isZebra: true,
  },
  data: orderList,
});
function callBack(type, data) {
  if (type === "del") {
    const isYes = prompt("确定要删除吗？y/n");
    if (isYes === "y") {
      rTable.removeTr(data.id);
      orderModel.remove(id);
      message({ text: "删除成功~", type: "success" });
    }
  }
  if (type === "edt") {
    message({ text: "编辑成功~", type: "success" });
  }
}
window.onload = () => {
  const addDialog = queryDom(".add-dialog");
  const isOk = rform.render(orderConfig, ".add-dialog-content");
  rform.bindEvent(orderConfig, (i, bool) => (isOk[i] = bool));
  const tableEl = rTable.createTable();
  queryDom(".navbar .add").addEventListener("click", () => {
    addDialog.showModal();
  });
  queryDom(".add-dialog .cancel").addEventListener("click", () =>
    addDialog.close()
  );
  queryDom(".add-dialog .confrim").addEventListener("click", () => {
    if (!rform.checkPass(isOk)) {
      message({
        text: "请完成输入验证",
        type: "warning",
      });
      return;
    }
    const result = rform.getFormInfo(orderConfig, ["checkpas"]);
    const isHasUer = userModel.has({ name: result.name });
    const isHasGoods = goodsModel.has({ name: result.goodsName });
    if (!isHasUer) return message({ text: "用户不存在！", type: "err" });
    if (!isHasGoods) return message({ text: "商品不存在！", type: "err" });
    message({
      text: "添加成功~",
      type: "success",
    });
    orderModel.add(result);
    rTable.addTr(result, orderList.length);
    addDialog.close();
  });
};
