const fs = require("fs");
const { resolve } = require("path");

function getUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class HandleData {
  constructor(datapath = "") {
    this.datapath = resolve(__dirname, `../data/${datapath}.json`);
  }
  reader(id = "") {
    if (!this.pathIsExists()) return undefined;
    let data = fs.readFileSync(this.datapath, { encoding: "utf-8" });
    if (!data) return undefined;
    data = JSON.parse(data);
    if (!id) return data;
    return data.find((item) => item.id === id);
  }
  pathIsExists() {
    return fs.existsSync(this.datapath);
  }
  remove(id) {
    const data = this.reader();
    const result = data.filter((v) => v.id !== id);
    this.write(result);
  }
  add(data) {
    const id = getUUID();
    const taskList = this.reader();
    const task = { id, ...data };
    taskList.push(task);
    this.write(taskList);
  }
  update(id, data) {
    const list = this.reader();
    list.forEach((item) => {
      if (item.id === id) {
        for (const key in data) {
          item[key] = data[key];
        }
        // 终止循环
        return;
      }
    });
    this.write(list);
  }
  write(data) {
    if (!this.pathIsExists()) return;
    fs.writeFileSync(this.datapath, JSON.stringify(data), {
      encoding: "utf-8",
      flag: "w",
    });
  }
}

module.exports = {
  HandleData,
  getUUID,
};
