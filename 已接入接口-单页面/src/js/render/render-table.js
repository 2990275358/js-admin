import { setIcon, clone } from "../utils/index.js";
class RenderTable {
  columns = [];
  data = [];
  option = {
    // 是否开启隔行显示背景 可选
    isZebra: true,
    // 隔行显示背景的颜色 可选
    zebraColor: "var(--tableItem)",
    // 要插入表格的盒子 必填
    boxName: "my-table-box",
    // 表格内元素的类名 可选
    tableName: "my-table",
    thName: "my-th",
    trName: "my-tr",
    tdName: "my-td",
    crux: "id",
  };
  // 每列的宽度，默认为撑满盒子宽度
  defaultWidth = "";
  table = undefined;
  tbody = undefined;
  constructor(config) {
    const { columns, option, data = [] } = config;
    if (!Array.isArray(columns)) {
      return console.warn("列的数据只能为数组~");
    }
    this.columns = columns;
    this.defaultWidth = 100 / this.columns.length + "%";
    Object.assign(this.option, option);
    this.data = data;
  }
  /**
   * 创建表格
   * @returns 表元素
   */
  createTable() {
    const rTable = document.createElement("table");
    rTable.className = this.option.tableName;
    const rThead = this.createThead();
    const rTbody = this.createTbody();
    rTable.appendChild(rThead);
    rTable.appendChild(rTbody);
    this.table = rTable;
    const box = document.querySelector(`.${this.option.boxName}`);
    if (box) {
      box.appendChild(rTable);
      return rTable;
    }
    console.warn("提供的父盒子不存在！");
  }
  /**
   * 创建表头
   * @returns 表头
   */
  createThead() {
    const rThead = document.createElement("thead");
    const rTr = document.createElement("tr");
    rTr.className = this.option.trName;
    for (const cloumn of this.columns) {
      const { label, width, align, type } = cloumn;
      const rTh = document.createElement("th");
      rTh.className = this.option.thName;
      if (type === "check") {
        const rCheck = document.createElement("input");
        rCheck.type = "checkbox";
        rCheck.className = "check th-check";
        rTh.appendChild(rCheck);
        rCheck.addEventListener("change", () => {
          const tdCheckAll = document.getElementsByClassName("td-check");
          if (this.checkedIsAll()) {
            for (const tdc of tdCheckAll) {
              tdc.checked = false;
            }
          } else {
            for (const tdc of tdCheckAll) {
              tdc.checked = true;
            }
          }
        });
      } else {
        rTh.textContent = label || "";
      }
      if (["index", "check"].includes(type)) {
        Object.assign(rTh.style, {
          width: "3%",
        });
      } else {
        Object.assign(rTh.style, {
          width: width || this.defaultWidth,
          textAlign: align || "center",
        });
      }
      rTr.appendChild(rTh);
    }
    rThead.appendChild(rTr);
    return rThead;
  }
  /**
   * 创建表格body
   * @returns
   */
  createTbody(arr) {
    const config = arr || this.data;
    const rTbody = document.createElement("tbody");
    for (let i = 0; i < config.length; i++) {
      const item = config[i];
      const rTr = this.createTr(item, i);
      rTbody.appendChild(rTr);
    }
    this.tbody = rTbody;
    return rTbody;
  }
  /**
   * 创建行
   * @param {Object} item
   * @param {Number} i 当前行的index
   * @returns 创建好的tr
   */
  createTr(item, i) {
    const rTr = document.createElement("tr");
    rTr.className = this.option.trName;
    Object.assign(rTr.dataset, {
      id: item[this.option.crux],
    });
    if (this.option.isZebra && i % 2 === 0) {
      Object.assign(rTr.style, {
        backgroundColor: this.option.zebraColor,
      });
    }
    for (const column of this.columns) {
      const { width, key, align, type, format, cb, options } = column;
      if (!key && !type) continue;
      const value = item[key] ?? "";
      const rTd = document.createElement("td");
      rTd.dataset.key = key || type;
      rTd.className = this.option.tdName;
      // 渲染表格时有些特殊类型，需要做特殊处理
      if (type) {
        Object.assign(rTd.style, {
          width: "3%",
        });
        if (type === "index") {
          rTd.textContent = i + 1;
        }
        if (type === "img") {
          const rImg = document.createElement("img");
          let img = typeof value === "string" ? value : value[0];
          if (format) {
            img = format(value, item);
          }
          rImg.src = img;
          rImg.draggable = false;
          rImg.style.height = "90%";
          rImg.style.width = "60%";
          rImg.style.maxHeight = "140px";
          rImg.style.minHeight = "100px";
          rTd.appendChild(rImg);
        }
        if (type === "check") {
          const rCheck = document.createElement("input");
          rCheck.type = "checkbox";
          rCheck.className = "check td-check";
          rTd.appendChild(rCheck);
          rCheck.addEventListener("change", () => {
            const thCheck = document.querySelector(".th-check");
            if (this.checkedIsAll()) {
              thCheck.checked = true;
            } else {
              thCheck.checked = false;
            }
          });
        }
        if (type === "btn") {
          for (const bdata of options) {
            const span = this.createTool(bdata);
            span.addEventListener("click", (e) => {
              const data = {};
              for (const td of e.target.parentElement.parentElement.children) {
                // 回显取值时跳过索引、单选框、图片数组
                if (
                  ["btn", "index", "check", "imgs", "avatar"].includes(
                    td.dataset.key
                  )
                ) {
                  continue;
                }
                data[td.dataset.key] = td.innerText;
              }
              cb(
                e.target.dataset.type,
                Object.assign(clone.deep(item, true), data)
              );
            });
            rTd.appendChild(span);
          }
        }
      } else {
        // 没有特殊类型的直接渲染
        Object.assign(rTd.style, {
          width: width || this.defaultWidth,
          textAlign: align || "center",
        });
        if (format) {
          rTd.textContent = format(value, item);
        } else {
          rTd.textContent = value;
        }
      }
      rTr.appendChild(rTd);
    }
    return rTr;
  }
  /**
   * 生成表格操作按钮
   * @param {Object} data 渲染按钮的数据
   * @returns
   */
  createTool(data) {
    const span = document.createElement("span");
    span.dataset.type = data.type;
    span.className = "t-btn";
    if (data.icon) {
      setIcon(data.icon, data.text, span);
    } else {
      span.textContent = data.text;
    }
    switch (data.type) {
      case "del":
        span.classList.add("t-btn-del");
        break;
      case "edt":
        span.classList.add("t-btn-edt");
        break;
      default:
        span.classList.add("t-btn-del");
        break;
    }
    return span;
  }
  /**
   * 给表格添加新的行
   * @param {Object} data 要添加的数据
   * @param {Number | String} index 新的序号
   */
  addTr(data, index) {
    const rtr = this.createTr(data, index);
    this.tbody.appendChild(rtr);
  }
  updateTr(data, id) {
    for (const tr of this.table.children[1].children) {
      if (tr.dataset.id === id) {
        for (const td of tr.children) {
          const { key } = td.dataset;
          if (key in data) {
            const { format } = this.columns.find((item) => item.key == key);
            let value = format ? format(null, data) : data[key];
            if (td.children.length) {
              td.children[0].src = value;
              continue;
            }
            td.textContent = value;
          }
        }
      }
    }
  }
  refresh(data) {
    this.tbody = this.createTbody(data);
    this.table.removeChild(this.table.children[1]);
    this.table.appendChild(this.tbody);
  }
  /**
   * 删除表格行
   * @param {String} id 数据的id
   */
  removeTr(id) {
    let child = undefined;
    for (const el of this.tbody.childNodes) {
      if (el.dataset.id === id) {
        child = el;
        break;
      }
    }
    this.tbody.removeChild(child);
  }
  /**
   * 检查是否全选
   * @returns 是否全选
   */
  checkedIsAll() {
    const tdCheckAll = document.getElementsByClassName("td-check");
    let isAll = true;
    for (const tdc of tdCheckAll) {
      if (!tdc.checked) {
        isAll = false;
        break;
      }
    }
    return isAll;
  }
  /**
   * 获取所有选中的值
   * @returns 所有选中的id
   */
  checkedValue() {
    const tdCheckAll = document.getElementsByClassName("td-check");
    const ids = [];
    for (const tdc of tdCheckAll) {
      if (tdc.checked) {
        const parent = tdc.parentElement.parentElement;
        ids.push(parent.dataset.id);
      }
    }
    return ids;
  }
}

export default RenderTable;
