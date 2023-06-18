const themes = [
  {
    subjectColor: "#3f96ff",
    item: "#23324a",
    navigation: "#447496",
    itemChild: "#3c4c6a",
    addHover: "#3f95ff9f",
    tableItem: "#b1cbdb",
  },
  {
    subjectColor: "#2e5ac2",
    item: "#6a8baf",
    navigation: "#162a4d",
    itemChild: "#b1cbdb",
    addHover: "#2e5ac283",
    tableItem: "#b1cbdb",
  },
  {
    subjectColor: "#d666ea",
    item: "#c38fe1",
    navigation: "#68328c",
    itemChild: "#59486a",
    addHover: "#59486aa2",
    tableItem: "#b1cbdb",
  },
];

function createCard(list, selector) {
  for (let i = 0; i < list.length; i++) {
    const bdiv = document.createElement("div");
    const div = document.createElement("div");
    bdiv.className = "card";
    div.className = "color";
    div.style.backgroundColor = list[i].subjectColor;
    bdiv.dataset.idx = i;
    bdiv.appendChild(div);
    queryDom(selector).appendChild(bdiv);
    bdiv.onclick = function () {
      const idx = Number(this.dataset.idx);
      // 通知父页面样式修改了
      window.parent.postMessage(list[idx], "*");
    };
  }
}

window.onload = () => {
  createCard(themes, ".main");
};
