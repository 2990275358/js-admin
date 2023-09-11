const { resolve, extname } = require("path");
const fs = require("fs");
const multer = require("multer");
const app = require("../app");
const { rbr, getCurDay, createDir } = require("../utils");
const router = require("express").Router();
const upload = multer({ dest: resolve(__dirname, "../../upload") });

router.post("/", upload.array("file", 9), (req, res) => {
  const urls = [];
  for (const file of req.files) {
    let { originalname, path: filePath, filename } = file;
    // 获取今天的年月日
    const toDay = getCurDay();
    // 文件夹拼接当天的日期，文件夹不存在则创建
    const dirPath = resolve(__dirname, "../../upload/", toDay);
    createDir(dirPath);
    // 拼接文件后缀名
    filename = filename + extname(originalname);
    const newFilePath = resolve(dirPath, filename);
    // 保留上传路径
    urls.push(`${toDay}/${filename}`);
    // 创建读取文件的流
    const rs = fs.createReadStream(filePath);
    // 创建写入文件的流
    const ws = fs.createWriteStream(newFilePath);
    rs.pipe(ws);
    ws.on("close", () => {
      // 写入完成后删除默认写入的文件
      fs.unlinkSync(filePath);
    });
  }
  rbr(res, urls);
});

app.use("/file", router);
