let i = 0;
let timer = null;
function createCard(name, img, id) {
  const bdiv = document.createElement("div");
  bdiv.classList.add("card");
  const imgEl = document.createElement("img");
  const div = document.createElement("div");
  imgEl.classList.add("card-img");
  imgEl.dataset.id = id;
  div.classList.add("card-name");
  div.textContent = name ?? "";
  imgEl.src = typeof img === "string" ? img : img[0];
  imgEl.addEventListener("click", function (e) {
    e.stopPropagation();
    const goods = goodsModel.filter({ id: this.dataset.id })[0];
    const imgBox = queryDom(".img-box");
    for (const img of goods.imgs) {
      imgBox.appendChild(createCover(img));
    }
    queryDom(".mask").classList.remove("none");
    timer = setInterval(() => {
      setActiveClass(imgBox.children[i], ".cover", "basis");
      i++;
      if (i === imgBox.children.length) {
        i = 0;
      }
    }, 1000);
  });
  bdiv.appendChild(imgEl);
  bdiv.appendChild(div);
  return bdiv;
}

function createCover(src) {
  const div = document.createElement("div");
  const img = document.createElement("img");
  img.classList.add("cover-img");
  img.src = src;
  div.classList.add("cover");
  div.appendChild(img);
  return div;
}

window.onload = () => {
  const goodsList = goodsModel.getList();
  for (const goods of goodsList) {
    const { name, imgs, id } = goods;
    if (imgs) {
      queryDom(".main").appendChild(createCard(name, imgs, id));
    }
  }

  const mask = document.querySelector(".mask");
  mask.addEventListener("click", function (e) {
    clearInterval(timer);
    i = 0;
    queryDom(".img-box").innerHTML = "";
    this.classList.add("none");
  });
};
