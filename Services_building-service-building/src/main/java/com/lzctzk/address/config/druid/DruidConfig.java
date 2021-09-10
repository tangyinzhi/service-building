package com.lzctzk.address.config.druid;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.spring.boot.autoconfigure.DruidDataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;


@Configuration
public class DruidConfig {
    @Primary
    @Bean(name = {"parking"})
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource dataSourceOne() {
        DruidDataSource dataSource = DruidDataSourceBuilder.create().build();
        dataSource.setName("OneDataSource");
        return dataSource;
    }
}
