package com.lzctzk.address.config.mybatis;
/**
 * @author luozhen
 * @date 2018-11-13 15:05
 * @version V1.0
 * @description
 */

import com.baomidou.mybatisplus.core.injector.ISqlInjector;
import com.baomidou.mybatisplus.extension.injector.LogicSqlInjector;
import com.baomidou.mybatisplus.extension.plugins.PaginationInterceptor;
import com.baomidou.mybatisplus.extension.plugins.PerformanceInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * com.lzctzk.address.config
 *
 * @author luozhen
 * @version V1.0
 * @date 2018-11-13 15:05
 * @description
 */
@EnableTransactionManagement
@Configuration
@MapperScan("com.baomidou.cloud.service.*.mapper*")
public class MybatisPlusConfig {
    /**
     * 分页插件
     */
    @Bean
    public PaginationInterceptor paginationInterceptor() {
        return new PaginationInterceptor();
    }

    /**
     * SQL执行效率插件
     */
    @Bean
    @Profile({"dev", "test"})// 设置 dev test 环境开启
    public PerformanceInterceptor performanceInterceptor() {
        PerformanceInterceptor performanceInterceptor = new PerformanceInterceptor();
        //performanceInterceptor.setMaxTime(50000);
        //performanceInterceptor.setFormat(true);
        return performanceInterceptor;
    }

    /**
     * 功能描述: 配置逻辑删除
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019/2/26 11:49
     */
    @Bean
    public ISqlInjector sqlInjector() {
        return new LogicSqlInjector();
    }
}
