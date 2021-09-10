# service-building
单点登录服务改造
启动项目后访问localhost:8893，不会跳转到原本的登陆页面，而是跳转到统一身份认证登录页面
统一身份认证系统用户授权：用户名：user1   密码：aBcd123456
认证成功后返回code和token并重定向到login页面，改造后的login页面直接进入服务页面
