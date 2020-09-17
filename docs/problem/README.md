# 常见问题
## 启动报Mapper找不到
因为项目使用了 ```mapStruct```，在第一次启动的时候并没有生成 ```mapStruct``` 的实现类，因此才会出现类型下面的错误。使用命令 ```mvn compile``` 生成它的实现类即可
```
Description:

Field userMapper in me.zhengjie.modules.system.service.impl.UserServiceImpl required a bean of type 'me.zhengjie.modules.system.service.mapper.UserMapper' that could not be found.

The injection point has the following annotations:
- @org.springframework.beans.factory.annotation.Qualifier(value=jwtUserDetailsService)

Action:

Consider defining a bean of type 'me.zhengjie.modules.system.service.mapper.UserMapper' in your configuration.
```
生成的实现类如下图

![image477c529cdc640f06.png](https://img.el-admin.vip/images/2020/07/07/image477c529cdc640f06.png)

## 关于如何获取当前登录的用户
可以使用工具 ```SecurityUtils``` 获取当前用户
## 关于项目如何使用 MyBatis-Plus
```Jpa```和 ```Mybatis``` 是可以共存的，只需要将mybatis整合进去，原有的代码不动，新的业务使用mybatis即可
## 关于系统如何放行部分接口
[匿名访问接口](https://el-admin.vip/guide/hdsc.html#%E6%8E%A5%E5%8F%A3%E6%9D%83%E9%99%90)
## 关于新增字段后出现的问题
新增字段后容易出现 ```数据库中有数据，列表显示没有数据``` 这种错误，出现的原因可能是

1、数据返回使用的是```DTO```，但是相应的```DTO```中没有这个字段

2、```DTO```存在这个字段，但是 ```mapStruct``` 的实现类没更新

3、新增字段后，redis中的数据并没有更新导致的

对于这种问题，第一步：使用命令 ```mvn compile``` 更新```mapStruct``` 的实现类，第二步：```清空相应的缓存```即可https://docsify.js.org/#/zh-cn/)
## 新建模块后访问接口 404
请检查你新建的模块包名是不是 `me.zhengjie`

如果不是，那么需要在 system 模块中的 AppRun 中配置注解
```java
@ComponentScan(basePackages = {"**.**.rest"})
```
因为 `springboot` 默认扫描规则是扫描启动器类的同包或者其子包的下的注解

而你新加的模块的包名与 `me.zhengjie` 不一致，没有被扫描到肯定是 404
## 关于如何使用```https```部署
群文件有 ```https```的```ngnix```配置文件，可供参考，[百度](https://www.baidu.com/s?tn=02003390_43_hao_pg&isource=infinity&iname=baidu&itype=web&ie=utf-8&wd=ngnix%20https) 上也有很多教程的
## 如何反馈项目 Bug
可在 [Issues](https://github.com/elunez/eladmin-docs/issues) 中留言，或者加群```891137268```进行反馈
