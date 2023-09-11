// 菜单数据
const menuData = [
  {
    id: "1",
    name: "用户验证",
    path: "用户验证",
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
    name: "系统图标",
    path: "xitongtu",
    icon: "icon-tupian",
    type: "2",
    pid: "3",
  },
  {
    id: "3-2",
    name: "系统配色",
    path: "xitonpeise",
    type: "2",
    pid: "3",
  },
];

const degrees = ["专科", "本科", "研究生", "博士"];
const hobbys = ["唱", "跳", "rap", "篮球", "足球"];
const provinces = ["湖北省", "四川省", "山东省", "山西省"];
const citys = [
  ["荆州市", "武汉市", "宜昌市", "襄阳市", "黄石市", "鄂州市"],
  ["成都市", "乐山市", "德阳市", "广元市", "巴中市"],
  ["菏泽市", "济宁市", "青岛市", "济南市"],
  ["运城市", "忻州市", "临汾市", "吕梁市", "长治市", "大同市", "太原市"],
];

export { menuData, degrees, hobbys, provinces, citys };
