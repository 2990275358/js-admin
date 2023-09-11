# 接口文档

> 本接口文档服务于原生js实现的管理系统，为课堂demo，功能简单，仅有基本的增删改查

## 一、用户接口

### /user 查询用户

##### method: GET

##### query: id(string)

##### response: {stauts: 200, data: (array|object), total: (number)}

##### tip: query可以不传，不传默认查全部

### /user 添加用户

##### method: POST

##### body: 

```json
{
    "name":"王有为",
    "email":"2990275358@qq.com",
    "sex":"男",
    "hobby":"篮球",
    "address":"四川巴中",
    "password":"123456",
    "avatar":""
}
```

##### response: {stauts: 200, msg:(string)}

### /user 修改用户

##### method: PUT

##### params: id(string)

##### response: {stauts: 200, msg:(string)}

### /user 删除用户

##### method: DELETE

##### params: id(string)

##### response: {stauts: 200,  msg:(string)}

### /user/login 登录

##### method: POST

##### body: {email:(string),password:(string)}

##### response: {stauts: 200, data: object, total: (number)}

## 二、上传图片

### /file

##### method: DELETE

##### formdata: name:file value:图片 

##### response: {stauts: 200, data: (array)}

## 三、商品接口和用户一致

本demo没有使用数据库，所有数据都是以json格式存在本地
