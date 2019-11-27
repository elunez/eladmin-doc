# 部署项目
本项目可以使用 `tomcat` 或者 `ngnix` 部署，在这里分享下 使用 `nginx` 部署前后端的步骤

## 后端部署

### 1、修改配置文件

按需修改我们的 ```application-prod.yml```
```yml
配置数据源
spring:
  datasource:
    druid:
      type: com.alibaba.druid.pool.DruidDataSource
      driverClassName: net.sf.log4jdbc.sql.jdbcapi.DriverSpy
      # 数据库配置
      url: jdbc:log4jdbc:mysql://localhost:3306/eladmin?serverTimezone=Asia/Shanghai&characterEncoding=utf8&useSSL=false
      username: root
      password: 123456

      # 初始化配置
      initial-size: 3
      # 最小连接数
      min-idle: 3
      # 最大连接数
      max-active: 15
      # 获取连接超时时间
      max-wait: 5000
      # 连接有效性检测时间
      time-between-eviction-runs-millis: 90000
      # 最大空闲时间
      min-evictable-idle-time-millis: 1800000
      test-while-idle: true
      test-on-borrow: false
      test-on-return: false
      validation-query: select 1
      # 配置监控统计拦截的filters
      filters: stat

      stat-view-servlet:
        url-pattern: /druid/*
        reset-enable: false
        login-username: admin
        login-password: 123456

      web-stat-filter:
        url-pattern: /*
        exclusions: "*.js,*.gif,*.jpg,*.bmp,*.png,*.css,*.ico,/druid/*"

  #配置 Jpa
  jpa:
    hibernate:
      # 生产环境设置成 none，避免程序运行时自动更新数据库结构
      ddl-auto: none

#jwt
jwt:
  header: Authorization
  secret: mySecret
  # token 过期时间 2个小时
  expiration: 7200000
  # 在线用户key
  online: online-token
  # 验证码
  codeKey: code-key

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
  path: /home/eladmin/file/
  avatar: /home/eladmin/avatar/
  # 文件大小 /M
  maxSize: 100
  avatarMaxSize: 5
```
### 2、打包项目

我们需要将项目打包并且上传到服务器

|   第一步  |   第二步  |
|--- | --- |
|  ![](https://i.loli.net/2019/03/28/5c9c95c835dd0.png)   |  ![](https://i.loli.net/2019/05/27/5ceb944760b4d75134.png)   |

### 3、编写脚本

编写脚步操作 ```java``` 服务

(1) **启动脚本** ```start.sh ```<br>
```
nohup java -jar eladmin-system-2.0.jar --spring.profiles.active=prod &
```
(2) **停止脚本** ```stop.sh ``` <br>
```
PID=$(ps -ef | grep eladmin-system-2.0.jar | grep -v grep | awk '{ print $2 }')
if [ -z "$PID" ]
then
echo Application is already stopped
else
echo kill $PID
kill $PID
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

![](https://i.loli.net/2019/05/27/5ceb96766a44494697.png)

4、操作java服务：脚本创建完成后就可以操作 ```java``` 服务了
```
# 启动java
./start.sh
# 停止java服务
./stop.sh
# 查看日志
./log.sh
```
### 4、配置 ```ngnix```

我们可以使用 ```ngnix``` 代理 ```java```服务，添加配置
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
### 1、修改接口地址
将 ```config/prod.env.js``` 里面的 ```bash_api``` 改成自己生产环境的后端接口地址（域名或IP）
::: tip
注意：``` 如果是IP需设置外网IP```
:::
### 2、打包项目
不管是将项目部署到 ```ngnix``` 还是其他服务器，都需要先将项目打包
 ```
 npm run build
```
### 3、上传文件
打包完成后会在根目录生成 ```dist``` 文件夹，我们需要将他上传到服务器中，可使用工具 

[BvSshClient](https://www.lanzous.com/i3fbbgb)

### 4、配置 ```ngnix```
在 ```nginx/conf/nginx.conf```  添加配置
``` 
server
    {
        listen 80;
        server_name 域名/外网IP;
        index index.html index.htm;
        root  /www/server/dist;  #dist上传的路径
        error_page 404 /index.html; #这个配置，预防页面刷新后跳转到404页面
    } 
```
重启启动 ```nginx``` 后，访问域名或者IP地址即可
