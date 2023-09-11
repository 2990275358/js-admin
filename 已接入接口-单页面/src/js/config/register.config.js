import { hobbys, provinces, citys } from "./common.config.js";
/**
 * 输入框的配置信息
 * rule规则，可以设置多条规则 只有text和password才能做输入验证
 *    text 规则提示文字
 *    required 是否必传
 *    regex 正则
 * eventType规则检验触发的事件类型
 * type输入框类型 text | password | checkbox | btn | radio | select
 * className输入框类名,类名可以有多个用空格隔开
 * name元素获取值的唯一类名，不能重复，可以是字符串也可以是数组
 * options 特殊元素的特殊属性
 * label 文字描述
 * value 默认值
 *
 *
 *
 **/
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
  {
    label: "注册",
    type: "btn",
    className: "btn r-l-btn",
  },
];
const loginConfig = [
  {
    label: "邮箱",
    type: "text",
    name: "email",
    value: "2990275358@qq.com",
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
    className: "login-email",
    eventType: "blur",
  },
  {
    label: "密码",
    type: "password",
    name: "password",
    value: "123456",
    rule: [
      {
        text: "密码不能为空~",
        required: true,
      },
    ],
    className: "login-password",
    eventType: "blur",
  },
  {
    label: "登录",
    type: "btn",
    rule: [],
    className: "btn r-l-btn",
  },
];

export { registerConfig, loginConfig };
