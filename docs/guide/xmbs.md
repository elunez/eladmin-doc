---
comment: false 
---

# 部署项目
本项目可以使用 `tomcat` 或者 `nginx` 部署，在这里分享下 使用 `nginx` 部署前后端的步骤
## SSH 工具
先分享个好用的ssh工具[Windows、MacOS]，后面部署会使用到

[FinalShell](http://www.hostbuf.com/t/988.html)

## 后端部署

### 修改配置

按需修改我们的 ```application-prod.yml```
```yaml
#配置数据源
spring:
  datasource:
    druid:
      db-type: com.alibaba.druid.pool.DruidDataSource
      driverClassName: net.sf.log4jdbc.sql.jdbcapi.DriverSpy
      url: jdbc:log4jdbc:mysql://localhost:3306/eladmin?serverTimezone=Asia/Shanghai&characterEncoding=utf8&useSSL=false
      username: root
      password: 123456
      # 初始连接数
      initial-size: 5
      # 最小连接数
      min-idle: 10
      # 最大连接数
      max-active: 20
      # 获取连接超时时间
      max-wait: 5000
      # 连接有效性检测时间
      time-between-eviction-runs-millis: 60000
      # 连接在池中最小生存的时间
      min-evictable-idle-time-millis: 300000
      # 连接在池中最大生存的时间
      max-evictable-idle-time-millis: 900000
      test-while-idle: true
      test-on-borrow: false
      test-on-return: false
      # 检测连接是否有效
      validation-query: select 1
      # 配置监控统计
      webStatFilter:
        enabled: true
      stat-view-servlet:
        enabled: true
        url-pattern: /druid/*
        reset-enable: false
        login-username: admin
        login-password: 123456
      filter:
        stat:
          enabled: true
          # 记录慢SQL
          log-slow-sql: true
          slow-sql-millis: 1000
          merge-sql: true
        wall:
          config:
            multi-statement-allow: true

# 是否限制单用户登录
single:
  login: false

#jwt
jwt:
  header: Authorization
  # 令牌前缀
  token-start-with: Bearer
  # 必须使用最少88位的Base64对该令牌进行编码
  base64-secret: ZmQ0ZGI5NjQ0MDQwY2I4MjMxY2Y3ZmI3MjdhN2ZmMjNhODViOTg1ZGE0NTBjMGM4NDA5NzYxMjdjOWMwYWRmZTBlZjlhNGY3ZTg4Y2U3YTE1ODVkZDU5Y2Y3OGYwZWE1NzUzNWQ2YjFjZDc0NGMxZWU2MmQ3MjY1NzJmNTE0MzI=
  # 令牌过期时间 此处单位/毫秒 ，默认2小时，可在此网站生成 https://www.convertworld.com/zh-hans/time/milliseconds.html
  token-validity-in-seconds: 7200000
  # 在线用户key
  online-key: online-token-
  # 验证码
  code-key: code-key-
  # token 续期检查时间范围（默认30分钟，单位默认毫秒），在token即将过期的一段时间内用户操作了，则给用户的token续期
  detect: 1800000
  # 续期时间范围，默认 1小时，这里单位毫秒
  renew: 3600000

#是否允许生成代码，生产环境设置为false
generator:
  enabled: false

#如果生产环境要开启swagger，需要配置请求地址
#springfox:
#  documentation:
#    swagger:
#      v2:
#        host: # 接口域名或外网ip

#是否开启 swagger-ui
swagger:
  enabled: false

# 文件存储路径
file:
  mac:
    path: ~/file/
    avatar: ~/avatar/
  linux:
    path: /home/eladmin/file/
    avatar: /home/eladmin/avatar/
  windows:
    path: C:\eladmin\file\
    avatar: C:\eladmin\avatar\
  # 文件大小 /M
  maxSize: 100
  avatarMaxSize: 5
```
### 打包项目

我们需要将项目打包并且上传到服务器

**打包项目：**

![](https://img.el-admin.xin/20200605161715.png)

**上传到服务器**

![](https://img.el-admin.xin/20200605161831.png)

### 编写脚本

编写脚步操作 ```java``` 服务

(1) **启动脚本** ```start.sh ```<br>
```
nohup java -jar eladmin-system-2.4.jar --spring.profiles.active=prod &
```
(2) **停止脚本** ```stop.sh ``` <br>
```
PID=$(ps -ef | grep eladmin-system-2.4.jar | grep -v grep | awk '{ print $2 }')
if [ -z "$PID" ]
then
echo Application is already stopped
else
echo kill -9 $PID
kill -9 $PID
fi
```
(3) **新建空白Log文件，保存日志** ```nohup.out```
```
touch nohup.out
```
(4) **查看日志** ```log.sh```
```
tail -f nohup.out
```
(5) **完整目录如下图**

![QQ截图20191224120620.png](https://i.loli.net/2019/12/24/KEzoIi8veR3WcQh.png)

4、操作java服务：脚本创建完成后就可以操作 ```java``` 服务了
```
# 启动java
./start.sh
# 停止java服务
./stop.sh
# 查看日志
./log.sh
```
### 配置 nginx

我们可以使用 ```nginx``` 代理 ```java```服务，添加配置
```
server {
    listen 80;
    server_name 域名/当前服务器外网IP;
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
## 前端部署
这里提供两个配置方式[History、Hash]，首先修改接口地址

::: tip
注意：``` 如果是IP需设置外网IP```
:::

![](https://img.el-admin.xin/20200605162316.png)

### History 模式
项目默认是 History 模式，所以直接打包即可
#### 1、打包项目
不管是将项目部署到 ```nginx``` 还是其他服务器，都需要先将项目打包
```
npm run build:prod
```
#### 2、上传文件
打包完成后会在根目录生成 ```dist``` 文件夹，我们需要将他上传到服务器中

#### 3、Nginx 配置
在 ```nginx/conf/nginx.conf```  添加配置
``` 
server
    {
        listen 80;
        server_name 域名/外网IP;
        index index.html;
        root  /home/wwwroot/eladmin/dist;  #dist上传的路径
        # 避免访问出现 404 错误
        location / {
          try_files $uri $uri/ @router;
          index  index.html;
        }
        location @router {
          rewrite ^.*$ /index.html last;
        }  
    } 
```

### Hash 模式

#### 1、修改 routers.js，取消 hash 的注释

![](https://img.el-admin.xin/20200605163500.png)

#### 2、修改根目录 vue.config.js 配置

![](https://img.el-admin.xin/20200605163611.png)

#### Nginx 配置
打包上传方式与 History 模式一致
```
server {
	   listen       80;
	   server_name  域名/外网IP;

	   location / {
	      root   /home/wwwroot/eladmin/dist; #dist上传的路径
	      index  index.html;
	   }
}
```
### 二级目录部署

#### Nginx 配置
```
server {
	   listen       80;
	   server_name  域名/外网IP;

	   location /dist {
	      root   /home/wwwroot/eladmin/test;
	      index  index.html;
	   }
}
```
文件目录
![image](https://img.el-admin.xin/CIyQda.png)

注意目录名称要与配置名称一致

![image](https://img.el-admin.xin/PP6D6b.png)


## 重启 Nginx
```
systemctl restart nginx
```
重启 ```nginx``` 后，访问你的域名或者IP地址即可
