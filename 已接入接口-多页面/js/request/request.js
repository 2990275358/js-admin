import jmrHttp from "./fetch/index.js";

const request = jmrHttp.create({
  baseUrl: "http://localhost:9000/",
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
