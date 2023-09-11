import jmrHttp from "./fetch/index.js";
import { HOST } from "../config/common.config.js";

const request = jmrHttp.create({
  baseUrl: HOST,
});

request.interceptors.response.use((res) => {
  const { status } = res;
  if (+status >= 400) {
    res.isOk = false;
  } else {
    res.isOk = true;
  }
  return res;
});

export default request;
