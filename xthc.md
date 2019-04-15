本系统集成了redis缓存，使用注解就能对系统缓存进行操作，并且提供了可视化的redis缓存操作与查看
#### 配置缓存
redis序列化时可能会报错：<p style="color:red">com.alibaba.fastjson.JSONException: autoType is not support</p> 
错误发生的原因是：```redis```序列化时将```class```信息写入，反序列化的时候，```fastjson```默认情况下会开启```autoType```的检查，相当于一个白名单检查，如果序列化信息中的类路径不在```autoType```中，这个时候就会抛出上面的异常

**解决办法：**

1、全局开启AutoType，不建议使用
<p style="color:#e96900">ParserConfig.getGlobalInstance().setAutoTypeSupport(true);</p>
2、建议小范围指定白名单
<p style="color:#e96900">ParserConfig.getGlobalInstance().addAccept("me.zhengjie.system.domain");</p>

**完整配置如下**
``` java
/**
 * @author jie
 * @date 2018-11-24
 */
@Slf4j
@Configuration
@EnableCaching
@ConditionalOnClass(RedisOperations.class)
@EnableConfigurationProperties(RedisProperties.class)
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
        ParserConfig.getGlobalInstance().addAccept("me.zhengjie.system.domain");
        ParserConfig.getGlobalInstance().addAccept("me.zhengjie.tools.domain");
        ParserConfig.getGlobalInstance().addAccept("me.zhengjie.quartz.domain");
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
####  具体使用

```@CacheConfig``` 一般用于Service类上
```@Cacheable``` 用于Service方法上
```@CachePut``` 用于更新缓存
```@CacheEvict``` 用于清除缓存

使用自定义缓存key生成策略，```@Cacheable(keyGenerator="keyGenerator")``` 具体使用如下
``` java
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
     * 查询文件
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
#### 可视化redis操作

![](https://i.loli.net/2019/03/28/5c9c9445b982b.png)