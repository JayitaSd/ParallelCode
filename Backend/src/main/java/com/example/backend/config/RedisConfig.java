package com.example.backend.config;

import com.example.backend.redis.RedisMessageListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.serializer.JacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import tools.jackson.databind.ObjectMapper;

/**
 * Configure Redis connection, RedisTemplate, and Pub/Sub listener container
 */
@Configuration
public class RedisConfig {

    /**
     * Configure RedisTemplate with proper serialization settings
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);



        JacksonJsonRedisSerializer<Object> jacksonJsonRedisSerializer = new JacksonJsonRedisSerializer<>(Object.class);

        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();

        template.setKeySerializer(stringRedisSerializer);
        template.setHashKeySerializer(stringRedisSerializer);

        template.setValueSerializer(jacksonJsonRedisSerializer);
        template.setHashValueSerializer(jacksonJsonRedisSerializer);

        template.afterPropertiesSet();
        return template;
    }

    /**
     * Configure ObjectMapper for JSON serialization
     */
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    /**
     * Configure listener container for Redis Pub/Sub
     */
    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory connectionFactory,
            RedisMessageListener redisMessageListener) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);

        container.addMessageListener(
                redisMessageListener,
                new PatternTopic("doc:*:updates")
        );

        return container;
    }
}
