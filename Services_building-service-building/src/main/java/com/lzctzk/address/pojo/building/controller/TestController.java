package com.lzctzk.address.pojo.building.controller;

import com.lzctzk.address.pojo.building.servcie.CountService;
import com.lzctzk.address.util.result.Result;
import io.swagger.annotations.Api;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * com.lzctzk.address.pojo.building.controller
 *
 * @author luozhen
 * @version V1.0
 * @date 2019-3-22 15:37
 * @description
 */
@Api(tags = "测试接口控制器")
@RestController
@RequestMapping("/test")
public class TestController {

    private static final Logger log = LoggerFactory.getLogger(BuildingController.class);

    @Autowired
    private CountService countService;

    @PostMapping(value = "getCount")
    public Result getCount(String columnName) {
        return countService.getCount(columnName);
    }
}
