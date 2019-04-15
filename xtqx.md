本系统权限控制采用 ```RBAC```（Role-Based Access Control，基于角色的访问控制），就是用户通过角色与权限进行关联。简单地说，一个用户拥有若干角色，每一个角色拥有若干权限，每一个角色拥有若干个菜单，这样，就构造成“用户-角色-权限”，“角色-菜单” 的授权模型。在这种模型中，用户与角色、角色与权限、角色与菜单之间构成了多对多的关系，如下图
![](https://i.loli.net/2019/03/28/5c9c93a520ab8.png)

#### 后端权限控制
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
#####  数据交互
用户输入账号密码 -> 验证账号密码返回token -> 前端带上token请求数据 -> 后端返回数据<br>
数据交互流程如下图：
![](https://i.loli.net/2019/03/28/5c9c93b996ace.png)
#####  接口权限控制
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
#### 前端权限控制
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