const handelData = require("./handle-data");
const handleFile = require("./handle-file");

/**
 * 时间格式转换
 * @param {Number} timestamp 时间戳
 * @param {String} format 格式
 * @returns
 */
function formatTime(timestamp, format = "yyyy-MM-dd HH:mm:ss") {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  format = format.replace(/yyyy/g, year);
  format = format.replace(/MM/g, month.toString().padStart(2, "0"));
  format = format.replace(/dd/g, day.toString().padStart(2, "0"));
  format = format.replace(/HH/g, hour.toString().padStart(2, "0"));
  format = format.replace(/mm/g, minute.toString().padStart(2, "0"));
  format = format.replace(/ss/g, second.toString().padStart(2, "0"));

  return format;
}
/**
 * 获取当天的年月日
 * @param {String} delimiter 日期的连接符
 * @returns
 */
function getCurDay(delimiter = "-") {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}${delimiter}${month}${delimiter}${day}`;
}
function rbr(res, status, msg = true) {
  let result = { status };
  if (typeof status === "string" || typeof status === "object") {
    result.status = 200;
  }
  if (typeof status === "object") {
    result.data = status;
    if (msg) {
      let total = Array.isArray(status) ? status.length : 1;
      result.total = total;
    }
  }
  if (typeof status === "string") result.msg = status;
  if (typeof msg === "string") result.msg = msg;
  res.send(result);
}

module.exports = {
  formatTime,
  getCurDay,
  rbr,
  ...handelData,
  ...handleFile,
};
