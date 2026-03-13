package com.smartprep.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Redis Cache Configuration
 *
 * Caches high-traffic read-only responses so repeated requests
 * within the TTL window skip database queries entirely.
 *
 * Caches configured:
 *   - "dashboard"    → TTL 10 min  (dashboard summary data)
 *   - "performance"  → TTL 10 min  (weekly performance chart)
 *   - "readiness"    → TTL 30 min  (exam readiness score)
 *   - "tests"        → TTL 30 min  (mock test list)
 */
@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {

        // Default: 10 minutes, store as JSON (not Java-serialized bytes)
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .disableCachingNullValues()
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(
                                new GenericJackson2JsonRedisSerializer()));

        // Per-cache TTL overrides
        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();
        cacheConfigs.put("dashboard",   defaultConfig.entryTtl(Duration.ofMinutes(10)));
        cacheConfigs.put("performance", defaultConfig.entryTtl(Duration.ofMinutes(10)));
        cacheConfigs.put("readiness",   defaultConfig.entryTtl(Duration.ofMinutes(30)));
        cacheConfigs.put("tests",       defaultConfig.entryTtl(Duration.ofMinutes(30)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigs)
                .build();
    }
}
