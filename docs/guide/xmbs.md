# 部署项目
本项目可以使用 `tomcat` 或者 `nginx` 部署，在这里分享下常规部署 `[Nginx]` 与使用Docker部署的两种方式
## SSH工具推荐
先分享个好用的 SSH 工具 [FinalShell](http://www.hostbuf.com/t/988.html)，后面部署会使用到 

## 常规部署方式
### 后端部署

#### 修改配置

按需修改我们的 ```application-prod.yml```，如需打开 Swagger ，那么需要将 `enabled` 设置为 true
```yaml
swagger:
  enabled: true
```
#### 打包项目

我们需要将项目打包好的 Jar 文件上传到服务器，步骤图如下：

![image.png](https://img.el-admin.vip/images/2020/09/17/image.png)

![image578bed89803bdfa9.png](https://img.el-admin.vip/images/2020/09/17/image578bed89803bdfa9.png)

#### 编写脚本

编写脚步用于操作 ```java``` 服务

(1) **启动脚本** ```start.sh ```<br>
```
nohup java -jar eladmin-system-2.6.jar --spring.profiles.active=prod > nohup.out 2>&1 &
```
(2) **停止脚本** ```stop.sh ``` <br>
```
PID=$(ps -ef | grep eladmin-system-2.6.jar | grep -v grep | awk '{ print $2 }')
if [ -z "$PID" ]
then
echo Application is already stopped
else
echo kill -9 $PID
kill -9 $PID
fi
```
(3) **查看日志脚本** ```log.sh```
```
tail -f nohup.out
```
脚本创建完成后就可以操作 ```java``` 服务了
```
# 启动java
./start.sh
# 停止java服务
./stop.sh
# 查看日志
./log.sh
```
#### 配置 nginx

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
### 前端部署
这里提供两个配置方式 [History、Hash] 的部署方式，首先修改接口地址，如果是 IP 地址，那么需要修改为外网 IP

![](https://img.el-admin.vip/images/2020/06/25/20200605162316.png)

#### History 模式

项目默认是 History 模式，不需要做任何修改

![image4285f15c9c2dfa96.png](https://img.el-admin.vip/images/2020/09/17/image4285f15c9c2dfa96.png)

#### Hash 模式

##### 1、修改 routers.js，取消 hash 的注释

![image92197994858c5edd.png](https://img.el-admin.vip/images/2020/09/17/image92197994858c5edd.png)

##### 2、修改根目录 vue.config.js 配置，取消 15 行的注释

![imagee7ae12491c445923.png](https://img.el-admin.vip/images/2020/09/17/imagee7ae12491c445923.png)

#### 打包项目
不管是将项目部署到 ```nginx``` 还是其他服务器，都需要先将项目打包
```
npm run build:prod
```
打包完成后会在根目录生成 ```dist``` 文件夹，我们需要将他上传到服务器中

#### Nginx 配置
在 ```nginx/conf/nginx.conf```  添加配置
##### History 模式配置
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
##### Hash 模式配置
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
#### 二级目录部署

##### Nginx 配置
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
![image](https://img.el-admin.vip/images/2020/06/25/CIyQda.png)

注意目录名称要与配置名称一致

![image](https://img.el-admin.vip/images/2020/06/25/PP6D6b.png)

### 重启Nginx
```
systemctl restart nginx
```
重启 ```nginx``` 后，访问你的域名或者IP地址即可

## 容器部署方式
对于熟悉 Docker 的开发者来说，使用 Docker 部署管理更加的简单高效

我一般习惯将 home 目录作为工作目录，因此 Docker 挂载的文件也都会存放在 home 目录中

### 安装Docker
```
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun && systemctl start docker && systemctl enable docker
```
如果你机器是国内的机器，那么需要配置镜像加速，一般使用阿里云镜像加速 [阿里云加速官网](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)

![imageb817a495226b07de.png](https://img.el-admin.vip/images/2020/09/17/imageb817a495226b07de.png)

### 安装Mysql与Redis

这里使用的是 mariadb 镜像，并且将 mariadb 数据库文件挂载到宿主机的 `/home/mysql/` 目录下
```
docker run -v /home/mysql/:/var/lib/mysql \
-p 3306:3306 -e MYSQL_ROOT_PASSWORD=dqjdda1996 \
--privileged=true --restart=always --name mariadb -d mariadb
```
安装Redis
```
docker run -itd --name redis --restart=always -p 6379:6379 redis
```

### 构建与启动Java容器

#### 构建镜像

:::tip
Docker 部署使用到了环境变量参数，对于非 `V2.6` 版本的，需要修改 application.yml、application-prod.yml 等配置

[具体参考](https://gitee.com/elunez/eladmin/pulls/17/files)
:::

修改完成后，打包项目将打包好地Jar上传到服务器的 `/home/eladmin` 目录，在该目录创建 Dockerfile 文件，并编写 Dockerfile

```
FROM java:8
ARG JAR_FILE=./*.jar
COPY ${JAR_FILE} app.jar
ENV TZ=Asia/Shanghai
ENTRYPOINT ["java","-jar","/app.jar"]
```
构建镜像
```
docker build -t eladmin .
```
#### 启动Java容器
将容器中的 `/home/eladmin/` 挂载到宿主机的 `/home/data/` 目录并且设置数据库地址与密码等环境变量参数

```
docker run -d \
--name eladmin --restart always \
-p 8000:8000 \
-e "TZ=Asia/Shanghai" \
-e DB_HOST=172.17.0.1 \
-e DB_PWD=mysql_pwd \
-e REDIS_HOST=172.17.0.1 \
-v /home/data/:/home/eladmin/ \
eladmin
```

### 安装与配置Nginx容器

#### 安装Nginx
::: tip
- /home/nginx/conf.d 用于存放配置文件
- /home/nginx/cert 用于存放 https 证书
- /home/nginx/html 用于存放网页文件
- /home/nginx/logs 用于存放日志
:::
```
docker run -d \
--name nginx --restart always \
-p 80:80 -p 443:443 \
-e "TZ=Asia/Shanghai" \
-v /home/nginx/nginx.conf:/etc/nginx/nginx.conf \
-v /home/nginx/conf.d:/etc/nginx/conf.d \
-v /home/nginx/logs:/var/log/nginx \
-v /home/nginx/cert:/etc/nginx/cert \
-v /home/nginx/html:/usr/share/nginx/html \
nginx:alpine
```

#### 配置Nginx

这里使用 Nginx 反向代理访问后端服务，由于容器内部通信，因此需要使用容器的 IP，也就是 172.17.0.1

在 `/home/nginx/conf.d` 创建一个 eladmin.conf 的配置文件，文件内容如下

```
server
    {
        listen 80;
        server_name 域名/外网IP;
        index index.html;
        root  /usr/share/nginx/html/eladmin/dist;  #dist上传的路径

        # 避免访问出现 404 错误
        location / {
          try_files $uri $uri/ @router;
          index  index.html;
        }

        location @router {
          rewrite ^.*$ /index.html last;
        }

        # 授权
        location /api {
          proxy_pass http://172.17.0.1:8000;
          proxy_set_header X-Forwarded-Proto $scheme;
          proxy_set_header X-Forwarded-Port $server_port;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "upgrade";
        }

        # 授权
        location /auth {
          proxy_pass http://172.17.0.1:8000;
          proxy_set_header X-Forwarded-Proto $scheme;
          proxy_set_header X-Forwarded-Port $server_port;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "upgrade";
        }

        # 头像
        location /avatar {
          proxy_pass http://172.17.0.1:8000;
        }

        # 文件
        location /file {
          proxy_pass http://172.17.0.1:8000;
        }
    }
```
注意：容器中 `/usr/share/nginx/html/eladmin/dist` 对应宿主机的 `/home/nginx/html/eladmin/dist` 目录，因此文件上传到宿主机的目录即可

### 打包上传前端代码【重要】
由于Nginx使用的是反向代理后端接口，因此 非 V2.6 版本需要做如下修改

1、将 `.env.production` 中的接口地址改为 `'/'`

![imageb0806c848d01318e.png](https://img.el-admin.vip/images/2020/09/17/imageb0806c848d01318e.png)

2、修改 `api.js` 中的 `baseUrl = process.env.VUE_APP_BASE_API === '/' ? '' : process.env.VUE_APP_BASE_API`

![imagedcd151a815c62932.png](https://img.el-admin.vip/images/2020/09/17/imagedcd151a815c62932.png)

3、打包项目并且上传到 `/home/nginx/html/eladmin` 目录下

4、重启 Nginx 容器 `docker restart nginx` 
