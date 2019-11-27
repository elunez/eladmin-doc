# 快速上手
使用该项目前，你需要检查你本地的开发环境，避免出现问题
## 所需环境
```
1、JDK：1.8+
2、Redis 3.0+
3、Maven 3.0+
4、MYSQL 5.5.0+
5、Node v10+
```

::: tip
前端安装完 node 后，最好设置下淘宝的镜像源，不建议使用 cnpm（可能会出现奇怪的问题）
:::

```
npm config set registry https://registry.npm.taobao.org
配置后可通过下面方式来验证是否成功
npm config get registry
```
## 开发准备
::: tip
在使用该系统前，你还需要做如下准备
:::
1. 安装并启动 redis：[redis安装教程](http://www.runoob.com/redis/redis-install.html)

2. 给 idea 或者 eclipse 安装 lombok 插件，我们用它可以省略get，set 方法，可以使代码更简洁，具体查看 [lombok教程](https://www.ydyno.com/archives/1147.html)

3. 了解MapStruct，项目用到了他映射实体，如果你不熟悉可以查看：[熟悉MapStruct](https://www.jianshu.com/p/3f20ca1a93b0)

## 运行项目
::: tip
因为本项目是前后端分离的，所以需要前后端都启动好，才能进行访问
:::

### 后端运行
1、克隆项目：
```
git clone https://gitee.com/elunez/eladmin.git
```

2、导入数据：打开数据库，创建一个新库 `eladmin`，导入sql文件夹中的初始化脚本

3、导入项目：开发工具如果是 idea 的话，直接打开项目，安装依赖后，进入 `eladmin-system`模块 按下图操作即可

![](https://i.loli.net/2019/03/28/5c9c95866dc63.png)

### 前端运行
1、克隆项目：
```
https://gitee.com/elunez/eladmin-web.git
``` 

2、安装依赖：打开项目后输入命令安装依赖
```
npm install
```

3、 运行项目：
```
npm run dev
```
启动完后打开 [localhost:8013](localhost:8013) 即可

### 常见问题
*1、依赖安装失败*

可通过配置淘宝的镜像源解决
```
npm config set registry https://registry.npm.taobao.org
# 配置后可通过下面方式来验证是否成功
npm config
```
*2、linux 系统在安装依赖的时候会出现 node-sass 无法安装的问题*

解决方案：
```
1. 单独安装：npm install --unsafe-perm node-sass 
2. 直接使用：npm install --unsafe-perm
```
