---
comment: false 
---

# 快速开始
使用该项目前，你需要检查你本地的开发环境，避免出现问题
## 所需环境
这里列出项目所需的环境与相关安装教程，方便刚入门的同学
```
1、JDK：1.8+ 
安装教程：https://www.runoob.com/java/java-environment-setup.html
2、Redis 3.0+
安装教程：https://www.runoob.com/redis/redis-install.html
3、Maven 3.0+
安装教程：https://www.runoob.com/maven/maven-setup.html
4、MYSQL 5.5.0+
安装教程：https://www.runoob.com/mysql/mysql-install.html
5、Node v10+
安装教程：https://www.runoob.com/nodejs/nodejs-install-setup.html
```

::: tip
前端安装完 node 后，最好设置下淘宝的镜像源，不建议使用 cnpm（可能会出现奇怪的问题）
:::

```
npm config set registry https://registry.npm.taobao.org
配置后可通过下面方式来验证是否成功
npm config get registry

在 ~/.npmrc 加入下面内容，可以避免安装 node-sass 失败
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/

.npmrc 文件位于
win：C:\Users\[你的账户名称]\.npmrc
linux：直接使用 vi ~/.npmrc
```
## 开发准备
::: tip
在使用该系统前，你还需要做如下准备
:::

1、给 [idea](https://blog.csdn.net/wochunyang/article/details/81736354) 或者 [eclipse](https://blog.csdn.net/magi1201/article/details/85995987) 安装 lombok 插件，我们用它可以省略get，set 方法，可以使代码更简洁，
具体查看 [lombok教程](https://www.ydyno.com/archives/1147.html)

2、了解MapStruct，项目用到了他映射实体，如果你不熟悉可以查看：[熟悉MapStruct](https://www.jianshu.com/p/3f20ca1a93b0)

3、你需要有 Spring boot 的基础，推荐教程 [Spring Boot 2.0 学习](https://github.com/ityouknow/spring-boot-examples)

4、你还需要有 [Vue](https://cn.vuejs.org/v2/guide/) 的基础，推荐入门视屏教程 [网易云课堂](https://study.163.com/course/courseMain.htm?courseId=1004711010)

## 运行项目
::: tip
因为本项目是前后端分离的，所以需要前后端都启动好，才能进行访问
:::

### 后端运行[Idea]

打开Idea，直接导入Git项目

![](https://img.el-admin.vip/images/2020/06/25/20200609184434.png)

输入我们的 Git 地址

```
https://gitee.com/elunez/eladmin.git
```

![](https://img.el-admin.vip/images/2020/06/25/20200609184548.png)

打开数据库，创建一个新库 `eladmin`，导入sql文件夹中的初始化脚本库脚本 `eladmin.sql`

![](https://img.el-admin.vip/images/2020/06/25/20200609184722.png)

修改配置，如果你的数据库密码不是 123456，那么需要在 dev.yml 配置文件中做相应的修改

![](https://img.el-admin.vip/images/2020/06/25/20200609185014.png)

运行项目：找到 eladmin-system 模块中的 AppRun，点击启动按钮启动程序

![](https://img.el-admin.vip/images/2020/06/25/20200605112835.png)

### 后端运行[Eclipse]

首先克隆项目到本地，Mac 使用终端、Windows 使用 Cmd，定位到工作的目录

```
git clone https://gitee.com/elunez/eladmin.git
```

![](https://img.el-admin.vip/images/2020/06/25/20200609185424.png)

打开Eclipse，工作空间设置为该目录

![](https://img.el-admin.vip/images/2020/06/25/20200609185609.png)

导入我们的的项目 File -> Import

![](https://img.el-admin.vip/images/2020/06/25/20200609185730.png)

选择 Maven ，然后 Next

![](https://img.el-admin.vip/images/2020/06/25/20200609185818.png)

选择项目的目录，然后 Finish

![](https://img.el-admin.vip/images/2020/06/25/20200609185940.png)

如果项目一片红色，那么需要你给 Eclipse [安装 Lombok 插件](https://www.baidu.com/s?ie=utf-8&wd=eclipse%E5%AE%89%E8%A3%85lombok%E6%8F%92%E4%BB%B6)，正常的导入后如下

![](https://img.el-admin.vip/images/2020/06/25/20200609190325.png)

解决 Lombok 的问题后，进入 eladmin-system 模块中的 AppRun，点击启动按钮启动程序

![](https://img.el-admin.vip/images/2020/06/25/20200609190602.png)

这时会有一个新的问题，那就是 mapstruct 的实现类不会自动生成，报错如下

![](https://img.el-admin.vip/images/2020/06/25/20200609190817.png)

解决办法就是给 Eclipse 装上 m2e-apt 插件，[官方介绍](https://mapstruct.org/documentation/ide-support/)

点击 help --> install new software --> add，在location里面输入地址：

```
http://download.eclipse.org/technology/m2e/releases
```

![](https://img.el-admin.vip/images/2020/06/25/20200609191851.png)

然后在项目根目录的 pom.xml 中的 &lt;properties&gt; 节点中加入，然后保存

```
<m2e.apt.activation>jdt_apt</m2e.apt.activation>
```

![](https://img.el-admin.vip/images/2020/06/25/20200609192055.png)

导入数据库，修改数据库配置，这个步骤参考上面 Idea 教程的步骤

![](https://img.el-admin.vip/images/2020/06/25/20200609192230.png)

点击启动按钮旁边的小按钮，然后选择 `Maven Install` 生成 mapstruct 的实现类

![](https://img.el-admin.vip/images/2020/06/25/20200609192922.png)

查看 target -> generated-sources 目录是否生成了 mapstruct 的实现类

![](https://img.el-admin.vip/images/2020/06/25/20200609193210.png)

这个时候启动项目，就不会报错了，至此教程结束

![](https://img.el-admin.vip/images/2020/06/25/20200609193456.png)

Eclipse 初次使用，因此此教程仅供参考，如果有更好的方案，可以编辑此页面，提个 Pr ！

### 后端开发方案

本系统框架开发的主要目的是让开发者专注于业务，降低技术难度，从而节省人力成本，缩短项目周期，提高软件安全质量。

在克隆好本系统后，小伙伴们要开始继续业务开发了，目前比较被大家所认可的基于本系统框架的开发模式：

1. 基本不改动项目结构，直接在`eladmin-system`模块中，参照现有功能继续开发自己的业务

   ```
   其他模块略
   - eladmin-system 系统核心模块（系统启动入口）
   	- config 配置跨域与静态资源，与数据权限
   	    - thread 线程池相关
   	- modules 系统相关模块(登录授权、系统监控、定时任务、运维管理等)
   		- mnt
   		- quartz
   		- security
   		- system
   		- 你自己的业务模块	
   ```

2. `eladmin`原有模块不动，在此父工程的基础上继续添加新的子模块，开发自己的业务

   ```
   - eladmin-common 公共模块
   - eladmin-system 系统核心模块（系统启动入口）
   - eladmin-logging 系统日志模块
   - eladmin-tools 系统第三方工具模块
   - eladmin-generator 系统代码生成模块
   - 你的项目名-模块名 你自己的业务模块，参照system/logging/generator的开发模式
   ```

3. 完全改动`eladmin`的项目名、模块名、甚至是包名，然后继续添加子模块，开发自己的业务

   ```
   - 你的项目名-common 公共模块
   - 你的项目名-system 系统核心模块（系统启动入口）
   - 你的项目名-logging 系统日志模块
   - 你的项目名-tools 系统第三方工具模块
   - 你的项目名-generator 系统代码生成模块
   - 你的项目名-模块名 你自己的业务模块，参照system/logging/generator的开发模式
   ```

其中第2种和第3种开发模式，大概率会面临2个问题：

1. 依然使用`eladmin-system`作为启动和打包项目吗？

   大多数使用者都会将启动和打包项目替换为自己的业务模块

   ```
   - eladmin-common 公共模块
   - eladmin-system 系统核心模块（系统启动入口）
   - eladmin-logging 系统日志模块
   - eladmin-tools 系统第三方工具模块
   - eladmin-generator 系统代码生成模块
   - 你的项目名-模块名 你自己的业务模块，参照system/logging/generator的开发模式
   - 你的项目名-模块名 用于作为启动和打包项目
   	将system模块的AppRun和配置文件迁移过来，并且将system模块的pom.xml中的打包插件也迁移过去
   ```

   这种方式设置好后，你就可以随意将现有系统模块和你自己的业务模块相互依赖，而无需担心Maven循环依赖的产生。

2. 残留了部分`eladmin`原有包名后，SpringBoot如何扫描不同名包下的组件？

   SpringBoot的核心注解`@SpringBootApplication`是默认扫描当前包和子包的，如果未来你存在需要扫描不同包名的情况，那就需要你在启动类`AppRun`中添加如下三个注解了，单独添加一个`@ComponentScan`会被SpringBoot默认的扫描覆盖掉。

   ```java
   @ApiIgnore
   @EnableAsync
   @RestController
   @SpringBootApplication
   // 组件扫描
   @ComponentScan(basePackages={"me.zhengjie", "你自己要扫描的包名"})
   // jpa扫描
   @EnableJpaRepositories(basePackages={"me.zhengjie"})
   // 实体扫描
   @EntityScan(basePackages={"me.zhengjie"})
   @EnableTransactionManagement
   @EnableJpaAuditing(auditorAwareRef = "auditorAware")
   public class AppRun {}
   ```

以上就是现存使用较多的开发方案，诸君自行品鉴，欢迎完善。


### 前端运行[WebStorm]

首先克隆项目到本地，Mac 使用终端、Windows 使用 Cmd，定位到工作的目录

```
git clone https://gitee.com/elunez/eladmin-web.git
```

![](https://img.el-admin.vip/images/2020/06/25/20200609194318.png)

打开 WebStorm，导入我们的项目

![](https://img.el-admin.vip/images/2020/06/25/20200609194432.png)

这个时候 WebStorm 会在右下角提示我们安装依赖

![](https://img.el-admin.vip/images/2020/06/25/20200609194535.png)

也可以手动在 Terminal 中输入 `npm install` 进行安装

![](https://img.el-admin.vip/images/2020/06/25/20200609194723.png)

依赖安装完成后，打开 package.json 找到 dev 旁边的启动按钮

![](https://img.el-admin.vip/images/2020/06/25/20200609194958.png)

启动完后打开 [localhost:8013](localhost:8013) 即可

### 前端运行常见问题
*1、依赖安装失败*

可通过配置淘宝的镜像源解决
```
npm config set registry https://registry.npm.taobao.org
配置后可通过下面方式来验证是否成功
npm config get registry

在 ~/.npmrc 加入下面内容，可以避免安装 node-sass 失败
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/

.npmrc 文件位于
win：C:\Users\[你的账户名称]\.npmrc
linux：直接使用 vi ~/.npmrc
```
*2、linux 系统在安装依赖的时候会出现 node-sass 无法安装的问题*

解决方案：
```
1. 单独安装：npm install --unsafe-perm node-sass 
2. 直接使用：npm install --unsafe-perm
```
