import { createdEl, queryDom } from "../utils/index.js";

class RenderDialog {
  #titleEl = null;
  #contentEl = null;
  #dialogEl = null;
  constructor({ className, title, content, btns, click } = {}) {
    this.className = className || "dialog hint-dialog";
    this.title = title || "提示";
    this.content = content || "";
    this.btns = btns || [
      {
        class: "my-btn kuang cancel",
        text: "取消",
        "data-type": "cancel",
      },
      {
        class: "my-btn add confrim",
        text: "确定",
        "data-type": "confirm",
      },
    ];
    this.click = click;
    this.render();
  }
  render() {
    const dia = queryDom(".dialog");
    if (dia) {
      document.body.removeChild(dia);
    }
    const [divBoxEl, divBoxAppend] = createdEl("div", {
      class: "dialog-box flex",
    });
    this.#titleEl = createdEl("div", {
      class: "dialog-title",
      text: this.title,
    })[0];
    if (typeof this.content === "string") {
      this.#contentEl = createdEl("div", {
        class: "dialog-content",
        text: this.content,
      })[0];
    } else {
      this.#contentEl = this.content;
    }
    const toolsEl = this.createdTool();
    // 判断传递过来的子元素是否有多个
    if (Array.isArray(this.#contentEl)) {
      divBoxAppend([this.#titleEl, ...this.#contentEl, toolsEl]);
    } else {
      divBoxAppend([this.#titleEl, this.#contentEl, toolsEl]);
    }
    const [diallog, diallogAppend] = createdEl("dialog", {
      class: this.className,
    });
    this.#dialogEl = diallog;
    diallogAppend(divBoxEl);
    document.body.appendChild(this.#dialogEl);
  }
  createdTool() {
    const [el, append] = createdEl("div", {
      class: "dialog-btn flex",
    });
    for (const btn of this.btns) {
      const [btnEl] = createdEl("div", btn);
      append(btnEl);
    }
    el.onclick = (e) => {
      const type = e.target.dataset["type"];
      if (!type) return;
      this.click(type);
    };
    return el;
  }
  setTitle(text) {
    this.#titleEl.textContent = text;
  }
  setText(text) {
    this.#contentEl.textContent = text;
  }
  show() {
    this.#dialogEl.showModal();
  }
  hied() {
    this.#dialogEl.close();
  }
}

export default RenderDialog;
