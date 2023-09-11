const fs = require("fs");

function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
}

module.exports = {
  createDir,
};
