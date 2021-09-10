package com.lzctzk.address;

import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * @author luozhen
 * @date 2019/3/4 16:20
 */
@SpringBootApplication
@EnableSwagger2
@MapperScan({"com.lzctzk.address.dao.*.mapper", "com.lzctzk.address.pojo.*.mapper"})
public class ServiceApplication extends SpringBootServletInitializer {

    private static Logger log = LoggerFactory.getLogger(ServiceApplication.class);

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(ServiceApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(ServiceApplication.class, args);
        log.info("建筑物属性服务启动成功");
    }
}