const fs = require("fs");
const path = require("path");
const app = require("../app");
const express = require("express");
const { HandleData, rbr } = require("../utils");

const router = express.Router();
const handelData = new HandleData("goods");

router.get("/", (req, res) => {
  const { id } = req.query;
  const data = handelData.reader(id);
  if (!data) {
    rbr(res, 405, "商品不存在~");
    return;
  }
  rbr(res, data);
});
router.post("/", (req, res) => {
  const { name } = req.body;
  const data = handelData.reader() || [];
  if (data.some((item) => item.name === name)) {
    rbr(res, 405, "已经存在同名商品~");
    return;
  }
  handelData.add(req.body);
  rbr(res, "添加成功~");
});
router.put("/:id", (req, res) => {
  const { id } = req.params;
  handelData.update(id, req.body);
  rbr(res, "修改成功~");
});
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const data = handelData.reader(id);
  if (data) {
    const { imgs } = data;
    for (const img of imgs) {
      const imgPath = path.resolve(__dirname, "../../upload/" + img);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }
  }
  handelData.remove(id);
  rbr(res, "删除成功~");
});

app.use("/goods", router);
