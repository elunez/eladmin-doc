#### 权限控制
可以引入权限判断函数或者使用全局指令函数实现前端的权限控制<br>
1、使用全局指令函数```  v-permission="" ```
```
<!-- 新增 -->
<div v-permission="['ADMIN','USER_ALL','USER_CREATE']" style="display: inline-block;margin: 0px 2px;">
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
#### 数据加载
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
#### 异常处理
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
#### 数据字典
设计思路，前端可通过字典名称（唯一）查询字典详情来实现动态字典的功能，那么查询会不能很麻烦呢，这个不用担心，我已经帮大家封装好了，使用的依旧是 [混入方式](https://cn.vuejs.org/v2/guide/mixins.html)，源码位于：  ```src/mixins/initDict.js```，代码如下
``` js
import { get } from '@/api/dictDetail'

export default {
  data() {
    return {
      dicts: []
    }
  },
  methods: {
    async getDict(name) {
      return new Promise((resolve, reject) => {
        get(name).then(res => {
          this.dicts = res.content
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
```
首先我们需要在字典管理中创建一个字典，页面如下

![](https://docs-1255840532.cos.ap-shanghai.myqcloud.com/dict.png)
前端使用这个字典

**（1）引入组件**
``` javascript
import initDict from '@/mixins/initDict'
export default {
  mixins: [initDict]
}
```
**（2）使用钩子函数获取字典**
``` javascript
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
```javascript
<el-form-item v-if="form.pid !== 0" label="状态" prop="enabled">
        <el-radio v-for="item in dicts" :key="item.id" v-model="form.enabled" :label="item.value">{{ item.label }}</el-radio>
 </el-form-item>
```
#### 系统组件
在这里列出系统使用到的组件，方便大家使用
- 树形表格：[使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/feature/component/tree-table.html#%E4%BB%A3%E7%A0%81%E7%A4%BA%E4%BE%8B)
- 树形选择框(vue-treeselect)：[使用文档](https://github.com/riophae/vue-treeselect)
- Svg 图标：[使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/feature/component/svg-icon.html)
- Excel 导出：[使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/feature/component/excel.html)
- CodeMirror：[使用文档](https://github.com/codemirror/CodeMirror)
- 富文本：[使用文档](https://www.kancloud.cn/wangfupeng/wangeditor3/332599)
- Markdown：[使用文档](https://github.com/hinesboy/mavonEditor)