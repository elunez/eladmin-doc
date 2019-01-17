# 一、项目介绍
eladmin 基于 Spring Boot 2.1.0 、 Spring Boot Jpa、 JWT、Spring Security、Redis、Vue的前后端分离后台管理系统。

前端模板基于：[https://github.com/PanJiaChen/vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)<br>
前端开发文档可以参考：[https://panjiachen.github.io/vue-element-admin-site/zh/guide/](https://panjiachen.github.io/vue-element-admin-site/zh/guide/)

## 1.1 项目地址
|   后端源码  |   前端源码  |
|--- | --- |
|  https://github.com/elunez/eladmin   |  https://github.com/elunez/eladmin-qd   |

## 1.2 功能模块
```
- 系统管理
    - 用户管理 提供用户的相关配置
    - 角色管理 角色菜单进行权限的分配
    - Swagger文档 localhost:8000/swagger-ui.html
    - 权限管理 权限细化到接口
    - 菜单管理 已实现菜单动态路由，后端可配置化，支持多级菜单
    - 定时任务 整合Quartz做定时任务，加入任务日志，任务运行情况一目了然
- 系统监控
    - 系统日志 使用apo记录用户操作日志，并且记录异常堆栈信息
    - 系统缓存 使用jedis将缓存操作可视化，并提供对redis的基本操作，可根据需求自行扩展
    - 实时控制台 实时打印logback日志，来自微强迫症患者的精心配色，更好的监控系统的运行状态
    - SQL监控 采用druid 监控数据库访问性能，默认用户名admin，密码123456
- 三方工具
    - 邮件工具 配合富文本，发送html格式的邮件
    - SM.MS免费图床 挺好用的一个图床，作为公共图片上传使用
    - 七牛云存储 这个就不多说了
    - 支付宝支付 提供了测试账号，可自行测试
- 组件管理
    - 图标库 系统图标来自 https://www.iconfont.cn/
    - 富文本 集成wangEditor富文本
```
## 1.3 项目结构
```
- common 公共包
    - aop 记录日志与接口限流
    - exception 项目异常处理
    - mapper mapstruct的通用mapper
    - redis redis缓存相关配置
    - swagger2 接口文档配置
    - utils 通用工具
- core 核心包
    - config  JWT的安全过滤器配置与跨域配置
    - rest 用户授权的接口
    - security 配置spring security
    - service 用户登录与权限的处理
    - utils 包含加密工具与JWT工具
- monitor 系统监控
    - config 配置日志拦截器与WebSocket等
    - domain 实体类
    - repository 数据库操作
    - rest 前端控制器
    - service 业务接口
        - impl 业务接口实现
        - query 业务查询
- quartz 定时任务
- system 系统管理
- tools 第三方工具
```
## 1.4 开发环境
### 1.4.1 后端开发环境
*   JDK：8
*   Redis 3.0+
*   Maven 3.5.3
*   MYSQL 5.5.59
*   开发工具：IntelliJ IDEA （**需安装lombok插件**）

### 1.4.2 前端开发环境
*  Node.js v10.14.2
*  开发工具：JetBrains WebStorm

## 1.5 反馈交流

- QQ群：<a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=90830191a40600e3a07acdcc4864890fca50c8e3ca1772e7e288a561d576f6c4"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="Quella/el-admin" title="Quella/el-admin"></a>
- 个人邮箱 elunez@qq.com

# 二、开发准备
在使用该系统前，你还需要做如下准备
## 2.1 安装redis
redis的安装可参考：[http://www.runoob.com/redis/redis-install.html](http://www.runoob.com/redis/redis-install.html)
## 2.2 给idea安装lombok插件
lombok的安装以及为什么使用它，可以查看：[https://www.jianshu.com/p/f26d177b88be](https://www.jianshu.com/p/f26d177b88be)
## 2.3 了解MapStruct
项目中使用到了MapStruct自动映射DTO，如果你不熟悉，可以查看：[https://www.jianshu.com/p/3f20ca1a93b0](https://www.jianshu.com/p/3f20ca1a93b0)
## 2.4 安装node.js
前端需依赖node.js，对于没有node.js环境的，可以参考：[http://www.runoob.com/nodejs/nodejs-install-setup.html](http://www.runoob.com/nodejs/nodejs-install-setup.html)

# 三、快速开始
> 因为本项目是前后端分离的，所以需要前后端都部署好，才能进行访问<br>
> 前端页面访问地址：```localhost:8013```<br>
> 后端 swagger 需带token进行测试，文档地址：```localhost:8000/swagger-ui.html``` 
## 3.1 前端项目部署
部署前请先检查系统是否有 ```node.js``` 环境，如果没有需安装 ```node8.x``` 最新版，再进行部署
### 3.1.1 开发环境
```
# 克隆前端项目
git clone https://github.com/elunez/eladmin-qd.git
# 定位到eladmin-qd目录
cd eladmin-qd
# 安装依赖
npm install
# 本地开发 启动项目
npm run dev
```
**注意**

如果出现类似下图的问题

![](https://i.imgur.com/hCUoVYk.jpg)

**解决办法**
```
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
```
### 3.1.2 生产环境
需打包并把 ```dist``` 目录文件，部署到 ```Nginx``` 里，需将 ```prod.env.js``` 里面的 ```bash_api``` 改成自己相应的地址
![](https://i.imgur.com/v07Xa5p.png)
```
# 构建生产环境
npm run build
# 服务器上安装Nginx，并在 nginx/conf/nginx.conf 修改配置文件 
server
    {
        listen 80;
        server_name 域名;
        index index.html index.htm index.php;
        root  /www/server/dist; #路径
        error_page 404 /index.html; #这个配置，预防页面刷新后跳转到404页面
    }
# 启动Nginx后，访问域名即可
```
## 3.2 后端项目部署
### 3.2.1 开发环境
开发工具如果是 ```idea``` 的话，直接导入项目，安装完依赖后，按下图操作即可

![](https://i.imgur.com/xrDZLTQ.png)

**注意** 如果你在启动过程中出现类似这种错误，你需要去了解 ```MapStruct``` 的工作原理，目录 2.3 有提及

![](https://i.imgur.com/QGUvTSW.png)

解决办法，输入 ```mvn compile``` 生成 ```Mapper``` 的实现即可
	
![](https://i.imgur.com/atRXrdZ.png)

### 3.2.2 生产环境
生产环境需将打包成 ```jar``` ，上传到服务器后，通过 ```Linux``` 的 ```nohup``` 命令使```java```程序后台运行。再使用```ngnix```代理```java```服务，当然也可以使用```docker```部署，这里演示第一种
#### （1）打包项目

|   第一步  |   第二步  |
|--- | --- |
|  ![](https://i.imgur.com/8Z0egVe.png)   |  ![](https://i.imgur.com/fcsaCfn.png)   |

#### （2）将配置文件上传到服务器
修改我们的配置文件用于 ```pro``` 环境，将它上传到服务器，你需要修改：

1. 数据库连接地址
2. 数据库密码
3. 将 ```Hibernate ddl``` 设置成 ```none```，避免程序运行时自动更新数据库结构

```
 hibernate:
      ddl-auto: none
```
#### （3）编写脚本操作java服务
**启动脚本** ```start.sh ```
``` sh
nohup java -jar eladmin-v1.0.jar --spring.config.location=application.yml &
```
**停止脚本** ```stop.sh ```
``` sh
PID=$(ps -ef | grep eladmin-v1.0.jar | grep -v grep | awk '{ print $2 }')
if [ -z "$PID" ]
then
echo Application is already stopped
else
echo kill $PID
kill $PID
fi
```
**新建空白Log文件，保存日志** ```nohup.out```
```
touch nohup.out
```
**查看日志** ```log.sh```
``` sh
tail -f nohup.out
```
**完整目录如下图**
![](https://i.imgur.com/yaDRw1t.png)
#### （3）操作java服务
脚本创建完成后就可以直接操作```java```服务了，具体命令如下
```
# 启动java
./start.sh
# 停止java服务
./stop.sh
# 查看日志
./log.sh
```
#### （4）使用ngnix代理java服务
我们如果想给我们的```java```服务绑定域名并且使用```80```端口访问，而```80```端口被其他服务占用了，这个时候就需要```ngnix```代理```java```服务，修改```ngnix```配置文件
```
server {
    listen 80;
    server_name 域名;
    location / {
        proxy_pass http://127.0.0.1:8000; #这里的端口记得改成项目对应的哦
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        }
    }
```
重启```ngnix``` 后，就能通过域名访问了
## 3.3 完整ngnix配置文件
```
user  www www;
worker_processes auto;
error_log  /www/wwwlogs/nginx_error.log  crit;
pid        /www/server/nginx/logs/nginx.pid;
worker_rlimit_nofile 51200;
events
    {
        use epoll;
        worker_connections 51200;
        multi_accept on;
    }

http
    {
        include mime.types;
		#include luawaf.conf;

		include proxy.conf;

        default_type  application/octet-stream;

        server_names_hash_bucket_size 512;
        client_header_buffer_size 32k;
        large_client_header_buffers 4 32k;
        client_max_body_size 50m;

        sendfile   on;
        tcp_nopush on;

        keepalive_timeout 60;

        tcp_nodelay on;

        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
        fastcgi_buffer_size 64k;
        fastcgi_buffers 4 64k;
        fastcgi_busy_buffers_size 128k;
        fastcgi_temp_file_write_size 256k;
		fastcgi_intercept_errors on;

        gzip on;
        gzip_min_length  1k;
        gzip_buffers     4 16k;
        gzip_http_version 1.1;
        gzip_comp_level 2;
        gzip_types     text/plain application/javascript application/x-javascript text/javascript text/css application/xml;
        gzip_vary on;
        gzip_proxied   expired no-cache no-store private auth;
        gzip_disable   "MSIE [1-6]\.";

        limit_conn_zone $binary_remote_addr zone=perip:10m;
		limit_conn_zone $server_name zone=perserver:10m;

        server_tokens off;
        access_log off;

server 
	{
	    listen 80;
	    server_name 域名;
	    location / {
	        proxy_pass http://127.0.0.1:8000; #这里的端口记得改成项目对应的哦
	        proxy_set_header X-Forwarded-Proto $scheme;
	        proxy_set_header X-Forwarded-Port $server_port;
	        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	        proxy_set_header Upgrade $http_upgrade;
	        proxy_set_header Connection "upgrade";
        }
    }
server
    {
        listen 80;
        server_name 域名;
        index index.html index.htm index.php;
        root  /www/server/eladmin;

        error_page 404 /index.html;
        include enable-php.conf;

        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires      30d;
        }

        location ~ .*\.(js|css)?$
        {
            expires      12h;
        }

        location ~ /\.
        {
            deny all;
        }

        access_log  /www/wwwlogs/access.log;
    }
include /www/server/panel/vhost/nginx/*.conf;
}
```
## 3.4 账号与密码
- 管理员： admin
- 测试用户： test
- 密码： 123456

# 四、系统日志与监控
本系统 ```logback``` 打印系统日志，是用 ```log4jdbc``` 打印 ```sql``` 日志并显示占位符内容，使用 ```aop``` 方式记录用户操作日志，```logback配合log4jdbc``` 打印sql日志可以查看：[https://blog.csdn.net/zj7321/article/details/83144980](https://blog.csdn.net/zj7321/article/details/83144980)

## 4.1 logback

 ```logback``` 的使用可以查看：[https://blog.csdn.net/zj7321/article/details/83108240](https://blog.csdn.net/zj7321/article/details/83108240)
## 4.2 aop记录用户操作日志

项目中用户的操作日志使用AOP的方式实现，切点为为自定义注解@Log，具体实现，请查看源码，源码位于：```common -> log```

``` java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Log {
	String description() default "";
}
```
**在控制器中使用**
``` java
@Log(description = "查询菜单")
@GetMapping(value = "/menus")
public ResponseEntity getMenus(@RequestParam(required = false) String name){
    // 略
}
```
当用户访问该接口时，就会生成如下内容

![](https://i.imgur.com/rd7cgpG.png)

## 4.3 Druid监控
Druid是一个关系型数据库连接池，是阿里的一个开源项目，Druid能够提供强大的监控和扩展功能，启动项目后，访问 [http://localhost:8000/druid](http://localhost:8000/druid) ，输入用户名：```admin```和密码：```123456```（配置文件就不贴出来了，请查看 ```application.yml```）即可进入Druid监控控制台：
![](https://i.imgur.com/hWLIvzu.png)

# 五、系统权限控制
本系统权限控制采用 ```RBAC```（Role-Based Access Control，基于角色的访问控制），就是用户通过角色与权限进行关联。简单地说，一个用户拥有若干角色，每一个角色拥有若干权限，每一个角色拥有若干个菜单，这样，就构造成“用户-角色-权限”，“角色-菜单” 的授权模型。在这种模型中，用户与角色、角色与权限、角色与菜单之间构成了多对多的关系，如下图
![](https://i.imgur.com/eV3MTXC.png)

## 5.1 后端权限控制
后端接口权限控制基于```Spring Security```（不清楚的可以自己去学习学习），因此每个请求都将携带```token```进行访问，当然可以过滤一些接口如：```Druid```监控，```swagger```文档，支付宝回调等。<br>配置文件位于：core -> config ->  WebSecurityConfig
``` java
// 关键代码
@Override
protected void configure(HttpSecurity httpSecurity) throws Exception {
    httpSecurity
            // 禁用 CSRF
            .csrf().disable()
            // 授权异常
            .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
            // 不创建会话
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeRequests()
            .antMatchers("/auth/**").permitAll()
            .antMatchers("/websocket/**").permitAll()
            .antMatchers("/druid/**").anonymous()
            // 支付宝回调
            .antMatchers("/api/aliPay/return").anonymous()
            .antMatchers("/api/aliPay/notify").anonymous()
            // swagger start
            .antMatchers("/swagger-ui.html").anonymous()
            .antMatchers("/swagger-resources/**").anonymous()
            .antMatchers("/webjars/**").anonymous()
            .antMatchers("/*/api-docs").anonymous()
            // swagger end
            .antMatchers("/test/**").anonymous()
            .antMatchers(HttpMethod.OPTIONS, "/**").anonymous()
            // 所有请求都需要认证
            .anyRequest().authenticated();
    httpSecurity
            .addFilterBefore(authenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);
}
```
### 5.1.1 数据交互
用户输入账号密码 -> 验证账号密码返回token -> 前端带上token请求数据 -> 后端返回数据<br>
数据交互流程如下图：
![](https://i.imgur.com/LujejDx.png)
### 5.1.2 接口权限控制
```Spring Security```允许我们在定义URL访问或方法访问所应有的权限时使用```Spring EL```表达式。<br>
如下表示用户拥有 ```ADMIN```、```MENU_ALL```、```MENU_EDIT``` 三个权限中的任意一个就能能访问```update```方法，但是如果方法前不加```@preAuthorize```注解，意味着所有用户都能访问update
``` java
@Log(description = "修改菜单")
@PutMapping(value = "/menus")
@PreAuthorize("hasAnyRole('ADMIN','MENU_ALL','MENU_EDIT')")
public ResponseEntity update(@Validated @RequestBody Menu resources){
    // 略
}
```
## 5.2 前端权限控制
前端页面的权限控制只需要引入权限判断函数，使用如下 ```v-if``` 去验证，用户没有该权限就不会显示该标签与该标签内的内容，具体代码如下：
``` html
<template>
  	<el-tab-pane v-if="checkPermission(['ADMIN'])" label="Admin">
		admin 权限的用户才能看到
	 </el-tab-pane>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数

export default{
   methods: {
    checkPermission
   }
}
</script>
```
# 六、系统菜单路由
首先了解一些本项目配置路由时提供了哪些配置项。
```
//当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
hidden: true // (默认 false)

//当设置 noredirect 的时候该路由在面包屑导航中不可被点击
redirect: 'noredirect'

//当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
//只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
//若你想不管路由下面的 children 声明的个数都显示你的根路由
//你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
alwaysShow: true

name: 'router-name' //设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
meta: {
  title: 'title' //设置该路由在侧边栏和面包屑中展示的名字
  icon: 'svg-name' //设置该路由的图标
  noCache: true //如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
  breadcrumb: false // 如果设置为false，则不会在breadcrumb面包屑中显示
}
```	
示例：
```
{
  path: '/permission',
  component: Layout,
  redirect: '/permission/index', //重定向地址，在面包屑中点击会重定向去的地址
  hidden: true, // 不在侧边栏线上
  alwaysShow: true, //一直显示根路由
  children: [{
    path: 'index',
    component: ()=>import('@/views/permission/index'),
    name: 'permission',
    meta: {
      title: 'permission',
      icon: 'lock', //图标
      noCache: true // 不会被 <keep-alive> 缓存
    }
  }]
}
```
## 6.1 添加图标
如果你没有在本项目 Icon 中找到需要的图标，可以到 [iconfont.cn](iconfont.cn) 上选择并生成自己的业务图标库，再进行使用。或者其它 svg 图标网站，下载 svg 并放到 ```src/icons/svg``` 文件夹之中就可以了，下载方式如下图：

![](https://i.imgur.com/GI7PXcI.gif)

使用方式：
```
<svg-icon icon-class="password" /> //icon-class 为 icon 的名字
```
## 6.2 添加菜单
本项目支持菜单动态路由，支持添加4级菜单，支持外链，支持自定义图标，通过选择角色，来控制菜单的渲染，这里演示动态添加菜单
### (1) 添加外链
![](https://i.imgur.com/IChtVT4.png)
### (2) 添加内部菜单
组件路径为 src/views

|   添加内部菜单  |   组件路径对应  |
|--- | --- |
|  ![](https://i.imgur.com/1WcMbnl.png)   |  ![](https://i.imgur.com/H0rCqfR.png)   |

### (3) 添加多级菜单
添加多级菜单请模仿项目内的多级菜单进行添加

![](https://i.imgur.com/HgltRG3.png)

# 七、入门Spring Data Jpa
Jpa（java Persistence API，java持久化 api），它定义了对象关系映射（ORM）以及实体对象持久化的标准接口。在Spring boot中JPA是依靠Hibernate才得以实现对的，JPA可使开发者用极简的代码实现对数据的访问和操作。它提供了包括增删改查等在内的常用功能，且易于扩展！
关于Jpa的使用，我写了两篇文章，供大家学习：
## 7.1 Jpa简单入门
文档地址： [https://blog.csdn.net/zj7321/article/details/82995928](https://blog.csdn.net/zj7321/article/details/82995928)
## 7.2 Jpa高级查询
文档地址： [https://blog.csdn.net/zj7321/article/details/83067976](https://blog.csdn.net/zj7321/article/details/83067976)

# 八、缓存的使用
本系统集成了redis缓存，使用注解就能对系统缓存进行操作，并且提供了可视化的redis缓存操作与查看
## 8.1 配置缓存
redis序列化时可能会报错：<p style="color:red">com.alibaba.fastjson.JSONException: autoType is not support</p> 
错误发生的原因是：```redis```序列化时将```class```信息写入，反序列化的时候，```fastjson```默认情况下会开启```autoType```的检查，相当于一个白名单检查，如果序列化信息中的类路径不在```autoType```中，这个时候就会抛出上面的异常

**解决办法：**

1、全局开启AutoType，不建议使用
<p style="color:#e96900">ParserConfig.getGlobalInstance().setAutoTypeSupport(true);</p>
2、建议小范围指定白名单
<p style="color:#e96900">ParserConfig.getGlobalInstance().addAccept("me.zhengjie.system.domain");</p>

**完整配置如下**
``` java
/**
 * @author jie
 * @date 2018-11-24
 */
@Slf4j
@Configuration
@EnableCaching
@ConditionalOnClass(RedisOperations.class)
@EnableConfigurationProperties(RedisProperties.class)
public class RedisConfig extends CachingConfigurerSupport {

    @Value("${spring.redis.host}")
    private String host;

    @Value("${spring.redis.port}")
    private int port;

    @Value("${spring.redis.timeout}")
    private int timeout;

    @Value("${spring.redis.jedis.pool.max-idle}")
    private int maxIdle;

    @Value("${spring.redis.jedis.pool.max-wait}")
    private long maxWaitMillis;

    @Value("${spring.redis.password}")
    private String password;

    /**
     * 配置 redis 连接池
     * @return
     */
    @Bean
    public JedisPool redisPoolFactory(){
        JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
        jedisPoolConfig.setMaxIdle(maxIdle);
        jedisPoolConfig.setMaxWaitMillis(maxWaitMillis);
        if (StrUtil.isNotBlank(password)) {
            return new JedisPool(jedisPoolConfig, host, port, timeout, password);
        } else {
            return new JedisPool(jedisPoolConfig, host, port,timeout);
        }
    }

    /**
     *  设置 redis 数据默认过期时间
     *  设置@cacheable 序列化方式
     * @return
     */
    @Bean
    public RedisCacheConfiguration redisCacheConfiguration(){
        FastJsonRedisSerializer<Object> fastJsonRedisSerializer = new FastJsonRedisSerializer<>(Object.class);
        RedisCacheConfiguration configuration = RedisCacheConfiguration.defaultCacheConfig();
        configuration = configuration.serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(fastJsonRedisSerializer)).entryTtl(Duration.ofHours(2));
        return configuration;
    }

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
        ParserConfig.getGlobalInstance().addAccept("me.zhengjie.system.service.dto");
        ParserConfig.getGlobalInstance().addAccept("me.zhengjie.system.domain");
        ParserConfig.getGlobalInstance().addAccept("me.zhengjie.tools.domain");
        ParserConfig.getGlobalInstance().addAccept("me.zhengjie.quartz.domain");
        // key的序列化采用StringRedisSerializer
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }

    /**
     * 自定义缓存key生成策略
     * 使用方法 @Cacheable(keyGenerator="keyGenerator")
     * @return
     */
    @Bean
    @Override
    public KeyGenerator keyGenerator() {
        return (target, method, params) -> {
            StringBuilder sb = new StringBuilder();
            sb.append(target.getClass().getName());
            sb.append(method.getName());
            for (Object obj : params) {
                sb.append(obj.toString());
            }
            log.info(sb.toString());
            return sb.toString();
        };
    }
}
```
## 8.2 具体使用

```@CacheConfig``` 一般用于Service类上
```@Cacheable``` 用于Service方法上
```@CachePut``` 用于更新缓存
```@CacheEvict``` 用于清除缓存

使用自定义缓存key生成策略，```@Cacheable(keyGenerator="keyGenerator")``` 具体使用如下
``` java
@CacheConfig(cacheNames = "qiNiu")
public interface QiNiuService {

    /**
     * 查配置
     * @return
     */
    @Cacheable(key = "'1'")
    QiniuConfig find();

    /**
     * 修改配置
     * @param qiniuConfig
     * @return
     */
    @CachePut(key = "'1'")
    QiniuConfig update(QiniuConfig qiniuConfig);

    /**
     * 查询文件
     * @param id
     * @return
     */
    @Cacheable(keyGenerator = "keyGenerator")
    QiniuContent findByContentId(Long id);

    /**
     * 删除文件
     * @param content
     * @param config
     * @return
     */
    @CacheEvict(allEntries = true)
    void delete(QiniuContent content, QiniuConfig config);
}
```
## 8.3 可视化redis操作

![](https://i.imgur.com/xaLtFEb.png)

# 九、异常处理机制

## 9.1 后端异常处理
本系统封装了一些常用的异常处理类，并使用GlobalExceptionHandler类对异常进行统一处理，使用异常处理模块如下图：

![](https://i.imgur.com/LK7iHdb.png)

## 9.2 前端异常处理
在前端的 ```src/utils/request.js``` 文件中对所有的```request```请求进行拦截，通过 ```response``` 拦截器对接口返回的状态码进行分析与异常拦截
``` html
// response 拦截器
service.interceptors.response.use(
  response => {
    const code = response.status
    if (code < 200 || code > 300) {
      Notification.error({
        title: response.message
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    let code = 0
    try {
      code = error.response.data.status
    } catch (e) {
      if (error.toString().indexOf('timeout')) {
        Notification.error({
          title: '请求超时',
          duration: 2500
        })
        return Promise.reject(error)
      }
    }
    if (code === 401) {
      MessageBox.confirm(
        '登录状态已失效，你可以取消继续留在该页面，或者重新登录',
        '提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if (code === 403) {
      router.push({ path: '/401' })
    } else {
      const errorMsg = error.response.data.message
      if (errorMsg !== undefined) {
        Notification.error({
          title: errorMsg,
          duration: 2500
        })
      }
    }
    return Promise.reject(error)
  }
)
```

# 十、版本更新说明
## 2018年12月23日（v1.0）
这个版本是一个纯净的后台，当然也有挺多的bug
- 主要框架：spring boot+Spring Security+Redis
- 密码加密：采用MD5加盐加密
- 系统日志：使用aop保存操作日志
- 实体映射：使用MapStruct
- 前端菜单：支持动态路由

## 2018年12月25号（v1.1）
发布了第二个版本，也修复了v1.0中已知的bug

**新增功能**
-  实时控制台

**Bug修复**
-  修复菜单渲染根据soft字段排序
-  修复菜单部分字段不更新的bug
-  修复前端菜单面包屑导航点击无页面的bug

**细节优化**
-  优化站点统计，改为定时器方式每日0点重置站点访客信息
-  优化默认用户、角色、权限不可删除和修改

## 2018年12月28号（v1.2）
**新增**
- 邮箱工具
- SM.MS免费图床
- 富文本编辑器

**优化**
- 查询细节优化
- 后台接口权限细节优化
- 前端新增和修改按钮loading
- 前端请求超时异常处理
- 菜单sort字段拼写错误，由soft更正为sort
- 前端图标选择组件优化，加入滚动条
- 常用接口处理，前端将图片上传接口和实时控制台接口存入store->modules->api.js

**bug修复**
- 一级菜单无法渲染（后端）
- 修复用户存在多个角色时菜单获取失败（后端）
- 修复角色管理前缀为ROLE_，与spring security的默认前端冲突，导致无权限访问，解决办法：将角色管理的前缀改为ROLES_

## 2018年12月31号（v1.3）
**新增**
- 个人中心上线，修改密码功能，根据邮箱验证码修改邮箱功能，修改头像功能
- 七牛云存储
- 支付宝支付

**优化**
- 实时控制台异常堆栈信息打印
- 对403错误和401错误分开处理

## 2019年1月8号（v1.4）
该版本优化了前端，让form组件可以复用，为下个版本的代码生成做准备
**新增**
-  定时任务管理 整合quartz做定时任务

**调整与优化**
- 前端页面优化，表单组件复用
- 调整redis过期时间为2小时

**bug修复**
- 修复redis key过长时删除失败的问题
- 修复多级菜单渲染异常问题

# 十一、后记
项目文档准备的比较仓促，有任何修改和建议都可以给我发送邮件 elunez@qq.com，或者在 ```github```上提 [Issues](https://github.com/elunez/eladmin/issues "Issues")

# 捐赠
> Donate
> 
> 如果你觉得这个项目帮助到了你，你可以帮作者买一杯果汁表示鼓励🍹

|   微信  |   支付宝  |
|--- | --- |
|  ![](https://i.imgur.com/QJ2pqyg.png)   |  ![](https://i.imgur.com/eO95P7Q.png)  |
