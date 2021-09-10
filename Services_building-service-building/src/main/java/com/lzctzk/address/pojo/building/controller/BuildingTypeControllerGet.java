package com.lzctzk.address.pojo.building.controller;

import com.lzctzk.address.pojo.building.servcie.BuildingTypeService;
import com.lzctzk.address.util.result.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * com.lzctzk.address.pojo.building.controller
 *
 * @author luozhen
 * @version V1.0
 * @date 2019/2/12 16:26
 * @description
 */
@Api(tags = "建筑物类型数据获取控制器")
@RestController
@RequestMapping("buildingType")
public class BuildingTypeControllerGet {

    private static final Logger log = LoggerFactory.getLogger(BuildingTypeControllerGet.class);

    @Autowired
    private BuildingTypeService buildingTypeService;

    @ApiOperation(value = "获取所有的建筑物类型", notes = "", response = Result.class)
    @GetMapping("getAll")
    public Result getAll() {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        return buildingTypeService.getAll();
    }

    @ApiOperation(value = "获取大类的建筑物类型", notes = "", response = Result.class)
    @GetMapping("getBigType")
    public Result getBigType() {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        return buildingTypeService.getBigType();
    }

    @ApiOperation(value = "根据上一级获取建筑物类型", notes = "", response = Result.class)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "pbtParent", value = "父类编码", required = true, dataType = "String"),
    })
    @GetMapping("getOtherType")
    public Result getOtherType(String pbtParent) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获得的数据：{}", pbtParent);
        return buildingTypeService.getOtherType(pbtParent);
    }
}
