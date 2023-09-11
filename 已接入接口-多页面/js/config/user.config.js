import { provinces, citys, hobbys } from "../data.js";
const getColumns = (callBack) => {
  return [
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
      label: "头像",
      key: "avatar",
      type: "img",
      format: (_, data) => {
        return "http://localhost:9000/" + data.avatar;
      },
    },
    {
      label: "用户邮箱",
      key: "email",
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
// 添加/修改的配置信息
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
      // {
      //   text: "用户名只能为英文",
      //   regex: /^[a-zA-Z]+$/,
      // },
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
    value: "男",
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
    label: "搜索",
    type: "text",
    name: "reserch",
    placeholder: "请输入用户名/邮箱",
    className: "name",
    eventType: "blur",
  },
  {
    label: "性别",
    type: "radio",
    options: ["全部", "男", "女"],
    name: "sex",
    value: "全部",
    className: "radio sex",
    eventType: "blur",
  },
  {
    label: "查询",
    type: "btn",
    className: "my-btn add filter-btn",
  },
];

export { getColumns, registerConfig, filterConfig };
