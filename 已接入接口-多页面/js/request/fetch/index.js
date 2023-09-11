import JmrHttp from "./JmrHttp.js";
import { bind, isPainObject, funcExtend } from "./utils.js";

function createInstance(defaultConfig) {
  if (!isPainObject(defaultConfig)) defaultConfig = {};
  const context = new JmrHttp(defaultConfig);
  const instance = bind(JmrHttp.prototype.request, context);
  // 伪继承JmrHttp.prototype上的方法(实际是浅拷贝)
  funcExtend(instance, JmrHttp.prototype, context);
  // 伪继承实例上的方法
  funcExtend(instance, context);
  instance.create = function create(instanceConfig) {
    return createInstance(instanceConfig);
  };
  return instance;
}

const jmrHttp = createInstance({});

export default jmrHttp;
