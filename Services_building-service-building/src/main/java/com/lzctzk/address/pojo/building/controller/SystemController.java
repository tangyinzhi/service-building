package com.lzctzk.address.pojo.building.controller;/**
 * @author luozhen
 * @date 2019/2/26 16:33
 * @version V1.0
 * @description
 */

import com.lzctzk.address.dao.building.entity.BtSystem;
import com.lzctzk.address.pojo.building.servcie.SystemService;
import com.lzctzk.address.util.result.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * com.lzctzk.address.pojo.building.controller
 *
 * @author Administrator
 * @author luozhen
 * @version V1.0
 * @date 2019/2/26 16:33
 * @description
 */
@Api(tags = "系统控制器")
@RestController
@RequestMapping("System")
public class SystemController {
    private static final Logger log = LoggerFactory.getLogger(SystemController.class);

    @Autowired
    private SystemService systemService;

    @ApiOperation(value = "获取所有值")
    @GetMapping("getAll")
    public Result getAll() {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        return systemService.getAll();
    }

    @ApiOperation(value = "新增数据")
    @PostMapping("InsertSystem")
    public Result insertSystem(@RequestBody BtSystem btSystem) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", btSystem.toString());
        return systemService.save(btSystem);
    }

    @ApiOperation(value = "更新数据")
    @PostMapping("UpdateSystem")
    public Result updateSystem(@RequestBody BtSystem btSystem) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", btSystem.toString());
        return systemService.save(btSystem);
    }

    @ApiOperation(value = "删除单条数据")
    @PostMapping("DeleteSystem")
    public Result deleteSystem(String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", id);
        return systemService.delete(id);
    }

    @ApiOperation(value = "删除多条数据")
    @PostMapping("BatchDeleteSystem")
    public Result batchDeleteSystem(String batchIDs) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", batchIDs);
        return systemService.delete(batchIDs);
    }

    @ApiOperation(value = "获取单条数据", notes = "传入数据id，获取单条数据")
    @GetMapping("GetBySystemID")
    public Result getBySystemID(String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", id);
        return systemService.getBySystemID(id);
    }

    @ApiOperation(value = "动态查询（分页）", notes = "传入对象的字段值，根据字段值进行查询")
    @GetMapping("GetByDynamicWithPage")
    public Result getByDynamic(BtSystem btSystem, Integer page, Integer limit, String likeValue) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", btSystem.toString());
        return systemService.getByDynamic(btSystem, page, limit, likeValue);
    }

    @ApiOperation(value = "检查是否重复")
    @GetMapping("CheckName")
    public Result checkName(String name, String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{},{}", name, id);
        return systemService.checkName(name, id);
    }

    @ApiOperation(value = "获取系统树")
    @GetMapping("GetSystemTree")
    public Result getSystemTree() {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        return systemService.getSystemTree();
    }
}
