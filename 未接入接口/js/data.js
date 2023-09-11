// 菜单数据
const menuData = [
  {
    id: "1",
    name: "用户验证",
    path: "register.html",
    icon: "icon-jurassic_user",
    type: "2",
    pid: "",
  },
  {
    id: "2",
    name: "系统管理",
    path: "order.html",
    icon: "",
    type: "1",
    pid: "",
  },
  {
    id: "2-1",
    name: "订单管理",
    path: "order.html",
    icon: "icon-dingdan_dingdanliebiao",
    type: "2",
    pid: "2",
  },
  {
    id: "2-2",
    name: "用户管理",
    path: "user.html",
    icon: "icon-jurassic_user",
    type: "2",
    pid: "2",
  },
  {
    id: "2-3",
    name: "商品管理",
    path: "goods.html",
    icon: "icon-shangpin",
    type: "2",
    pid: "2",
  },
  {
    id: "3",
    name: "系统配置",
    path: "img.html",
    icon: "",
    type: "1",
    pid: "",
  },
  {
    id: "3-1",
    name: "商品图片",
    path: "img.html",
    icon: "icon-tupian",
    type: "2",
    pid: "3",
  },
  {
    id: "3-2",
    name: "系统配色",
    path: "theme.html",
    type: "2",
    pid: "3",
  },
];
const hobbys = ["唱", "跳", "rap", "篮球", "足球"];
const provinces = ["湖北省", "四川省", "山东省", "山西省"];
const citys = [
  ["荆州市", "武汉市", "宜昌市", "襄阳市", "黄石市", "鄂州市"],
  ["成都市", "乐山市", "德阳市", "广元市", "巴中市"],
  ["菏泽市", "济宁市", "青岛市", "济南市"],
  ["运城市", "忻州市", "临汾市", "吕梁市", "长治市", "大同市", "太原市"],
];
/**
 * 操作缓存数据
 */
class LocalCache {
  static get(key) {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : value;
  }
  static set(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  static remove(key) {
    sessionStorage.removeItem(key);
  }
}
/**
 * 数据模型，封装了处理数据的方法，每条数据必须有唯一的ID值
 */
class DataModel {
  model = "";
  constructor(model, info = []) {
    if (!Array.isArray(info)) {
      console.warn("数据控制:初始化数据有误");
      return;
    }
    this.model = model;
    if (!LocalCache.get(model)) {
      LocalCache.set(model, info);
    }
  }
  /**
   * 获取数据列表
   * @returns 数据列表
   */
  getList() {
    return LocalCache.get(this.model);
  }
  /**
   * 根据ID获取数据
   * @param {String} id 数据的ID
   * @returns 取到的数据
   */
  get(id) {
    return LocalCache.get(this.model).filter((res) => res.id === id)[0];
  }
  /**
   * 添加数据
   * @param {Object} obj 要添加的数据
   */
  add(obj) {
    const data = LocalCache.get(this.model);
    const id = this.getUUid();
    Object.assign(obj, { id });
    LocalCache.set(this.model, [obj, ...data]);
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
  /**
   * 删除数据
   * @param {String} id 要删除数据的ID
   */
  remove(id) {
    const data = LocalCache.get(this.model);
    LocalCache.set(
      this.model,
      data.filter((res) => res.id != id)
    );
  }
  /**
   * 获取有多少条数据
   * @returns 数据长度
   */
  size() {
    return LocalCache.get(this.model).length;
  }
  /**
   * 用于判断是否存在某一条数据
   * @param {Object} obj 判断的条件 key-value
   * @returns
   */
  has(obj) {
    let isHas = false;
    const data = LocalCache.get(this.model);
    for (const key in obj) {
      isHas = data.some((res) => res[key] === obj[key]);
    }
    return isHas;
  }
  /**
   * 筛选数据
   * @param {Object} obj 筛选的属性条件 key-value
   * @returns
   */
  filter(obj) {
    let result = LocalCache.get(this.model);
    if ("id" in obj) return [this.get(obj.id)];
    for (const key in obj) {
      const value = obj[key];
      result = result.filter((res) => res[key].indexOf(value) !== -1);
    }
    return result;
  }
  getUUid() {
    return (
      Date.now().toString() + "_" + Math.random().toString(36).substring(2, 9)
    );
  }
}

const userModel = new DataModel("user", [
  {
    id: "1",
    name: "wangyouwei",
    email: "2990275358@qq.com",
    password: "123456",
    city: "荆州市",
    province: "湖北省",
    sex: "男",
    hobby: "篮球",
    avatar: "img/avatar.jpg",
  },
]);
const goodsModel = new DataModel("goods", [
  {
    id: "aa",
    name: "iPhone16 Pro Max",
    address: "广东省深圳市",
    total: 99,
    price: 99999,
    salesVolume: 1,
    imgs: ["img/iphone1.webp", "img/iphone2.webp", "img/iphone3.webp"],
  },
  {
    id: "bb",
    name: "macbook Pro Max",
    address: "广东省深圳市",
    total: 100,
    price: 19999,
    salesVolume: 3,
    imgs: ["img/mb1.webp", "img/mb2.webp", "img/mb3.webp", "img/mb4.webp"],
  },
]);
const orderModel = new DataModel("order", [
  {
    name: "王有为",
    city: "荆州市",
    province: "湖北省",
    phone: "15828917951",
    goodsName: "iPhone16 Pro Max",
    totalMoney: "30000",
    total: 3,
    createAt: "2023-06-15 20:20:20",
  },
]);
