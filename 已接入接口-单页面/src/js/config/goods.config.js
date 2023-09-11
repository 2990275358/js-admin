import { HOST, provinces, citys } from "./common.config.js";
const getGoodsColumns = (callBack) => {
  return [
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
      label: "生产厂商",
      key: "manufacturer",
    },
    {
      label: "生产日期",
      key: "dateInProduced",
    },
    {
      label: "商品单价",
      key: "price",
      width: "1px",
      format(_, data) {
        return "￥" + parseFloat(data.price).toFixed(2);
      },
    },
    {
      label: "商品库存",
      key: "total",
    },
    {
      label: "商品产地",
      key: "province",
      format(_, data) {
        return data.province + data.city;
      },
    },
    {
      label: "商品图片",
      type: "img",
      key: "imgs",
      format: (_, data) => {
        return HOST + data.imgs[0];
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
};
const addGoodsConfig = [
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
    label: "生产厂商",
    type: "text",
    name: "manufacturer",
    rule: [
      {
        text: "生产厂商不能为空~",
        required: true,
      },
    ],
    className: "name",
    eventType: "blur",
  },
  {
    label: "生产日期",
    type: "text",
    name: "dateInProduced",
    placeholder: "例：2023/12/12 15:05:00",
    rule: [
      {
        text: "生产日期不能为空~",
        required: true,
      },
    ],
    className: "name",
    eventType: "blur",
  },
  {
    label: "商品单价",
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
    label: "商品库存",
    type: "text",
    name: "total",
    rule: [
      {
        text: "商品库存不能为空~",
        required: true,
      },
      {
        text: "只能输入数字",
        regex: /^\d*$/,
      },
    ],
    className: "price",
    eventType: "blur",
  },
  {
    label: "商品产地",
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
const filterGoodsConfig = [
  {
    label: "搜索",
    type: "text",
    name: "reserch",
    placeholder: "请输入商品名/商品地址",
    className: "name",
    eventType: "blur",
  },
  {
    label: "查询",
    type: "btn",
    className: "my-btn add filter-btn",
  },
];

export { getGoodsColumns, addGoodsConfig, filterGoodsConfig };
