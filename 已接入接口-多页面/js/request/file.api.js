import request from "./request.js";
import { message } from "../utils/index.js";

const uploadImage = async (files) => {
  var formdata = new FormData();
  for (const file of files) {
    formdata.append("file", file);
  }

  var requestOptions = {
    method: "POST",
    body: formdata,
  };

  try {
    const { status, data } = await fetch(
      "http://localhost:9000/file",
      requestOptions
    ).then((response) => response.json());
    if (status < 400) {
      message({ text: "上传成功~", type: "success" });
      return data;
    }
    message({ text: "上传失败~", type: "err" });
  } catch (error) {
    console.log(error);
    message({ text: "请求错误~", type: "err" });
  }
  // try {
  //   // const formData = new FormData();
  //   // for (const file of files) {
  //   //   formData.append("file", files);
  //   // }
  //   const result = await request.post(`file`, formdata);
  //   const { isOk, msg, data } = result;
  //   if (isOk) {
  //     message({ text: msg, type: "success" });
  //     return data;
  //   }
  //   message({ text: msg, type: "err" });
  // } catch (error) {
  //   console.log(error);
  //   message({ text: "请求错误~", type: "err" });
  // }
};

export { uploadImage };
