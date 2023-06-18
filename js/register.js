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
  tabBtnELs[0].click();
  queryDom("#fileInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    const url = getImgUrl(file);
    const realBtn = queryDom("#realBtn");
    realBtn.style.backgroundImage = "url(" + url + ")";
    realBtn.style.backgroundSize = "cover";
    realBtn.style.backgroundPosition = "0";
    avatar = url;
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
    const userInfo = userModel.filter({ email })[0];
    if (userInfo) {
      if (password !== userInfo.password) {
        message({
          text: "用户密码错误~",
          type: "err",
        });
        return;
      }
      message({
        text: "登录成功~",
        type: "success",
      });
      window.parent.postMessage(userInfo, "*");
      return;
    }
    message({
      text: "用户不存在~",
      type: "err",
    });
  });
  // 点击注册按钮
  rbtn.addEventListener("click", function () {
    const result = rform.getFormInfo(registerConfig, ["checkpas"]);
    Object.assign(result, { avatar });
    const isHas = userModel.has({ email: result.email });
    if (isHas) {
      message({
        text: "邮箱已经存在了~",
        type: "warning",
      });
      return;
    }
    if (rform.checkPass(isRegisterOk)) {
      message({
        text: "注册成功~",
        type: "success",
      });
      userModel.add(result);
    } else {
      message({
        text: "请完成注册验证",
        type: "warning",
      });
    }
  });
};
