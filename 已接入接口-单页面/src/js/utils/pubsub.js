class PubSub {
  constructor() {
    // 事件池
    this.subscribers = {};
  }
  /**
   * 发布事件
   * @param {string} key 要发布的关键字
   * @param {array} data 传递的数据,参数为数组时需包装为二维数组，多个参数时需要以数组的形式传递
   * @param {*} thisArg 需要更改this指向时将this传递进来
   */
  emit(key, data, thisArg) {
    const curSubs = this.subscribers[key];
    thisArg = thisArg || this;
    if (!Array.isArray(data)) data = [data];
    if (!curSubs) return;
    for (const event of curSubs) {
      event.call(thisArg, ...data);
    }
  }
  /**
   * 订阅事件
   * @param {string} key 要订阅的关键字
   * @param {function} event 订阅发布时执行的事件
   */
  on(key, event) {
    // 拿到当前发布的消息
    let curSub = this.subscribers[key];
    // 是否存在消息
    if (!curSub) curSub = [];
    curSub.push(event);
    // 最后统一修改数据
    this.subscribers[key] = curSub;
  }
  /**
   * 取消订阅
   * @param {string} key 要取消订阅的关键字
   * @param {function} event 要取消订阅的事件
   */
  off(key, event) {
    const curSubs = this.subscribers[key];
    if (!curSubs) return;
    while (true) {
      const idx = curSubs.findIndex((e) => event === e);
      if (idx === -1) break;
      curSubs.splice(idx, 1);
    }
    this.subscribers[key] = curSubs;
  }
}
const pubsub = new PubSub();
export { pubsub };
export default PubSub;
