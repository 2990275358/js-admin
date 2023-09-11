const PAGINATOR_ALL_SHOW = "paginator_all_show";
const PAGINATOR_CONCISE = "paginator_concise";
class Paginator {
  #activeClassName;
  #itemClassName;
  #total;
  #size;
  #mode;
  #tag;
  #totalPage;
  #itemNumber;
  constructor({
    activeClassName,
    itemClassName,
    total,
    size,
    mode,
    tag,
    container,
    itemNumber = 6,
  } = {}) {
    if (!container) throw Error("Container cannot be empty");
    // 放页码的容器
    this.container = container;
    // 激活页码的类名
    this.#activeClassName = activeClassName || "active";
    // 页码的类名
    this.#itemClassName = itemClassName || "item";
    // 数据的总条数
    this.#total = total || 0;
    // 每页数据的大小
    this.#size = size || 5;
    // 分页器的模式 全显示 精简模式
    this.#mode = mode || PAGINATOR_ALL_SHOW;
    // 页码的标签类型
    this.#tag = tag || "a";
    // 当前页码
    this.curPage = 1;
    // 最多要显示多少个页码
    this.#itemNumber =
      itemNumber > this.#totalPage ? this.#totalPage : itemNumber;
    // 设置总页码
    this.setTotalPage();
    console.log(this);
    this.init();
  }
  setTotalPage() {
    if (this.#total === 0) {
      this.#totalPage = 0;
      return;
    }
    if (this.#total < this.#size) {
      this.#totalPage = 1;
      return;
    }
    this.#totalPage = Math.ceil(this.#total / this.#size);
  }
  init() {
    // 利用事件捕获给所有页码添加点击事件
    this.container.addEventListener("click", (e) => {
      const el = e.target;
      if (el.classList.contains(this.#itemClassName)) {
        const page = el.dataset.page;
        if (page === ">") this.setCurPage(this.curPage + 1);
        if (page === "<") this.setCurPage(this.curPage - 1);
        if (/^\d+$/.test(page)) this.setCurPage(+el.dataset.page);
      }
    });
    // 初始化页码
    this.handleCurPage();
  }
  handleCurPage() {
    if (this.#mode === PAGINATOR_ALL_SHOW) {
      // 先清空容器内容
      this.container.innerHTML = "";
      // 后退按钮
      this.createBtn("<");
      let half = Math.floor(this.#itemNumber / 2);
      const labels = [];
      for (let i = 1; i <= this.#totalPage; i++) {
        // 当前页码减去页码大于最大的页码数量的一半时不渲染，页码减去当前页码大于最大页码数量的一半时也不渲染
        if (this.curPage - i > half || i - this.curPage > half) continue;
        const label = document.createElement(this.#tag);
        label.textContent = i;
        label.dataset.page = i;
        label.className = this.#itemClassName;
        if (i === this.curPage) label.classList.add(this.#activeClassName);
        labels.push(label);
      }
      // 将页码放进容器
      labels.forEach((label) => this.container.appendChild(label));
      // 前进
      this.createBtn(">");
    } else if (this.#mode === PAGINATOR_CONCISE) {
      if (this.container.childNodes.length) return;
      ["<", ">"].forEach((symbol) => this.createBtn(symbol));
    }
  }
  setCurPage(num) {
    if (num < 1 || num > this.#totalPage || this.curPage === num) return;
    this.curPage = num;
    console.log("当前页码：", num);
    this.handleCurPage();
  }
  createBtn(symbol) {
    const btn = document.createElement(this.#tag);
    btn.dataset.page = symbol;
    btn.textContent = symbol;
    btn.className = this.#itemClassName;
    this.container.appendChild(btn);
  }
}
