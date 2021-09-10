package com.lzctzk.address.config.swagger2;

import com.google.common.base.Predicates;
import com.google.common.collect.Sets;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;


@Configuration
@EnableSwagger2
public class Swagger2Config {
    private static final String SWAGGER_SCAN_BASE_PACKAGE = "com.lzctzk.address.pojo";
    private static final String VERSION = "1.0.0";
    @Value("${swagger.enable}")
    private boolean enableSwagger;

    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .produces(Sets.newHashSet(new String[]{"application/json"}))
                .consumes(Sets.newHashSet(new String[]{"application/json"}))
                .genericModelSubstitutes(new Class[]{ResponseEntity.class})
                .useDefaultResponseMessages(true)
                .forCodeGeneration(true)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage(SWAGGER_SCAN_BASE_PACKAGE))
                .paths(Predicates.and(PathSelectors.ant("/**"), Predicates.not(PathSelectors.ant("/error"))))
                .build()
                .enable(this.enableSwagger);
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("内部数据工具接口文档")
                .description("更多内容请关注后续文件")
                .version(VERSION)
                .build();
    }
}
