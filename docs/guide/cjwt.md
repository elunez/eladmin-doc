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

![](https://docs-1255840532.cos.ap-shanghai.myqcloud.com/18750819445653.png)

## autoType is not support
出现这个错误可能的场景
1. 修改了包名或路径
2. 新增了一个模块或者实体

不管是哪种场景，只需要在 ```RedisCofnig``` 中配置白名单即可，配置文件位于 ``` eladmin-common -> redis -> RedisCofnig```，部分代码如下：
```java
@Bean(name = "redisTemplate")
    @ConditionalOnMissingBean(name = "redisTemplate")
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        //序列化
        FastJsonRedisSerializer fastJsonRedisSerializer = new FastJsonRedisSerializer(Object.class);
        // value值的序列化采用fastJsonRedisSerializer
        template.setValueSerializer(fastJsonRedisSerializer);
        template.setHashValueSerializer(fastJsonRedisSerializer);

        // 全局开启AutoType，不建议使用
        // ParserConfig.getGlobalInstance().setAutoTypeSupport(true);
        // 建议使用这种方式，小范围指定白名单
        ParserConfig.getGlobalInstance().addAccept("me.zhengjie.domain");
        ParserConfig.getGlobalInstance().addAccept("me.zhengjie.modules.system.service.dto");
        ParserConfig.getGlobalInstance().addAccept("me.zhengjie.modules.system.domain");
        ParserConfig.getGlobalInstance().addAccept("me.zhengjie.modules.quartz.domain");
        ParserConfig.getGlobalInstance().addAccept("me.zhengjie.modules.monitor.domain");
        ParserConfig.getGlobalInstance().addAccept("me.zhengjie.modules.security.security");
        // key的序列化采用StringRedisSerializer
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }
```
## 关于如何获取当前登录的用户
可以使用工具 ```SecurityUtils``` 获取当前用户
## 关于项目如何使用 MyBatis-Plus
```Jpa```和 ```Mybatis``` 是可以共存的，只需要将mybatis整合进去，原有的代码不动，新的业务使用mybatis即可
## 关于系统如何放行部分接口
[匿名访问接口](http://localhost:8080/guide/hdsc.html#匿名访问)
## 关于新增字段后出现的问题
新增字段后容易出现 ```数据库中有数据，列表显示没有数据``` 这种错误，出现的原因可能是

1、数据返回使用的是```DTO```，但是相应的```DTO```中没有这个字段

2、```DTO```存在这个字段，但是 ```mapStruct``` 的实现类没更新

3、新增字段后，redis中的数据并没有更新导致的

对于这种问题，第一步：使用命令 ```mvn compile``` 更新```mapStruct``` 的实现类，第二步：```清空相应的缓存```即可https://docsify.js.org/#/zh-cn/)

## 关于如何使用```https```部署
群文件有 ```https```的```ngnix```配置文件，可供参考，[百度](https://www.baidu.com/s?tn=02003390_43_hao_pg&isource=infinity&iname=baidu&itype=web&ie=utf-8&wd=ngnix%20https) 上也有很多教程的
## 如何反馈项目 Bug
可在 [Issues](https://github.com/elunez/eladmin-docs/issues) 中留言，或者加群```891137268```进行反馈
