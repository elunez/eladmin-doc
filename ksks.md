#### 项目介绍
#####  功能模块
```
- 系统管理
    - 用户管理 提供用户的相关配置
    - 角色管理 对权限与菜单进行分配
    - 权限管理 权限细化到接口
    - 菜单管理 已实现菜单动态路由，后端可配置化，支持多级菜单
    - 部门管理与岗位管理
    - 字典管理 应广大码友的要求加入字典管理
- 系统监控
    - 操作日志 使用apo记录用户操作日志
    - 异常日志 记录操作过程中的异常，并且提供查看异常的堆栈信息
    - 系统缓存 使用jedis将缓存操作可视化，并提供对redis的基本操作，可根据需求自行扩展
    - 实时控制台 实时打印logback日志，来自微强迫症患者的精心配色，更好的监控系统的运行状态
    - SQL监控 采用druid 监控数据库访问性能，默认用户名admin，密码123456
- 系统工具
 - 定时任务 整合Quartz做定时任务，加入任务日志，任务运行情况一目了然
    - 代码生成 高灵活度一键生成前后端代码，减少百分之80左右的工作任务
    - 接口文档 使用的是 swagger-ui 
    - 邮件工具 配合富文本，发送html格式的邮件
    - SM.MS免费图床 挺好用的一个图床，作为公共图片上传使用
    - 七牛云存储 这个就不多说了
    - 支付宝支付 提供了测试账号，可自行测试
- 组件管理
    - 图标库 系统图标来自 https://www.iconfont.cn/
    - 富文本 集成wangEditor富文本
    - Markdown编辑器与Yaml编辑器
```
##### 项目结构
```
# 项目模块如下
- eladmin-common 公共模块
    - aop.limit 接口限流自定义注解
    - exception 项目统一异常的处理
    - mapper mapstruct的通用mapper
    - redis redis缓存相关配置
    - swagger2 接口文档配置
    - utils 通用工具
- eladmin-system 系统核心模块
	- config 配置跨域与静态资源
	- modules 系统相关模块
		- monitor 系统监控
		    - config 配置日志拦截器与WebSocket等
		    - domain 实体类
		    - repository 数据库操作
		    - rest 前端控制器
		    - service 业务接口
		        - impl 业务接口实现
		        - query 业务查询
        - quartz 定时任务
        - security 系统安全
	        - config  JWT的安全过滤器配置
		    - rest 用户登录授权的接口
		    - security 配置spring security
		    - service 用户登录与权限的处理
		    - utils JWT工具
    	- system 系统管理
- eladmin-logging 系统日志模块
- eladmin-tools 系统第三方工具模块
- eladmin-generator 系统代码生成模块
```
##### 系统环境
######  后端开发环境
*   JDK：8
*   Redis 3.0+
*   Maven 3.5.3
*   MYSQL 5.5.59
*   开发工具：IntelliJ IDEA （**需安装lombok插件**）

######  前端开发环境
*  Node.js v10.14.2
*  开发工具：JetBrains WebStorm

#### 开发准备
> Note
> 
> 在使用该系统前，你还需要做如下准备
##### 安装redis
redis的安装可参考：[http://www.runoob.com/redis/redis-install.html](http://www.runoob.com/redis/redis-install.html)
##### 给idea安装lombok插件
lombok的安装以及为什么使用它，可以查看：[https://www.jianshu.com/p/f26d177b88be](https://www.jianshu.com/p/f26d177b88be)
##### 了解MapStruct
项目中使用到了MapStruct自动映射DTO，如果你不熟悉，可以查看：[https://www.jianshu.com/p/3f20ca1a93b0](https://www.jianshu.com/p/3f20ca1a93b0)
##### 安装node.js
前端需依赖node.js，对于没有node.js环境的，可以参考：[http://www.runoob.com/nodejs/nodejs-install-setup.html](http://www.runoob.com/nodejs/nodejs-install-setup.html)
##### 设置npm镜像加速
````
npm config set registry https://registry.npm.taobao.org
npm config set disturl https://npm.taobao.org/dist --global
配置后可通过下面方式来验证是否成功
npm config get registry
```

### 本地与Ngnix部署
> 因为本项目是前后端分离的，所以需要前后端都部署好，才能进行访问
> 
> 前端页面访问地址：```localhost:8013```<br>
> 
> 后端 swagger 需带token进行测试，文档地址：```localhost:8000/swagger-ui.html``` 
#### 前端项目部署
部署前请先检查系统是否有 ```node.js``` 环境，如果没有需安装 ```node8.x``` 最新版，再进行部署
######  开发环境
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

![](https://i.loli.net/2019/03/28/5c9c954eabb09.jpg)

**解决办法**  [设置镜像加速](http://localhost:3000/#/kfzb?id=%E8%AE%BE%E7%BD%AEnpm%E9%95%9C%E5%83%8F%E5%8A%A0%E9%80%9F)
######  生产环境
需打包并把 ```dist``` 目录文件，部署到 ```Nginx``` 里，需将 ```prod.env.js``` 里面的 ```bash_api``` 改成自己生产环境的后端接口地址
![](https://i.loli.net/2019/03/28/5c9c95649eb69.png)
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
#### 后端项目部署
###### 开发环境
开发工具如果是 ```idea``` 的话，直接导入项目，安装完依赖后，进入 ```eladmin-system模块```按下图操作即可

![](https://i.loli.net/2019/03/28/5c9c95866dc63.png)

**注意** 如果你在启动过程中出现类似这种错误，你需要去了解 ```MapStruct``` 的工作原理，目录 2.3 有提及

![](https://i.loli.net/2019/03/28/5c9c959b734b0.png)

解决办法，输入 ```mvn compile``` 生成 ```Mapper``` 的实现即可
	
![](https://i.loli.net/2019/03/28/5c9c95afc4626.png)

###### 生产环境
生产环境需将打包成 ```jar``` ，上传到服务器后，通过 ```Linux``` 的 ```nohup``` 命令使```java```程序后台运行。再使用```ngnix```代理```java```服务，当然也可以使用```docker```部署，这里演示第一种
###### （1）打包项目

|   第一步  |   第二步  |
|--- | --- |
|  ![](https://i.loli.net/2019/03/28/5c9c95c835dd0.png)   |  ![](https://i.loli.net/2019/03/28/5c9c95dd8246c.png)   |

###### （2）修改配置文件
按需修改我们的 ```application-prod.yml``` ，如：<br>
1、修改数据库连接地址和密码<br>
2、自定义 token有效期<br>
3、是否允许生产环境使用代码生成器（默认禁用）<br>
![](https://i.loli.net/2019/03/28/5c9c932fdd165.png)
###### （3）编写脚本操作java服务
**启动脚本** ```start.sh ```
``` sh
nohup java -jar eladmin-system-1.5.jar --spring.profiles.active=prod &
```
**停止脚本** ```stop.sh ```
``` sh
PID=$(ps -ef | grep eladmin-system-1.5.jar | grep -v grep | awk '{ print $2 }')
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

![](https://i.loli.net/2019/03/28/5c9c935acaee2.png)
###### （4）操作java服务
脚本创建完成后就可以直接操作```java```服务了，具体命令如下
```
# 启动java
./start.sh
# 停止java服务
./stop.sh
# 查看日志
./log.sh
```
###### （5）使用ngnix代理java服务
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
#### ngnix配置文件
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