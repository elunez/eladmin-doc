# 后端手册
## 权限控制
本系统权限控制采用 ```RBAC```思想。简单地说，一个用户拥有若干角色，每个角色拥有一个默认的权限，每一个角色拥有若干个菜单，菜单中存在按钮权限，这样，就构造成“用户-角色-菜单” 的授权模型。在这种模型中，用户与角色、角色与菜单之间构成了多对多的关系，如下图

![](https://i.loli.net/2019/11/01/mES5flJjUTtn9Yh.png)

### 权限控制
本系统安全框架使用的是 ```Spring Security + Jwt Token```，
访问后端接口需在请求头中携带```token```进行访问，请求头格式如下：

```
# Authorization: Bearer 登录时返回的token
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTU1ODk2NzY0OSwiaWF0IjoxNTU4OTQ2MDQ5fQ.jsJvqHa1tKbJazG0p9kq5J2tT7zAk5B6N_CspdOAQLWgEICStkMmvLE-qapFTtWnnDUPAjqmsmtPFSWYaH5LtA
```

###  数据交互
用户登录 -> 后端验证登录返回 ```token``` -> 前端带上```token```请求后端数据 -> 后端返回数据，
数据交互流程如下：
![](https://i.loli.net/2019/03/28/5c9c93b996ace.png)
###  接口权限
```Spring Security``` 提供了```Spring EL```表达式，允许我们在定义接口访问的方法上面添加注解，来控制访问权限，常用的 ```EL```如下

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
</tbody>
</table>

下面的接口表示用户拥有 ```admin```、```menu:edit``` 权限中的任意一个就能能访问```update```方法，如果方法不加```@preAuthorize```注解，意味着所有用户都需要带上有效的 ```token``` 后能访问 ```update``` 方法
``` java
@Log(description = "修改菜单")
@PutMapping(value = "/menus")
@PreAuthorize("hasAnyRole('admin','menu:edit')")
public ResponseEntity update(@Validated @RequestBody Menu resources){
    // 略
}
```
#### 自定义权限验证
由于每个接口都需要给超级管理员放行，而使用 `hasAnyRole('admin','user:list')` 每次都需要重复的添加 admin 权限，因此在新版本 (2.3) 中加入了自定义权限验证方式，在验证的时候默认给拥有admin权限的用户放行。

**源码:**
``` java
// eladmin-common -> me.zhengjie.config.ElPermissionConfig
@Service(value = "el")
public class ElPermissionConfig {

    public Boolean check(String ...permissions){
        // 如果是匿名访问的，就放行
        String anonymous = "anonymous";
        if(Arrays.asList(permissions).contains(anonymous)){
            return true;
        }
        // 获取当前用户的所有权限
        List<String> elPermissions = SecurityUtils.getUserDetails().getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        // 判断当前用户的所有权限是否包含接口上定义的权限
        return elPermissions.contains("admin") || Arrays.stream(permissions).anyMatch(elPermissions::contains);
    }
}
```
**使用方式：**
```java
// 支持多权限验证
@PreAuthorize("@el.check('user:list')") 
// 接口放行
@PreAuthorize("@el.check('anonymous')") 
```
### 匿名访问
在我们使用的时候，有写接口是不需要验证权限，这个时候就需要我们给接口放行，使用方式如下

**1、修改配置文件方式**

**eladmin-system -> modules -> security ->  config -> SecurityConfig**
``` java
// 关键代码，部分略
protected void configure(HttpSecurity httpSecurity) throws Exception {
    httpSecurity
            // 支付宝回调
            .antMatchers("/api/aliPay/return").anonymous()
            // 所有请求都需要认证
            .anyRequest().authenticated();
    httpSecurity
            .addFilterBefore(authenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);
}
```
::: tip 注意
使用 ```permitAll()``` 方法所有人都能访问，包括带上 `token` 访问

使用 ```anonymous()``` 所有人都能访问，但是带上 `token` 访问后会报错
:::

**2、使用注解方式**

使用注解有三种方式可以放行接口

``` java
// 自定义匿名接口
@AnonymousAccess
// 标识为匿名接口
@PreAuthorize("hasRole('anonymous')")
// 标识为匿名接口
@PreAuthorize("@el.check('anonymous')")
```
## 通用查询
本系统对 Jpa 的查询进行了封装，现可以通过 `@Query` 注解实现简单的查询与复杂查询

简单查询：`等于(默认)、大于等于、小于等于、左模糊、右模糊、中模糊、多字段模糊`。

复杂查询：`包含（IN）查询、左连接、右连接`

### 参数说明

| 字段名称 | 字段描述                                             | 默认值 |
| -------- | ---------------------------------------------------- | ------ |
| propName | 对象的属性名，如果字段名称与实体字段一致，则可以省略 | ""     |
| type     | 查询方式，默认为                                     | EQUAL  |
| blurry   | 多字段模糊查询，值为实体字段名称                     | ""     |
| joinName | 关联实体的名称                                       | ""     |
| join     | 连接查询方式，左连接或者右连接                       | LEFT   |


### 使用方式
**1、创建一个查询类 `QueryCriteria`**

``` java
@Data
public class QueryCriteria {

    // 等于
    @Query
    private String a;

    // 左模糊
    @Query(type = Query.Type.LEFT_LIKE)
    private String b;

    // 右模糊
    @Query(type = Query.Type.RIGHT_LIKE)
    private String c;

    // 大于等于
    @Query(type = Query.Type.GREATER_THAN, propName = "createTime")
    private Timestamp startTime;

    // 小于等于
    @Query(type = Query.Type.LESS_THAN, propName = "createTime")
    private Timestamp endTime;

    // 多字段模糊查询，blurry 为字段名称
    @Query(blurry = "a,b,c")
    private String blurry;

    // IN 查询
    @Query(type = Query.Type.IN)
    private List<String> d;

    // 左关联查询，left Join ， joinName为关联实体名称
    @Query(joinName = "")
    private String e;

    // 右关联查询，right Join ， joinName为关联实体名称
    @Query(joinName = "", join = Query.Join.RIGHT)
    private String f;
}
```

**2、在控制器中使用**

```java
// Pageable 分页查询
public ResponseEntity query(QueryCriteria criteria, Pageable pageable){
    return new ResponseEntity(service.queryAll(criteria,pageable), HttpStatus.OK);
}
```
**3、Service 中查询**

```
@Override
public Object queryAll(QueryCriteria criteria, Pageable pageable){
    Page<实体> page = repository.findAll(((root, criteriaQuery, cb) -> QueryHelp.getPredicate(root, criteria, cb)),pageable);
    return page;
}
```
::: tip
如果需要添加一个字段查询，只需要在查询类 `QueryCriteria` 中添加就可以了，可节省大量时间

源码可以查看 `eladmin-common` 模块中的 `me.zhengjie.annotation.Query` 与 `me.zhengjie.utils.QueryHelp`
:::

## 系统缓存
本系统缓存使用的是 ```redis```，默认使用 ```Spring``` 的注解对系统缓存进行操作，并且提供了可视化的 ```redis``` 缓存操作
### 配置缓存
配置文件位于 ```eladmin-common``` 模块中的 `me.zhengjie.config.RedisConfig`，配置文件如下：
``` java
@Slf4j
@Configuration
@EnableCaching
@ConditionalOnClass(RedisOperations.class)
@EnableConfigurationProperties(RedisProperties.class)
public class RedisConfig extends CachingConfigurerSupport {

    /**
     *  设置 redis 数据默认过期时间，默认6小时
     *  设置@cacheable 序列化方式
     */
    @Bean
    public RedisCacheConfiguration redisCacheConfiguration(){
        FastJsonRedisSerializer<Object> fastJsonRedisSerializer = new FastJsonRedisSerializer<>(Object.class);
        RedisCacheConfiguration configuration = RedisCacheConfiguration.defaultCacheConfig();
        configuration = configuration.serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(fastJsonRedisSerializer)).entryTtl(Duration.ofHours(6));
        return configuration;
    }

    @Bean(name = "redisTemplate")
    @ConditionalOnMissingBean(name = "redisTemplate")
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        //序列化
        FastJsonRedisSerializer<Object> fastJsonRedisSerializer = new FastJsonRedisSerializer<>(Object.class);
        // value值的序列化采用fastJsonRedisSerializer
        template.setValueSerializer(fastJsonRedisSerializer);
        template.setHashValueSerializer(fastJsonRedisSerializer);
        // 全局开启AutoType
        ParserConfig.getGlobalInstance().setAutoTypeSupport(true);
        // key的序列化采用StringRedisSerializer
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }

    /**
     * 自定义缓存key生成策略，默认将使用该策略
     */
    @Bean
    @Override
    public KeyGenerator keyGenerator() {
        return (target, method, params) -> {
            Map<String,Object> container = new HashMap<>();
            Class<?> targetClassClass = target.getClass();
            // 类地址
            container.put("class",targetClassClass.toGenericString());
            // 方法名称
            container.put("methodName",method.getName());
            // 包名称
            container.put("package",targetClassClass.getPackage());
            // 参数列表
            for (int i = 0; i < params.length; i++) {
                container.put(String.valueOf(i),params[i]);
            }
            // 转为JSON字符串
            String jsonString = JSON.toJSONString(container);
            // 做SHA256 Hash计算，得到一个SHA256摘要作为Key
            return DigestUtils.sha256Hex(jsonString);
        };
    }

    @Bean
    @Override
    public CacheErrorHandler errorHandler() {
        // 异常处理，当Redis发生异常时，打印日志，但是程序正常走
        log.info("初始化 -> [{}]", "Redis CacheErrorHandler");
        return new CacheErrorHandler() {
            @Override
            public void handleCacheGetError(RuntimeException e, Cache cache, Object key) {
                log.error("Redis occur handleCacheGetError：key -> [{}]", key, e);
            }

            @Override
            public void handleCachePutError(RuntimeException e, Cache cache, Object key, Object value) {
                log.error("Redis occur handleCachePutError：key -> [{}]；value -> [{}]", key, value, e);
            }

            @Override
            public void handleCacheEvictError(RuntimeException e, Cache cache, Object key) {
                log.error("Redis occur handleCacheEvictError：key -> [{}]", key, e);
            }

            @Override
            public void handleCacheClearError(RuntimeException e, Cache cache) {
                log.error("Redis occur handleCacheClearError：", e);
            }
        };
    }

}

/**
 * Value 序列化
 *
 * @author /
 * @param <T>
 */
 class FastJsonRedisSerializer<T> implements RedisSerializer<T> {

    private Class<T> clazz;

    FastJsonRedisSerializer(Class<T> clazz) {
        super();
        this.clazz = clazz;
    }

    @Override
    public byte[] serialize(T t) {
        if (t == null) {
            return new byte[0];
        }
        return JSON.toJSONString(t, SerializerFeature.WriteClassName).getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public T deserialize(byte[] bytes) {
        if (bytes == null || bytes.length <= 0) {
            return null;
        }
        String str = new String(bytes, StandardCharsets.UTF_8);
        return JSON.parseObject(str, clazz);
    }

}

/**
 * 重写序列化器
 *
 * @author /
 */
class StringRedisSerializer implements RedisSerializer<Object> {

    private final Charset charset;

    StringRedisSerializer() {
        this(StandardCharsets.UTF_8);
    }

    private StringRedisSerializer(Charset charset) {
        Assert.notNull(charset, "Charset must not be null!");
        this.charset = charset;
    }

    @Override
    public String deserialize(byte[] bytes) {
        return (bytes == null ? null : new String(bytes, charset));
    }

    @Override
    public byte[] serialize(Object object) {
        String string = JSON.toJSONString(object);
        if (StringUtils.isBlank(string)) {
            return null;
        }
        string = string.replace("\"", "");
        return string.getBytes(charset);
    }
}
```
### 缓存注解

::: tip

建议注解加在实现类上和实现类的方法上

:::

- @CacheConfig：主要用于配置该类中会用到的一些共用的缓存配置

- @Cacheable：主要方法的返回值将被加入缓存。在查询时，会先从缓存中获取，若不存在才再发起对数据库的访问。

- @CachePut：主要用于数据新增和修改操作

- @CacheEvict：配置于函数上，通常用在删除方法上，用来从缓存中移除相应数据。


## 异常处理
我们开发项目的时，数据在请求过程中发生错误是非常常见的事情。

如：权限不足、数据唯一异常、数据不能为空异常、义务异常等。这些异常如果不经过处理会对前端开发人员和使用者造成不便，因此我们就需要统一处理他们。

源码位于：源码位于：``` eladmin-common ``` 模块中的 `exception` 包中

### 异常封装

#### 异常实体

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
#### 自定义异常
##### 1、通用异常
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
##### 2、实体相关异常
(1) 实体不存在： ``` EntityNotFoundException```
```java
import org.springframework.util.StringUtils;

/**
 * @author Zheng Jie
 * @date 2018-11-23
 */
public class EntityNotFoundException extends RuntimeException {

    public EntityNotFoundException(Class clazz, String field, String val) {
        super(EntityNotFoundException.generateMessage(clazz.getSimpleName(), field, val));
    }

    private static String generateMessage(String entity, String field, String val) {
        return StringUtils.capitalize(entity)
                + " with " + field + " "+ val + " does not exist";
    }
}
```
(2) 实体已存在：```EntityExistException```
```java
import org.springframework.util.StringUtils;

/**
 * @author Zheng Jie
 * @date 2018-11-23
 */
public class EntityExistException extends RuntimeException {

    public EntityExistException(Class clazz, String field, String val) {
        super(EntityExistException.generateMessage(clazz.getSimpleName(), field, val));
    }

    private static String generateMessage(String entity, String field, String val) {
        return StringUtils.capitalize(entity)
                + " with " + field + " "+ val + " existed";
    }
}
```

使用场景，删除用户的时候是根据ID删除的，可判断ID是否存在，抛出异常

新增用户的时候用户名是唯一的，可判断用户是否存在，抛出异常

#### 全局异常拦截

使用全局异常处理器 ```@RestControllerAdvice``` 处理请求发送的异常

-  @RestControllerAdvice：默认会扫描指定包中所有@RequestMapping注解

-  @ExceptionHandler：通过@ExceptionHandler的 value 属性可过滤拦截的条件

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
### 具体使用
```java
// 通用异常
throw new BadRequestException("发生了异常");
// 通用异常，使用自定义状态码
throw new BadRequestException(HttpStatus.OK, "发送了异常");
// 实体存在异常
throw new EntityExistException(User.class, "email", "elunez@qq.com");
// 实体不存在异常
 throw new EntityNotFoundException(User.class, "userName", "test");
```
## 系统日志

本系统使用 ```AOP``` 方式记录用户操作日志，只需要在 ```controller``` 的方法上使用 ```@Log("")``` 注解，就可以将用户操作记录到数据库，源码可查看 ```eladmin-logging``` <br>
模块具体使用如下：

```java
@Log("新增用户")
@PostMapping(value = "/users")
public ResponseEntity create(@Validated @RequestBody User resources){
    checkLevel(resources);
    return new ResponseEntity(userService.create(resources),HttpStatus.CREATED);
}
```
页面上可以看到 ```操作日志```和```异常日志```

### 操作日志
![](https://docs-1255840532.cos.ap-shanghai.myqcloud.com/fasdfa.png)
### 异常日志
![](https://docs-1255840532.cos.ap-shanghai.myqcloud.com/2.png)

## 数据权限
本系统是基于部门做的一个简单数据权限控制，也就是通过用户角色中的数据权限控制用户能看哪些数据。目前系统在 ```用户管理```、```部门管理```、```岗位管理```中加入了数据权限供大家测试
### 角色数据权限
系统提供了三种数据权限控制
- 全部数据权限  无数据权限限制
- 本级数据权限  限制只能看到本部门数据
- 自定义数据权限  可根据实际需要选择部门控制数据权限

![](https://docs-1255840532.cos.ap-shanghai.myqcloud.com/sjqx.png)

### 修改后端代码
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
## 定时任务
对于简单的定时任务用 ```Spring```的 ```@Scheduled``` 注解即可，如需要动态管理定时任务就需要使用到 ```Quartz```。本系统的动态定时任务源码位于 ``` eldamin-system -> modules -> quartz ```，使用流程如下
### 编写任务处理类
```java
@Slf4j
@Component
public class TestTask {

    public void run(){ log.info("执行成功");  }

    public void run1(String str){ log.info("执行成功，参数为： {}" + str); }
}
```
### 创建定时任务
打开定时任务页面，点击新增按钮创建定时任务，部分参数解释如下：
- Bean名称：Spring Bean名称，如： testTask
- 方法名称：对应后台任务方法名称 方法参数：对应后台任务方法名称值，没有可不填 
- cron表达式：可查询官方cron表达式介绍
- 状态：是否启动定时任务

### 常用cron表达式
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
## 代码生成
本系统提供高灵活度的代码生成功能，只需要在数据库中设计好表结构，就能一键生成前后端代码，是不是很nice，使用流程如下
###  表结构设计
1. 配置主键（字符串或者整形皆可，整形可不设置自增）
2. 可以设计字段是否为空（会根据这个进行表单验证）
3. 设计注释，```前端会根据注释生成表格标题```

![](https://i.loli.net/2019/03/28/5c9c94747b040.png)

我们数据库中表都能在这看到，需根据自己的需求进行 ```生成器配置```

![](https://i.loli.net/2019/03/28/5c9c949238a5b.png)

### 代码生成

#### 代码生成配置

1. 模块名称：这个顾名思义就是模块的名称
2. 至于包下：这个的意思是```生成的代码放到哪个包里面```
3. 前端路径：前端代码生成的路径
5. 是否覆盖：危险操作，需谨慎

我们配置好生成器后就能进行代码生成啦，具体操作如下：
1. 点击生成代码按钮
2. 可以临时修改字段标题
3. 配置查询方式，可选：精确或者模糊
4. 列表显示：前端页面是否显示该字段
5. 点击生成按钮

![](https://i.loli.net/2019/11/01/Ap4ysvHe1lh6guT.png)
#### 额外工作
代码生成可以节省你```80%```左右的开发任务，部分是需要自己需求进行修改的，如：
1. 添加菜单：虽然代码给你生成了，但是菜单还是需要自己手动添加的
2. 按钮权限：接口权限默认生成了，但是没有添加进数据库，需要自行添加，菜单管理中添加按钮

#### 界面预览
添加菜单后，生成的界面如下：

**1、搜索**

![](https://i.loli.net/2019/03/28/5c9c94cec325d.png)

**2、新增**

![](https://i.loli.net/2019/03/28/5c9c94e967d00.png)

**3、列表**

![](https://i.loli.net/2019/03/28/5c9c94fd8d347.png)
## 系统基类

 2.3 版本加入了 Entity 基类 和 DTO 基类，大家可以按需去继承和修改，代码路径 

```
eladmin-common -> me.zhengjie.base
```

## 异步线程池

 该版本重写了spring默认线程池，代码地址： 

```
eladmin-system -> me.zhengjie.config.AsyncTaskExecutePool
```

 源码如下： 

```java
@Slf4j
@Configuration
public class AsyncTaskExecutePool implements AsyncConfigurer {

    //注入配置类
    private final AsyncTaskProperties config;

    public AsyncTaskExecutePool(AsyncTaskProperties config) {
        this.config = config;
    }

    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        //核心线程池大小
        executor.setCorePoolSize(config.getCorePoolSize());
        //最大线程数
        executor.setMaxPoolSize(config.getMaxPoolSize());
        //队列容量
        executor.setQueueCapacity(config.getQueueCapacity());
        //活跃时间
        executor.setKeepAliveSeconds(config.getKeepAliveSeconds());
        //线程名字前缀
        executor.setThreadNamePrefix("el-async-");
        // setRejectedExecutionHandler：当pool已经达到max size的时候，如何处理新任务
        // CallerRunsPolicy：不在新线程中执行任务，而是由调用者所在的线程来执行
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (throwable, method, objects) -> {
            log.error("===="+throwable.getMessage()+"====", throwable);
            log.error("exception method:"+method.getName());
        };
    }
}
```

使用方式如下

```java
// 在 service 的方法上使用注解
@Async
```

## 线程池工具类

 通过该工具类可以快速创建一个线程池，目前在 定时任务模块中使用到 ，代码地址： 

```
eladmin-system -> me.zhengjie.config.ThreadPoolExecutorUtil
```

 源码如下： 

```java
/**
 * 用于获取自定义线程池
 * @author Zheng Jie
 * @date 2019年10月31日18:16:47
 */
public class ThreadPoolExecutorUtil {

    public static ThreadPoolExecutor getPoll(){
        AsyncTaskProperties properties = SpringContextHolder.getBean(AsyncTaskProperties.class);
        return new ThreadPoolExecutor(
                properties.getCorePoolSize(),
                properties.getMaxPoolSize(),
                properties.getKeepAliveSeconds(),
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(properties.getQueueCapacity()),
                new TheadFactoryName()
        );
    }
}
```

 使用方式： 

```java
private final static ThreadPoolExecutor executor = ThreadPoolExecutorUtil.getPoll();
```

## 系统工具

为了让大家快速的熟悉该项目，这里列举出项目中使用到的工具类
- ElAdminConstant：系统常用常量定义
- EncryptUtils：加密工具，包括对称加密解密，md5加盐加密
- FileUtil：文件工具类
- PageUtil：分页工具类
- RequestHolder：随时获取 HttpServletRequest
- SecurityUtils：获取当前用户
- SpringContextHolder：随时获取bean
- StringUtils：字符串工具类
- ThrowableUtil：异常工具，获取堆栈信息
- ValidationUtil：验证工具

#### 目录如下
![](https://docs-1255840532.cos.ap-shanghai.myqcloud.com/util.png)
