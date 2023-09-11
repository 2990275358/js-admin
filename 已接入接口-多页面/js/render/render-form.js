import { queryDom } from "../utils/index.js";
class RenderForm {
  /**
   * 设置是否显示错误提示
   * @param {String} text 要提示的文字
   * @param {Boolean} show 是否显示提示
   * @param {String} el 元素父类名，更精确选择当前作用的元素
   */
  setHintText(text, show, el) {
    if (show) {
      el.innerText = text;
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  }
  /**
   * 用来给二级选择器设置值
   * @param {String | HTMLElement} selector 二级元素的选择器，元素创建了还没挂载时可以直接传递元素
   * @param {Array} provinces 一级选项的数据，用来获取当前数据的索引
   * @param {String} province 当前一级选项的内容
   * @param {Array} leveTwo 二级选项的全部数据
   */
  setLevelTwo(selector, provinces, province, leveTwo) {
    const idx = provinces.indexOf(province);
    const target = typeof selector === "string" ? queryDom(selector) : selector;
    target.innerHTML = leveTwo[idx]
      .map((value) => `<option value="${value}">${value}</option>`)
      .join("");
  }
  /**
   * 拿到一些选择的东西，例如单选框和多选框
   * @param {*} className 要拿的类名
   * @param {*} tie 连接结果用的连接符
   * @returns 拿到后的数据字符串形式
   */
  getSomeSelect(className, tie) {
    const checkEls = queryDom(`.${className}`, true);
    const result = [];
    for (let i = 0; i < checkEls.length; i++) {
      const el = checkEls[i];
      if (!el.checked) continue;
      result.push(el.value);
    }
    return result.length ? result.join(tie) : "";
  }
  /**
   * 拿到input的value值
   * @param {Array} classList 要拿的类名数组
   * @returns 对象形式的，类名做key，key-value
   */
  getInputValue(classList) {
    const result = {};
    for (const className of classList) {
      if (!className) continue;
      const el = queryDom("." + className);
      if (!el) continue;
      result[className] = el.value;
    }
    return result;
  }
  /**
   * 获取当前表单填入的数据
   * @param {Array} configs 生成表单时的配置数组
   * @param {Array} exclude 不需要获取值的name值
   * @returns 通过对象的形式返回form表单填入的数据
   */
  getFormInfo(configs, exclude = []) {
    const result = {};
    const classList = [];
    for (const config of configs) {
      const { name, type, tie } = config;
      if (!name || exclude.includes(name)) continue;
      if (type === "text" || type === "select" || type === "password") {
        if (Array.isArray(name)) {
          name.forEach((res) => classList.push(res));
        } else {
          classList.push(name);
        }
      } else {
        result[name] = this.getSomeSelect(name, tie || "");
      }
    }
    const inputInfo = this.getInputValue(classList);
    Object.assign(result, {
      ...inputInfo,
    });
    return result;
  }
  /**
   * 检测是否全部通过
   * @param {Array} isOks 验证的数组
   * @returns 检测后的结果 true/false
   */
  checkPass(isOks = []) {
    return isOks.every((res) => res);
  }
  /**
   * 给需要验证的input绑定事件
   * @param {Array} configs 生成表单时的配置数组
   * @param {Function} callback 在绑定事件触发时回调,传递验证结果，(index,bool) => void
   */
  bindEvent(configs, callback) {
    // 为输入框绑定事件，并验证设置好的规则
    for (let i = 0; i < configs.length; i++) {
      const eleConfig = configs[i];
      if (!eleConfig.rule || eleConfig.rule.length === 0) continue;
      const ele = queryDom("." + eleConfig.name);
      if (!ele) continue;
      queryDom("." + eleConfig.name).addEventListener(
        eleConfig.eventType,
        (e) => {
          const el = e.target;
          const rule = eleConfig.rule || [];
          let isSuccess = true;
          let hintText = "";
          for (let j = 0; j < rule.length; j++) {
            const detailsRule = rule[j];
            hintText = detailsRule.text;
            if (!isSuccess) break;
            if (detailsRule.required && el.value.length === 0) {
              isSuccess = false;
              break;
            }
            if (detailsRule.regex && !detailsRule.regex.test(el.value)) {
              isSuccess = false;
              break;
            }
            if (
              detailsRule.isCheckPassword &&
              queryDom("." + detailsRule.pasClassName).value != el.value
            ) {
              isSuccess = false;
              break;
            }
          }
          if (isSuccess) {
            el.classList.remove("err");
            this.setHintText("", false, el.nextElementSibling);
            if (callback) callback(i, true);
          } else {
            el.classList.add("err");
            this.setHintText(hintText, true, el.nextElementSibling);
            if (callback) callback(i, false);
          }
        }
      );
    }
  }
  /**
   * 根据配置数据生成form表单
   * @param {Array} configs 生成表单时的配置数组
   * @param {String} selector 表单父盒子的选择器
   * @returns 返回一个数组，长度为需要验证的元素的个数，内容全为false
   */
  render(configs, selector) {
    const boxEl = queryDom(selector);
    const divs = [];
    const isOks = [];
    for (const config of configs) {
      const {
        type,
        label,
        options,
        name,
        className,
        rule,
        value,
        placeholder,
      } = config;
      if (rule && rule.length !== 0) {
        isOks.push(false);
      }
      const div = document.createElement("div");
      div.classList.add("line");
      if (type !== "btn") {
        const span = document.createElement("span");
        span.classList.add("label");
        span.textContent = label;
        div.appendChild(span);
      }
      if (type === "text" || type === "password") {
        const input = document.createElement("input");
        input.classList.add("input", name);
        input.type = type;
        if (value) input.value = value;
        input.placeholder = placeholder || `请输入${label}`;
        div.appendChild(input);
      }
      if (type === "radio" || type === "checkbox") {
        const cdiv = document.createElement("div");
        for (const option of options) {
          const label = document.createElement("label");
          const radio = document.createElement("input");
          radio.className = name;
          radio.name = name;
          radio.value = option;
          radio.type = type;
          if (value && value === option) {
            radio.setAttribute("checked", true);
          }
          label.appendChild(radio);
          label.innerHTML += option;
          label.style.marginRight = "10px";
          cdiv.appendChild(label);
        }
        div.appendChild(cdiv);
      }
      if (type === "select") {
        const { levelOne, levelTwo, levelOneClassName, levelTwoClassName } =
          options;
        const selectOne = document.createElement("select");
        selectOne.style.marginRight = "10px";
        const selectTwo = document.createElement("select");
        if (levelTwo) {
          selectTwo.classList.add(className, levelTwoClassName);
        }
        selectOne.classList.add(className, "levelOne", levelOneClassName);
        for (const text of levelOne) {
          const optionEl = document.createElement("option");
          optionEl.value = text;
          optionEl.textContent = text;
          if (value && text === value) optionEl.selected = true;
          selectOne.appendChild(optionEl);
        }
        div.appendChild(selectOne);
        if (levelTwo) {
          this.setLevelTwo(selectTwo, levelOne, value || levelOne[0], levelTwo);
          div.appendChild(selectTwo);
          queryDom(selector).addEventListener("change", (e) => {
            const target = e.target;
            if (
              target.tagName === "SELECT" &&
              target.classList.contains("levelOne")
            ) {
              this.setLevelTwo(
                `.${levelTwoClassName}`,
                levelOne,
                target.value,
                levelTwo
              );
            }
          });
        }
      }
      if (type === "btn") {
        const bdiv = document.createElement("div");
        bdiv.className = className;
        bdiv.textContent = label;
        div.classList.add("btnbox");
        div.appendChild(bdiv);
      }
      if (config.rule && config.rule.length != 0) {
        const hintDiv = document.createElement("div");
        hintDiv.classList.add("hint");
        div.appendChild(hintDiv);
      }
      divs.push(div);
    }
    divs.forEach((res) => boxEl.appendChild(res));
    return isOks;
  }
}

const rform = new RenderForm();

export { rform };
export default RenderForm;
