import _ from "./utils/index.js";
import { registerConfig, loginConfig } from "./config/register.config.js";
import { rform } from "./render/render-form.js";
import { login, addData } from "./request/user.api.js";
import { cache } from "./utils/local_cache.js";
import { pubsub } from "./utils/pubsub.js";

export default function loginOrRegister() {
  const form_class_name = {
    register: ".login-register",
    login: ".login-register",
  };
  const configs_map = {
    register: registerConfig,
    login: loginConfig,
  };
  let isOks = [];
  let curModule = "login";
  async function handleRformClick() {
    if (!rform.checkPass(isOks)) {
      return _.message({
        text: "请先完成输入验证~",
        type: "warning",
      });
    }
    const params = rform.getFormInfo(configs_map[curModule]);
    if (curModule === "register") {
      const isSuccess = await addData(params, "user");
      if (!isSuccess) return;
    }
    const userInfo = await login(params);
    cache.setItem("jsa_loginInfo", userInfo);
    pubsub.emit("handleLogin");
  }
  function renderForm() {
    _.queryDom(form_class_name[curModule]).innerHTML = "";
    const configs = configs_map[curModule];
    isOks = rform.render(configs, form_class_name[curModule]);
    _.queryDom(".r-l-btn").onclick = handleRformClick;
  }
  renderForm();

  _.queryDom(".navtab").addEventListener("click", function (e) {
    const el = e.target;
    if (!el.classList.contains("tab-btn")) return;
    curModule = el.dataset.type;
    _.queryDom(".login-register-title span").textContent = el.innerText;
    renderForm();
    _.setActiveClass(el, ".tab-btn", "tab-active");
  });
}
