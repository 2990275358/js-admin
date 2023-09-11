import _ from "./utils/index.js";
export default function renderOther(path) {
  const nav = _.queryDom(".navbar");
  _.queryDom(".my-table-box").innerHTML = "";
  if (nav) {
    _.queryDom(".page-content").removeChild(nav);
  }
  const pageContent = _.queryDom(".my-table-box").childNodes;
  let isHasH1 = false;
  for (const node of pageContent) {
    if (node.nodeName === "H1") {
      isHasH1 = true;
      break;
    }
  }
  if (isHasH1) {
    _.queryDom("h1").textContent = `我是${path}`;
  } else {
    _.queryDom(".my-table-box").appendChild(
      _.createdEl("h1", { text: `我是${path}` })[0]
    );
  }
}
