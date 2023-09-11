import request from "./request.js";
import { message } from "../utils/index.js";

const getList = async (api) => {
  try {
    const result = await request.get(api);
    const { data, isOk, msg } = result;
    if (isOk) {
      return data;
    } else {
      message({ text: msg, type: "err" });
    }
  } catch (error) {
    console.log(error);
    message({ text: "请求错误~", type: "err" });
  }
};

const addData = async (data, api) => {
  try {
    const result = await request.post(api, data);
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
const updateData = async (id, data, api) => {
  try {
    const result = await request.put(`${api}/${id}`, data);
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
const removeData = async (id, api) => {
  try {
    const result = await request.delete(`${api}/${id}`);
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
const login = async (data) => {
  try {
    const result = await request.post("user/login", data);
    const { isOk, data: userInfo, msg } = result;
    if (!isOk) return message({ text: msg, type: "err" });
    message({ text: "登录成功", type: "success" });
    return userInfo;
  } catch (error) {
    console.log(error);
    message({ text: "请求错误~", type: "err" });
  }
};

export { getList, addData, login, updateData, removeData };
