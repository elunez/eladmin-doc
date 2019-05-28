#### 开发环境
* JDK：8+
* Redis 3.0+
* Maven 3.0+
* MYSQL 5.5.0+
* Node v10+

前端安装完node后，最好设置下淘宝的镜像源，不建议使用cnpm（可能会出现奇怪的问题）
``` npm
npm config set registry https://registry.npm.taobao.org
配置后可通过下面方式来验证是否成功
npm config get registry
```
#### 开发准备
在使用该系统前，你还需要做如下准备
- 安装并启动redis：[redis安装](http://www.runoob.com/redis/redis-install.html)
- 给idea或者eclipse安装lombok插件，我们用它可以省略get，set 方法，可以使代码更简洁，具体查看 [lombok入门](https://www.jianshu.com/p/ed3d5e868825)
- 了解MapStruct，项目用到了他映射实体，如果你不熟悉可以查看：[熟悉MapStruct](https://www.jianshu.com/p/3f20ca1a93b0)

#### 本地运行
> 因为本项目是前后端分离的，所以需要前后端都启动好，才能进行访问

##### 后端运行
1、克隆项目：``` git clone https://github.com/elunez/eladmin.git ``` <br>
2、导入数据：打开数据库，创建一个新库 [```eladmin```]，导入sql文件夹中的初始化脚本<br>
3、导入项目：开发工具如果是 ```idea``` 的话，直接打开项目，安装依赖后，进入 ```eladmin-system```模块 按下图操作即可
![](https://i.loli.net/2019/03/28/5c9c95866dc63.png)

##### 前端运行
1、克隆项目：``` https://github.com/elunez/eladmin-qd ``` <br>
2、安装依赖：打开项目后输入命令安装依赖 ```npm install```<br>
3、 运行项目：使用命令 ```npm run dev``` ，启动完后打开 [localhost:8013](localhost:8013)
#### 上线部署
我是通过 ```ngnix``` 部署的，在这里分享下前后端部署的步骤
##### 后端部署
1、修改配置：按需修改我们的 ```application-prod.yml```，如
- 修改数据库连接地址和密码
- 自定义 token有效期
- 是否允许使用代码生成器
- 是否允许访问swagger

2、打包项目：我们需要将项目打包并且上传到服务器

|   第一步  |   第二步  |
|--- | --- |
|  ![](https://i.loli.net/2019/03/28/5c9c95c835dd0.png)   |  ![](https://i.loli.net/2019/05/27/5ceb944760b4d75134.png)   |

3、编写脚本：编写脚步操作 ```java``` 服务

(1) **启动脚本** ```start.sh ```<br>
``` sh
nohup java -jar eladmin-system-2.0.jar --spring.profiles.active=prod &
```
(2) **停止脚本** ```stop.sh ``` <br>
``` sh
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
``` sh
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
5、配置 ```ngnix``` ：我们可以使用 ```ngnix``` 代理 ```java```服务
```
server {
    listen 80;
    server_name 域名/外网IP;
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
##### 前端部署
1、打包项目：不管是将项目部署到 ```ngnix``` 还是其他服务器，第一步都是将项目打包，使用命令 ```npm run build``` <br>
2、上传文件：打包完成后会在根目录生成 ```dist``` 文件夹，我们需要将他上传到服务器中，可使用工具 [BvSshClient](https://www.lanzous.com/i3fbbgb)<br>
3、修改接口地址：将 ```prod.env.js``` 里面的 ```bash_api``` 改成自己生产环境的后端接口地址，注意：``` 如果是IP需设置外网IP```<br>
4、配置 ```ngnix```：在 ```nginx/conf/nginx.conf```  修改配置（配置文件路径可能会不同）
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