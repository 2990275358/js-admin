import { queryDom, getImgUrl, setActiveClass, message } from "./utils/index.js";
import { rform } from "./render/render-form.js";
import { cache } from "./utils/local_cache.js";
import { provinces, citys, hobbys } from "./data.js";
import { addUser, login } from "./request/user.api.js";
import { uploadImage } from "./request/file.api.js";
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
    className: "btn rbtn",
  },
];
const loginConfig = [
  {
    label: "邮箱",
    type: "text",
    name: "login-email",
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
    name: "login-password",
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
    className: "btn lbtn",
  },
];

const REGISTER_NAME = ".register";
const LOGIN_NAME = ".login";

window.onload = function () {
  const isLoginOk = rform.render(loginConfig, LOGIN_NAME);
  rform.bindEvent(loginConfig, (i, bool) => (isLoginOk[i] = bool));
  const isRegisterOk = rform.render(registerConfig, REGISTER_NAME);
  rform.bindEvent(registerConfig, (i, bool) => (isRegisterOk[i] = bool));
  const rbtn = queryDom(".rbtn");
  const lbtn = queryDom(".lbtn");
  const fileInput = queryDom("#fileInput");
  const tabBtnELs = queryDom(".tab-btn", true);
  let avatar = "";
  // 给两个tab按钮绑定事件
  for (const el of tabBtnELs) {
    el.addEventListener("click", function () {
      const text = this.innerText;
      setActiveClass(this, ".tab-btn", "tab-active");
      if (text == "登录") {
        queryDom(REGISTER_NAME).classList.add("none");
        queryDom(LOGIN_NAME).classList.remove("none");
      } else {
        queryDom(REGISTER_NAME).classList.remove("none");
        queryDom(LOGIN_NAME).classList.add("none");
      }
    });
  }
  // 默认选中登录
  tabBtnELs[1].click();
  fileInput.addEventListener("input", async function () {
    const { files } = this;
    const url = getImgUrl(files[0]);
    const btn = queryDom(".btn-info");
    const result = await uploadImage(files);
    if (!result) return;
    btn.style.backgroundImage = `url(${url})`;
    btn.style.backgroundSize = `100%`;
    btn.style.backgroundPosition = "center center";
    avatar = result[0];
  });
  // 点击登录按钮
  lbtn.addEventListener("click", function () {
    if (!rform.checkPass(isLoginOk)) {
      return message({
        text: "请完成登录验证",
        type: "warning",
      });
    }
    const result = rform.getFormInfo(loginConfig);
    const email = result["login-email"];
    const password = result["login-password"];
    login({ email, password }).then((userInfo) => {
      if (!userInfo) return;
      cache.setItem("jsa_loginInfo", userInfo);
      cache.setItem("jsa_isLogin", true);
      window.location.href = "index.html";
    });
  });
  // 点击注册按钮
  rbtn.addEventListener("click", async function () {
    const result = rform.getFormInfo(registerConfig, ["checkpas"]);
    if (rform.checkPass(isRegisterOk)) {
      const isSuccess = await addUser({ ...result, avatar });
      if (!isSuccess) return;
      const userInfo = await login({
        email: result.email,
        password: result.password,
      });
      if (!userInfo) return;
      cache.setItem("jsa_loginInfo", userInfo);
      cache.setItem("jsa_isLogin", true);
      window.location.href = "index.html";
    } else {
      message({
        text: "请完成注册验证",
        type: "warning",
      });
    }
  });
};
