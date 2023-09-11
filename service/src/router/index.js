// require("./user.router");
const fs = require("fs");
const path = require("path");

// 自动的导入写好的路由
function registerRouter(file = "") {
  const filePath = path.resolve(__dirname, file);
  const fileStat = fs.statSync(filePath);
  if (fileStat.isDirectory()) {
    const childPath = fs.readdirSync(filePath);
    for (const file of childPath) {
      if (file !== "index.js") {
        require(path.resolve(filePath, file));
      }
    }
  }
}

registerRouter();
