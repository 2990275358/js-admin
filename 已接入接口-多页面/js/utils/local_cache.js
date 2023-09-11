/* 带有时间限制的本地存储 */
class LocalCache {
  constructor(type = "local", interval = 7200000) {
    this.type = type;
    this.interval = interval;
  }
  setType(type = "local") {
    if (typeof type !== "string" || type === this.type) return;
    this.type = type;
  }
  setItem(key, value, interval, type = "local") {
    console.log(value);
    if (!key || typeof key !== "string") return;
    if (!value && value !== 0) return;
    if (typeof interval !== "number") interval = this.interval;
    let data = JSON.stringify({
      expireTime: new Date().getTime(),
      value,
      interval,
    });
    if (type === "local") {
      window.localStorage.setItem(key, data);
      return;
    }
    window.sessionStorage.setItem(key, data);
  }
  getItem(key, type = "local") {
    let data = null;
    if (type === "local") {
      data = window.localStorage.getItem(key);
    } else {
      data = window.sessionStorage.getItem(key);
    }
    if (!data) return null;
    data = JSON.parse(data);
    const { interval, expireTime } = data;
    if (this.isExpire(expireTime, interval)) {
      this.remove(key);
      return null;
    }
    return data.value;
  }
  isExpire(expireTime, interval) {
    if (interval === 0) return false;
    const curTime = new Date().getTime();
    if (curTime - expireTime > interval) return true;
    return false;
  }
  remove(key, type = "local") {
    if (typeof key !== "string") return;
    if (type === "local") {
      window.localStorage.removeItem(key);
    } else {
      window.sessionStorage.removeItem(key);
    }
  }
}

const cache = new LocalCache();

export { cache };

export default LocalCache;
