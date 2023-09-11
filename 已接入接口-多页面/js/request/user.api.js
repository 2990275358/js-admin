import request from "./request.js";
import { message } from "../utils/index.js";

const getUserList = async () => {
  try {
    const result = await request.get("user");
    const { data, isOk, msg, total } = result;
    if (isOk) {
      return {
        data,
        total,
      };
    } else {
      message({ text: msg, type: "err" });
    }
  } catch (error) {
    console.log(error);
    message({ text: "请求错误~", type: "err" });
  }
};

const addUser = async (data) => {
  try {
    const result = await request.post("user", data);
    const { isOk, msg } = result;
    if (isOk) {
      message({ text: msg, type: "success" });
      return true;
    }
    message({ text: msg, type: "err" });
    return false;
  } catch (error) {
    console.log(error);
    message({ text: "请求错误~", type: "err" });
  }
};
const updateUser = async (id, data) => {
  try {
    const result = await request.put(`user/${id}`, data);
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
const removeUser = async (id) => {
  try {
    const result = await request.delete(`user/${id}`);
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
    const { isOk, data: userInfo } = result;
    if (!isOk) return message({ text: msg, type: "err" });
    message({ text: "登录成功", type: "success" });
    return userInfo;
  } catch (error) {
    console.log(error);
    message({ text: "请求错误~", type: "err" });
  }
};

export { getUserList, addUser, login, updateUser, removeUser };
