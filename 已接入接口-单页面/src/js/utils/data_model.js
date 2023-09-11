/**
 * 数据模型，封装了处理数据的方法，每条数据必须有唯一的ID值
 */
class DataModel {
  constructor(data = []) {
    if (!Array.isArray(data)) {
      console.warn("数据控制:初始化数据有误");
      return;
    }
    this.data = data;
  }
  /**
   * 根据ID获取数据
   * @param {String} id 数据的ID
   * @returns 取到的数据
   */
  get(id) {
    if (typeof id === "string") {
      return this.data.filter((res) => res.id === id)[0];
    }
    return this.data;
  }
  /**
   * 用于判断是否存在某一条数据
   * @param {Object} obj 判断的条件 key-value
   * @returns
   */
  has(obj) {
    let isHas = false;
    for (const key in obj) {
      isHas = this.data.some((res) => res[key] === obj[key]);
    }
    return isHas;
  }
  /**
   * 筛选数据
   * @param {Object} obj 筛选的属性条件 key-value
   * @returns
   */
  filter(obj) {
    if (!obj) return this.data;
    let result = this.data;
    if ("id" in obj) return [this.get(obj.id)];
    for (const key in obj) {
      const value = obj[key];
      result = result.filter((res) => res[key].indexOf(value) !== -1);
    }
    return result;
  }
  set(data) {
    this.data = data;
  }
  /**
   * 修改数据
   * @param {String} id 要修改数据的ID
   * @param {Object} obj 要修改的属性 key-value
   */
  update(id, obj) {
    const target = this.get(id);
    for (const key in obj) {
      const value = obj[key];
      for (const tkey in target) {
        if (tkey != key) continue;
        target[tkey] = value;
      }
    }
  }
}

export default DataModel;
