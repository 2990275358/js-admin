const fs = require("fs");
const path = require("path");
const app = require("../app");
const express = require("express");
const { HandleData, rbr } = require("../utils");

const router = express.Router();
const handelData = new HandleData("user");

router.get("/", (req, res) => {
  const { id } = req.query;
  const data = handelData.reader(id);
  if (!data) {
    rbr(res, 405, "用户不存在~");
    return;
  }
  rbr(res, data);
});
router.post("/", (req, res) => {
  const { email } = req.body;
  const list = handelData.reader();
  if (list.some((item) => item.email === email)) {
    rbr(res, 404, "已经存在相同邮箱~");
    return;
  }
  handelData.add(req.body);
  rbr(res, "添加成功~");
});
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  const list = handelData.reader();
  if (list.some((item) => item.email === email && item.id !== id)) {
    rbr(res, 404, "已经存在相同邮箱~");
    return;
  }
  handelData.update(id, req.body);
  rbr(res, "修改成功~");
});
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const data = handelData.reader(id);
  if (data) {
    const { avatar } = data;
    const imgPath = path.resolve(__dirname, "../../upload/" + avatar);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }
  }
  handelData.remove(id);
  rbr(res, "删除成功~");
});
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const userList = handelData.reader();
  const userInfo = userList.find((item) => item.email === email);
  if (!userInfo) {
    rbr(res, 405, "邮箱不存在~");
    return;
  }
  if (userInfo.password !== password) {
    rbr(res, 405, "密码错误~");
    return;
  }
  rbr(res, userInfo);
});

app.use("/user", router);
