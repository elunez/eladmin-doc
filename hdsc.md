#### 权限控制
本系统权限控制采用 ```RBAC```思想。简单地说，一个用户拥有若干角色，每一个角色拥有若干权限，每一个角色拥有若干个菜单，这样，就构造成“用户-角色-权限”，“角色-菜单” 的授权模型。在这种模型中，用户与角色、角色与权限、角色与菜单之间构成了多对多的关系，如下图

![](https://i.loli.net/2019/03/28/5c9c93a520ab8.png)
##### 后端权限控制
本系统安全框架使用的是 ```Spring Security + Jwt Token```，
访问后端接口需在请求头中携带```token```进行访问，请求头格式如下：
```
# Authorization: Bearer 登录时返回的token
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTU1ODk2NzY0OSwiaWF0IjoxNTU4OTQ2MDQ5fQ.jsJvqHa1tKbJazG0p9kq5J2tT7zAk5B6N_CspdOAQLWgEICStkMmvLE-qapFTtWnnDUPAjqmsmtPFSWYaH5LtA
```
也可以过滤一些接口如：```Druid```监控，```swagger```文档，支付宝回调通知等。<br>配置文件位于：```eladmin-system -> modules -> security ->  config -> SecurityConfig```
``` java
// 关键代码，部分略
protected void configure(HttpSecurity httpSecurity) throws Exception {
    httpSecurity
            // 禁用 CSRF
            .csrf().disable()
            // 授权异常
            .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
            // 不创建会话
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeRequests()
            .antMatchers("/druid/**").permitAll()
            // 支付宝回调
            .antMatchers("/api/aliPay/return").anonymous()
            .antMatchers("/api/aliPay/notify").anonymous()
            // 所有请求都需要认证
            .anyRequest().authenticated();
    httpSecurity
            .addFilterBefore(authenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);
}
```
```permitAll()``` 方法指所有登录和未登录人员都可以访问，这个会经过 ```security filter```<br>
 ```anonymous()``` 所有人都能访问，但是这个不会经过  ```security filter```
#####  系统数据交互
用户登录 -> 后端验证登录返回 ```token``` -> 前端带上```token```请求后端数据 -> 后端返回数据，
数据交互流程如下：
![](https://i.loli.net/2019/03/28/5c9c93b996ace.png)
#####  接口权限控制
```Spring Security``` 提供了```Spring EL```表达式，允许我们在定义接口访问的方法上面添加注解，来控制访问权限，相关 ```EL```总结如下
<table>
<thead>
<tr>
<th>表达式</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td>hasRole([role])</td>
<td>当前用户是否拥有指定角色。</td>
</tr>
<tr>
<td>hasAnyRole([role1,role2])</td>
<td>多个角色是一个以逗号进行分隔的字符串。如果当前用户拥有指定角色中的任意一个则返回true。</td>
</tr>
<tr>
<td>hasAuthority([auth])</td>
<td>等同于hasRole</td>
</tr>
<tr>
<td>hasAnyAuthority([auth1,auth2])</td>
<td>等同于hasAnyRole</td>
</tr>
<tr>
<td>Principle</td>
<td>代表当前用户的principle对象</td>
</tr>
<tr>
<td>authentication</td>
<td>直接从SecurityContext获取的当前Authentication对象</td>
</tr>
<tr>
<td>permitAll</td>
<td>总是返回true，表示允许所有的</td>
</tr>
<tr>
<td>denyAll</td>
<td>总是返回false，表示拒绝所有的</td>
</tr>
<tr>
<td>isAnonymous()</td>
<td>当前用户是否是一个匿名用户</td>
</tr>
<tr>
<td>isRememberMe()</td>
<td>表示当前用户是否是通过Remember-Me自动登录的</td>
</tr>
<tr>
<td>isAuthenticated()</td>
<td>表示当前用户是否已经登录认证成功了。</td>
</tr>
<tr>
<td>isFullyAuthenticated()</td>
<td>如果当前用户既不是一个匿名用户，同时又不是通过Remember-Me自动登录的，则返回true。</td>
</tr>
</tbody>
</table>

下面的接口表示用户拥有 ```ADMIN```、```MENU_ALL```、```MENU_EDIT``` 三个权限中的任意一个就能能访问```update```方法，如果方法不加```@preAuthorize```注解，意味着所有用户都带上有效的```token```后能访问 ```update``` 方法
``` java
@Log(description = "修改菜单")
@PutMapping(value = "/menus")
@PreAuthorize("hasAnyRole('ADMIN','MENU_ALL','MENU_EDIT')")
public ResponseEntity update(@Validated @RequestBody Menu resources){
    // 略
}
```
#### 系统缓存
本系统缓存使用的是 ```redis```，默认使用 ```Spring``` 的注解对系统缓存进行操作，并且提供了可视化的 ```redis``` 缓存操作
##### 配置缓存
````redis```` 配置文件位于 ```eladmin-common - > redis ```，部分配置文件如下：
``` java
public class RedisConfig extends CachingConfigurerSupport {

    @Value("${spring.redis.host}")
    private String host;

    @Value("${spring.redis.port}")
    private int port;

    @Value("${spring.redis.timeout}")
    private int timeout;

    @Value("${spring.redis.jedis.pool.max-idle}")
    private int maxIdle;

    @Value("${spring.redis.jedis.pool.max-wait}")
    private long maxWaitMillis;

    @Value("${spring.redis.password}")
    private String password;

    /**
     * 配置 redis 连接池
     * @return
     */
    @Bean
    public JedisPool redisPoolFactory(){
        JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
        jedisPoolConfig.setMaxIdle(maxIdle);
        jedisPoolConfig.setMaxWaitMillis(maxWaitMillis);
        if (StrUtil.isNotBlank(password)) {
            return new JedisPool(jedisPoolConfig, host, port, timeout, password);
        } else {
            return new JedisPool(jedisPoolConfig, host, port,timeout);
        }
    }

    /**
     *  设置 redis 数据默认过期时间
     *  设置@cacheable 序列化方式
     * @return
     */
    @Bean
    public RedisCacheConfiguration redisCacheConfiguration(){
        FastJsonRedisSerializer<Object> fastJsonRedisSerializer = new FastJsonRedisSerializer<>(Object.class);
        RedisCacheConfiguration configuration = RedisCacheConfiguration.defaultCacheConfig();
        configuration = configuration.serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(fastJsonRedisSerializer)).entryTtl(Duration.ofHours(2));
        return configuration;
    }

    @Bean(name = "redisTemplate")
    @ConditionalOnMissingBean(name = "redisTemplate")
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        //序列化
        FastJsonRedisSerializer fastJsonRedisSerializer = new FastJsonRedisSerializer(Object.class);
        // value值的序列化采用fastJsonRedisSerializer
        template.setValueSerializer(fastJsonRedisSerializer);
        template.setHashValueSerializer(fastJsonRedisSerializer);
        // 全局开启AutoType，不建议使用
        // ParserConfig.getGlobalInstance().setAutoTypeSupport(true);
        // 建议使用这种方式，小范围指定白名单
        ParserConfig.getGlobalInstance().addAccept("me.zhengjie.system.service.dto");
        // key的序列化采用StringRedisSerializer
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }

    /**
     * 自定义缓存key生成策略
     * 使用方法 @Cacheable(keyGenerator="keyGenerator")
     * @return
     */
    @Bean
    @Override
    public KeyGenerator keyGenerator() {
        return (target, method, params) -> {
            StringBuilder sb = new StringBuilder();
            sb.append(target.getClass().getName());
            sb.append(method.getName());
            for (Object obj : params) {
                sb.append(obj.toString());
            }
            log.info(sb.toString());
            return sb.toString();
        };
    }
}
```
##### 缓存注解
- @CacheConfig：主要用于配置该类中会用到的一些共用的缓存配置
- @Cacheable：主要方法的返回值将被加入缓存。在查询时，会先从缓存中获取，若不存在才再发起对数据库的访问。
- @CachePut：主要用于数据新增和修改操作
- @CacheEvict：配置于函数上，通常用在删除方法上，用来从缓存中移除相应数据。

使用如下：
```java
@CacheConfig(cacheNames = "qiNiu")
public interface QiNiuService {

    /**
     * 查配置
     * @return
     */
    @Cacheable(key = "'1'")
    QiniuConfig find();

    /**
     * 修改配置
     * @param qiniuConfig
     * @return
     */
    @CachePut(key = "'1'")
    QiniuConfig update(QiniuConfig qiniuConfig);

    /**
     * 查询文件，使用自定义key
     * @param id
     * @return
     */
    @Cacheable(keyGenerator = "keyGenerator")
    QiniuContent findByContentId(Long id);

    /**
     * 删除文件
     * @param content
     * @param config
     * @return
     */
    @CacheEvict(allEntries = true)
    void delete(QiniuContent content, QiniuConfig config);
}
```
##### 可视化redis操作

![](https://i.loli.net/2019/05/28/5cec9232582d117484.png)

#### 异常处理
我们开发项目的时，数据在请求过程中发生错误是非常常见的事情。如：权限不足、数据唯一异常、数据不能为空异常、义务异常等。这些异常如果不经过处理会对前端开发人员和使用者造成不便，因此我们就需要统一处理他们。<br>
源码位于：``` eladmin-common - > exception ```
##### 定义异常实体
```java
@Data
class ApiError {
    private Integer status;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    private String message;

    private ApiError() {
        timestamp = LocalDateTime.now();
    }

    public ApiError(Integer status,String message) {
        this();
        this.status = status;
        this.message = message;
    }
}
```
##### 封装异常处理
###### 1、通用异常
封装了 ```BadRequestException```，用于处理通用的异常
```java
@Getter
public class BadRequestException extends RuntimeException{

    private Integer status = BAD_REQUEST.value();

    public BadRequestException(String msg){
        super(msg);
    }

    public BadRequestException(HttpStatus status,String msg){
        super(msg);
        this.status = status.value();
    }
}
```
###### 2、实体相关异常
(1) 实体不存在： ``` EntityNotFoundException```<br>
(2) 实体已存在：```EntityExistException```<br>
使用场景，删除用户的时候是根据ID删除的，可判断ID是否存在，抛出异常；新增用户的时候用户名是唯一的，可判断用户是否存在，抛出异常

##### 全局异常拦截
使用全局异常处理器 ```@RestControllerAdvice``` 处理请求发送的异常，部分代码如下：
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理所有不可知的异常
     * @param e
     * @return
     */
    @ExceptionHandler(Throwable.class)
    public ResponseEntity handleException(Throwable e){
        // 打印堆栈信息
        log.error(ThrowableUtil.getStackTrace(e));
        ApiError apiError = new ApiError(BAD_REQUEST.value(),e.getMessage());
        return buildResponseEntity(apiError);
    }
    /**
     * 处理自定义异常
     * @param e
     * @return
     */
	@ExceptionHandler(value = BadRequestException.class)
	public ResponseEntity<ApiError> badRequestException(BadRequestException e) {
        // 打印堆栈信息
        log.error(ThrowableUtil.getStackTrace(e));
        ApiError apiError = new ApiError(e.getStatus(),e.getMessage());
        return buildResponseEntity(apiError);
	}

    /**
     * 处理 EntityExist
     * @param e
     * @return
     */
    @ExceptionHandler(value = EntityExistException.class)
    public ResponseEntity<ApiError> entityExistException(EntityExistException e) {
        // 打印堆栈信息
        log.error(ThrowableUtil.getStackTrace(e));
        ApiError apiError = new ApiError(BAD_REQUEST.value(),e.getMessage());
        return buildResponseEntity(apiError);
    }

    /**
     * 处理 EntityNotFound
     * @param e
     * @return
     */
    @ExceptionHandler(value = EntityNotFoundException.class)
    public ResponseEntity<ApiError> entityNotFoundException(EntityNotFoundException e) {
        // 打印堆栈信息
        log.error(ThrowableUtil.getStackTrace(e));
        ApiError apiError = new ApiError(NOT_FOUND.value(),e.getMessage());
        return buildResponseEntity(apiError);
    }
    /**
     * 统一返回
     * @param apiError
     * @return
     */
    private ResponseEntity<ApiError> buildResponseEntity(ApiError apiError) {
        return new ResponseEntity(apiError, HttpStatus.valueOf(apiError.getStatus()));
    }
}
```
##### 具体使用
```java
throw new BadRequestException("发生了异常");
```
#### 系统日志
本系统使用 ```AOP``` 记录用户操作日志，只需要在 ```controller``` 的方法上使用 ```@Log("")``` 注解，就可以将用户操作记录到数据库，源码可查看 ```eladmin-logging``` <br>
模块具体使用如下：
```java
@Log("新增用户")
@PostMapping(value = "/users")
@PreAuthorize("hasAnyRole('ADMIN','USER_ALL','USER_CREATE')")
public ResponseEntity create(@Validated @RequestBody User resources){
    checkLevel(resources);
    return new ResponseEntity(userService.create(resources),HttpStatus.CREATED);
}
```
页面上可以看到 ```操作日志```和```异常日志```

###### 操作日志
![](https://docs-1255840532.cos.ap-shanghai.myqcloud.com/fasdfa.png)
###### 异常日志
![](https://docs-1255840532.cos.ap-shanghai.myqcloud.com/2.png)

#### 数据权限
本系统是基于部门做的一个简单数据权限控制，也就是通过用户角色中的数据权限控制用户能看哪些数据。目前系统在 ```用户管理```、```部门管理```、```岗位管理```中加入了数据权限供大家测试
###### 角色数据权限
系统提供了三种数据权限控制
- 全部数据权限  无数据权限限制
- 本级数据权限  限制只能看到本部门数据
- 自定义数据权限  可根据实际需要选择部门控制数据权限

![](https://docs-1255840532.cos.ap-shanghai.myqcloud.com/sjqx.png)

###### 修改后端代码
这里用岗位管理来举例，控制用户能看到哪些岗位数据，首先岗位的实体中需要关联部门，这里用的是一对一关联
``` java
    @OneToOne
    @JoinColumn(name = "dept_id")
    private Dept dept;
```

**（1）在控制器中注入**
```java
@Autowired
private DataScope dataScope;
```
**（2）在查询的方法中加入如下代码获取数据权限**

```java
@Log("查询岗位")
@GetMapping(value = "/job")
@PreAuthorize("hasAnyRole('ADMIN','USERJOB_ALL','USERJOB_SELECT','USER_ALL','USER_SELECT')")
public ResponseEntity getJobs(@RequestParam(required = false) String name,
                              @RequestParam(required = false) Long deptId,
                              @RequestParam(required = false) Boolean enabled,
                              Pageable pageable){
    // 数据权限
    Set<Long> deptIds = dataScope.getDeptIds();
    return new ResponseEntity(jobQueryService.queryAll(name, enabled , deptIds, deptId, pageable),HttpStatus.OK);
}
```

**（3）修改QueryService**
```java
@Override
        public Predicate toPredicate(Root<Job> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder cb) {

            List<Predicate> list = new ArrayList<Predicate>();

            // 数据权限
            Join<Dept, Job> join = root.join("dept",JoinType.LEFT);
            if (!CollectionUtils.isEmpty(deptIds)) {
                list.add(join.get("id").in(deptIds));
            }
            Predicate[] p = new Predicate[list.size()];
            return cb.and(list.toArray(p));
        }
```
#### 定时任务
对于简单的定时任务用 ```Spring```的 ```@Scheduled``` 注解即可，如需要动态管理定时任务就需要使用到 ```Quartz```。本系统的动态定时任务源码位于 ``` eldamin-system -> modules -> quartz ```，使用流程如下
##### 编写任务处理类
```java
@Slf4j
@Component
public class TestTask {

    public void run(){ log.info("执行成功");  }

    public void run1(String str){ log.info("执行成功，参数为： {}" + str); }
}
```
##### 创建定时任务
打开定时任务页面，点击新增按钮创建定时任务，部分参数解释如下：
- Bean名称：Spring Bean名称，如： testTask
- 方法名称：对应后台任务方法名称 方法参数：对应后台任务方法名称值，没有可不填 
- cron表达式：可查询官方cron表达式介绍
- 状态：是否启动定时任务

##### 常用cron表达式
```
0 0 10,14,16 * * ? 每天上午10点，下午2点，4点 
0 0/30 9-17 * * ? 朝九晚五工作时间内每半小时 
0 0 12 ? * WED 表示每个星期三中午12点 
"0 0 12 * * ?" 每天中午12点触发 
"0 15 10 ? * *" 每天上午10:15触发 
"0 15 10 * * ?" 每天上午10:15触发 
"0 15 10 * * ? *" 每天上午10:15触发 
"0 15 10 * * ? 2005" 2005年的每天上午10:15触发 
"0 * 14 * * ?" 在每天下午2点到下午2:59期间的每1分钟触发 
"0 0/5 14 * * ?" 在每天下午2点到下午2:55期间的每5分钟触发 
"0 0/5 14,18 * * ?" 在每天下午2点到2:55期间和下午6点到6:55期间的每5分钟触发 
"0 0-5 14 * * ?" 在每天下午2点到下午2:05期间的每1分钟触发 
"0 10,44 14 ? 3 WED" 每年三月的星期三的下午2:10和2:44触发 
"0 15 10 ? * MON-FRI" 周一至周五的上午10:15触发 
"0 15 10 15 * ?" 每月15日上午10:15触发 
"0 15 10 L * ?" 每月最后一日的上午10:15触发 
"0 15 10 ? * 6L" 每月的最后一个星期五上午10:15触发 
"0 15 10 ? * 6L 2002-2005" 2002年至2005年的每月的最后一个星期五上午10:15触发 
"0 15 10 ? * 6#3" 每月的第三个星期五上午10:15触发
```
#### 代码生成
本系统提供高灵活度的代码生成功能，只需要在数据库中设计好表结构，就能一键生成前后端代码，是不是很nice，使用流程如下
#####  设计表结构
1. 配置主键（字符串或者整形皆可，整形可不设置自增）
2. 可以设计字段是否为空（会根据这个进行表单验证）
3. 设计注释，```前端会根据注释生成表格标题```

![](https://i.loli.net/2019/03/28/5c9c94747b040.png)

我们数据库中表都能在这看到，需根据自己的需求进行 ```生成器配置```

![](https://i.loli.net/2019/03/28/5c9c949238a5b.png)

##### 生成器配置
1. 模块名称：这个顾名思义就是模块的名称
2. 至于包下：这个的意思是```生成的代码放到哪个包里面```
3. 前端路径：前端代码生成的路径
4. API路径：这个默认至于 ```src/api``` 目录下
5. 是否覆盖：危险操作，需谨慎

##### 代码生成
我们配置好生成器后就能进行代码生成啦，具体操作如下：
1. 点击生成代码按钮
2. 可以临时修改字段标题
3. 配置查询方式，可选：精确或者模糊
4. 列表显示：前端页面是否显示该字段
5. 点击生成按钮

![](https://i.loli.net/2019/03/28/5c9c94b9a8989.png)
##### 额外工作
代码生成可以节省你```80%```左右的开发任务，部分是需要自己需求进行修改的，如：
1. 添加菜单：虽然代码给你生成了，但是菜单还是需要自己手动添加的
2. 权限验证：权限默认生成了，但是没有添加进数据库，需要自行添加

##### 界面预览
添加菜单后，生成的界面如下：<br>
1、搜索

![](https://i.loli.net/2019/03/28/5c9c94cec325d.png)

2、新增

![](https://i.loli.net/2019/03/28/5c9c94e967d00.png)

3、列表

![](https://i.loli.net/2019/03/28/5c9c94fd8d347.png)
#### 系统工具
为了让大家快速的熟悉该项目，这里列举出项目中使用到的工具类
- ElAdminConstant：系统常用常量定义
- EncryptUtils：加密工具，包括对称加密解密，md5加密
- FileUtil：文件工具类
- PageUtil：分页工具类
- RequestHolder：随时获取 HttpServletRequest
- SecurityUtils：获取当前用户
- SpringContextHolder：随时获取bean
- StringUtils：字符串工具类
- ThrowableUtil：异常工具，获取堆栈信息
- ValidationUtil：验证工具

##### 目录如下
![](https://docs-1255840532.cos.ap-shanghai.myqcloud.com/util.png)