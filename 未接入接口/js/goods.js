const columns = [
  {
    label: "索引",
    key: "index",
    type: "index",
  },
  {
    label: "选择",
    key: "check",
    type: "check",
  },
  {
    label: "商品名",
    key: "name",
  },
  {
    label: "发货地",
    key: "address",
  },
  {
    label: "库存数",
    key: "total",
    width: "40px",
  },
  {
    label: "价格",
    key: "price",
    width: "50px",
    format: (val) => {
      return `￥${Number(val).toFixed(2)}`;
    },
  },
  {
    label: "商品图",
    key: "imgs",
    type: "img",
  },
  {
    label: "销量",
    key: "salesVolume",
    width: "50px",
  },
  {
    label: "操作",
    type: "btn",
    options: [{ text: "删除", type: "del", icon: "icon-shanchu" }],
    cb: callBack,
  },
];
const addConfig = [
  {
    label: "商品名",
    type: "text",
    name: "name",
    rule: [
      {
        text: "商品名不能为空~",
        required: true,
      },
    ],
    className: "name",
    eventType: "blur",
  },
  {
    label: "价格",
    type: "text",
    name: "price",
    rule: [
      {
        text: "价格不能为空~",
        required: true,
      },
      {
        text: "只能输入数字和.",
        regex: /^\d*\.?\d*$/,
      },
    ],
    className: "price",
    eventType: "blur",
  },
  {
    label: "库存数",
    type: "text",
    name: "total",
    rule: [
      {
        text: "库存数不能为空~",
        required: true,
      },
      {
        text: "只能输入数字",
        regex: /\d*/,
      },
    ],
    className: "total",
    eventType: "blur",
  },
  {
    label: "发货地",
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
const filterConfig = [
  {
    label: "商品名",
    type: "text",
    name: "name",
    className: "name",
    eventType: "blur",
  },
  {
    label: "查询",
    type: "btn",
    className: "my-btn add filter-btn",
  },
];
let goodsList = goodsModel.getList();
const rTable = new RenderTable({
  columns,
  option: {
    isZebra: false,
  },
  data: goodsList,
});
function callBack(type, data) {
  if (type === "del") {
    const isYes = prompt("确定要删除吗？y/n");
    if (isYes === "y") {
      rTable.removeTr(data.id);
      goodsModel.remove(data.id);
      message({ text: "删除成功~", type: "success" });
    }
  }
}

window.onload = () => {
  rTable.createTable();
  let ids = [];
  let imgs = [];
  const hintDialog = queryDom(".hint-dialog");
  const addDialog = queryDom(".add-dialog");
  const isgoodsOk = rform.render(addConfig, ".add-dialog .dialog-content");
  rform.bindEvent(addConfig, (i, bool) => (isgoodsOk[i] = bool));
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
  // 点击添加按钮
  queryDom(".navbar .add").addEventListener("click", () => {
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
    for (const id of ids) {
      goodsModel.remove(id);
      rTable.removeTr(id);
    }
    hintDialog.close();
    message({ text: "操作成功~", type: "sueecss" });
  });
  // 确认添加
  queryDom(".add-dialog .confrim").addEventListener("click", () => {
    if (!rform.checkPass(isgoodsOk)) {
      message({
        text: "请完成输入验证",
        type: "warning",
      });
      return;
    }
    const result = rform.getFormInfo(addConfig);
    const isHas = goodsModel.has({ name: result.name });
    if (isHas) {
      message({
        text: "商品已经存在了~",
        type: "warning",
      });
      return;
    }
    const data = {
      ...result,
      address: result.province + result.city,
      salesVolume: 0,
      imgs,
    };
    message({
      text: "添加成功~",
      type: "success",
    });
    goodsModel.add(data);
    rTable.addTr(data, goodsList.length);
    addDialog.close();
  });
  // 获取选择的图片
  queryDom("#fileInput").addEventListener("change", (e) => {
    const files = e.target.files;
    const btn = queryDom("#imgBtn");
    const dialogEl = queryDom(".dialog-img");
    for (const file of files) {
      const src = getImgUrl(file);
      imgs.push(src);
      const img = document.createElement("img");
      img.className = "btn-info";
      img.src = src;
      dialogEl.insertBefore(img, btn);
    }
  });
  // 清空所有图片
  queryDom(".dialog-img .clear").addEventListener("click", (e) => {
    imgs = [];
    const dialogEl = queryDom(".dialog-img");
    const childs = dialogEl.children;
    for (const child of childs) {
      if (child.nodeName == "IMG") {
        dialogEl.removeChild(child);
      }
    }
  });
  // 过滤
  queryDom(".filter-btn").addEventListener("click", function () {
    const result = rform.getFormInfo(filterConfig);
    rTable.refresh(goodsModel.filter(result));
  });
};
