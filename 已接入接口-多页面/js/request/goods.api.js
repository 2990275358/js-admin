import request from "./request.js";
import { message } from "../utils/index.js";

const getGoodsList = async () => {
  try {
    const { data, isOk, msg } = await request.get("goods");
    if (!isOk) {
      message(msg, "err");
      return [];
    }
    return data;
  } catch (error) {
    console.log("请求失败~", error);
    message("请求失败~", "err");
  }
};
const addGoods = async (data) => {
  try {
    const result = await request.post("goods", data);
    const { isOk, msg } = result;
    if (isOk) {
      message({ text: msg, type: "success" });
      return true;
    }
    message({ text: msg, type: "err" });
  } catch (error) {
    console.log(error);
    message({ text: "请求错误~", type: "err" });
  }
};
const updateGoods = async (id, data) => {
  try {
    const result = await request.put(`goods/${id}`, data);
    const { isOk, msg } = result;
    if (isOk) {
      message({ text: msg, type: "success" });
      return true;
    }
    message({ text: msg, type: "err" });
  } catch (error) {
    console.log(error);
    message({ text: "请求错误~", type: "err" });
  }
};
const removeGoods = async (id) => {
  try {
    const result = await request.delete(`goods/${id}`);
    const { isOk, msg } = result;
    if (isOk) {
      message({ text: msg, type: "success" });
      return true;
    }
    message({ text: msg, type: "err" });
  } catch (error) {
    console.log(error);
    message({ text: "请求错误~", type: "err" });
  }
};

export { getGoodsList, addGoods, updateGoods, removeGoods };
