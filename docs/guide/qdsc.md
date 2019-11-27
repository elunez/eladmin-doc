# 前端手册
## 菜单路由
通过用户的角色返回相应的菜单路由，前端关键代码： ```src/router/index.js```<br>
```js
# 部分代码
 store.dispatch('GetInfo').then(res => { // 拉取user_info
          // 动态路由，拉取菜单
          loadMenus(next, to)
        }).catch((err) => {
          console.log(err)
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
```

### 可配置项
```js
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
  breadcrumb: false // 如果设置为false，则不会在breadcrumb面包屑中显示,
  affix: true // 设置成true表示，tag-view不可删除
}
```
### 添加图标
如果你没有在本项目 Icon 中找到需要的图标，可以到 [iconfont.cn](iconfont.cn) 上选择并生成自己的业务图标库，再进行使用。或者其它 svg 图标网站，下载 svg 并放到 ```src/icons/svg``` 文件夹之中就可以了，下载方式如下图：

![](https://i.loli.net/2019/03/28/5c9c93ce6a575.gif)

使用方式：
```
<svg-icon icon-class="password" /> //icon-class 为 icon 的名字
```
### 添加菜单
也不是所有菜单都需要存入数据库，有些公共的菜单只需要在 ```src/router/routers.js``` 中添加就可以了，如：个人中心页面
```js
{
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: () => import('@/views/system/user/center'),
        name: '个人中心',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
```
### 动态菜单
本项目的动态菜单支持到 ```4级``` 菜单，支持 ```外链```，支持```自定义图标```，添加教程如下：

####  (1) 添加外链

![](https://i.loli.net/2019/11/01/YiWyKBOFd4z1ngu.png)

 #### (2) 添加内部菜单

组件路径为 src/views

|   添加内部菜单  |   组件路径对应  |
|--- | --- |
| ![](https://i.loli.net/2019/11/01/qQCV2xUdcZj4sSo.png) |  ![](https://i.loli.net/2019/05/27/5cebafaaa946592632.png)   |

#### (3) 分配菜单
分配菜单需要在角色管理中操作
### 权限控制
可以引入权限判断函数或者使用全局指令函数实现前端的权限控制<br>
1、使用全局指令函数```  v-permission="" ```
```html
<!-- 新增 -->
<div v-permission="['admin','user:add']" style="display: inline-block;margin: 0px 2px;">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="add">新增</el-button>
      <eForm ref="form" :sup_this="sup_this" :is-add="true" :dicts="dicts"/>
    </div>
```
2、使用判断函数 ```checkPermission()```
``` html
<template>
  	<el-tab-pane v-if="checkPermission(['admin'])" label="Admin">
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
## 数据加载
本系统使用 [混入方式](https://cn.vuejs.org/v2/guide/mixins.html) 封装了表格的数据加载与分页，源码位于 ```src/mixins/initData.js```，代码如下：
```js
import { initData } from '@/api/data'

export default {
  data() {
    return {
      loading: true, data: [], page: 0, size: 10, total: 0, url: '', params: {}, query: {}, time: 170
    }
  },
  methods: {
    async init() {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        initData(this.url, this.params).then(res => {
          this.total = res.totalElements
          this.data = res.content
          setTimeout(() => {
            this.loading = false
          }, this.time)
          resolve(res)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },
    beforeInit() {
      return true
    },
    pageChange(e) {
      this.page = e - 1
      this.init()
    },
    sizeChange(e) {
      this.page = 0
      this.size = e
      this.init()
    }
  }
}

```
具体使用，如下
```vue
<template>
  <div class="app-container">
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="name" label="名称"/>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
export default {
  mixins: [initData,],
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    beforeInit() {
      this.url = 'api/user'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      return true
    }
  }
}
</script>
```
## 异常处理
在 ```src/utils/request.js``` 文件中对所有的 ```request```请求进行拦截，通过``` response``` 拦截器对接口返回的状态码进行分析与异常处理，部分代码如下
```js
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
## 数据字典

首先我们需要在字典管理中创建一个字典，页面如下

![](https://docs-1255840532.cos.ap-shanghai.myqcloud.com/dict.png)
前端使用字典方式如下

### 使用全局组件

::: tip

建议使用该方式

:::

使用方式：

``` vue
<template>
  <div class="app-container">
  </div>
</template>

<script>
export default {
  // 设置数据字典
  dicts: ['job_status'],
  created() {
    // 得到完整数据
    console.log(this.dict.job_status)
    // 打印简化后的label数据
    console.log(this.dict.job_status.label)
  }
}
</script>
```

打印如下：

1、**完整数据**

![](https://i.loli.net/2019/11/01/5sW2S7ZqFrjzpxA.png)

2、**简化后的label数据**

![](https://i.loli.net/2019/11/01/DLyREUewlWt9NPT.png)

### 使用混入方式

源码位于：  ```src/mixins/initDict.js```，代码如下

**（1）引入组件**

``` js
import initDict from '@/mixins/initDict'
export default {
  mixins: [initDict]
}
```
**（2）使用钩子函数获取字典**

``` js
import initDict from '@/mixins/initDict'
export default {
 mixins: [initDict],
 created() {
    this.$nextTick(() => {
      // 加载数据字典
      this.getDict('job_status')
    })
  }
}
```
**（3）使用字典**
```js
<el-form-item v-if="form.pid !== 0" label="状态" prop="enabled">
        <el-radio v-for="item in dicts" :key="item.id" v-model="form.enabled" :label="item.value">{{ item.label }}</el-radio>
 </el-form-item>
```
## 系统组件
在这里列出系统使用到的组件，方便大家使用
- 树形表格：[使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/feature/component/tree-table.html#%E4%BB%A3%E7%A0%81%E7%A4%BA%E4%BE%8B)
- 树形选择框(vue-treeselect)：[使用文档](https://github.com/riophae/vue-treeselect)
- Svg 图标：[使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/feature/component/svg-icon.html)
- Excel 导出：[使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/feature/component/excel.html)
- CodeMirror：[使用文档](https://github.com/codemirror/CodeMirror)
- 富文本：[使用文档](https://www.kancloud.cn/wangfupeng/wangeditor3/332599)
- Markdown：[使用文档](https://github.com/hinesboy/mavonEditor)
