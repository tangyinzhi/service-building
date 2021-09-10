package com.lzctzk.address.pojo.building.controller;/**
 * @author luozhen
 * @date 2019/2/26 16:33
 * @version V1.0
 * @description
 */

import com.lzctzk.address.dao.building.entity.BtLog;
import com.lzctzk.address.pojo.building.servcie.LogService;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * com.lzctzk.address.pojo.building.controller
 *
 * @author luozhen
 * @version V1.0
 * @date 2019/2/26 16:33
 * @description
 */
@Api(tags = "日志控制器")
@RestController
@RequestMapping("Log")
public class LogController {
    private static final Logger log = LoggerFactory.getLogger(LogController.class);

    @Autowired
    private LogService logService;

    @Autowired
    HttpServletRequest req;

//    @ApiOperation(value = "获取所有值")
//    @GetMapping("getAll")
//    public Result getAll() {
//        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
//        return systemService.getAll();
//    }
//
//    @ApiOperation(value = "新增数据")
//    @PostMapping("InsertSystem")
//    public Result insertSystem(@RequestBody BtSystem btSystem) {
//        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
//        log.info("获取的数据：{}", btSystem.toString());
//        return systemService.save(btSystem);
//    }
//
//    @ApiOperation(value = "更新数据")
//    @PostMapping("UpdateSystem")
//    public Result updateSystem(@RequestBody BtSystem btSystem) {
//        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
//        log.info("获取的数据：{}", btSystem.toString());
//        return systemService.save(btSystem);
//    }
//
//    @ApiOperation(value = "删除单条数据")
//    @PostMapping("DeleteSystem")
//    public Result deleteSystem(String id) {
//        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
//        log.info("获取的数据：{}", id);
//        return systemService.delete(id);
//    }
//
//
//
//    @ApiOperation(value = "获取单条数据", notes = "传入数据id，获取单条数据")
//    @GetMapping("GetBySystemID")
//    public Result getBySystemID(String id) {
//        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
//        log.info("获取的数据：{}", id);
//        return systemService.getBySystemID(id);
//    }

    @ApiOperation(value = "动态查询（分页）", notes = "传入对象的字段值，根据字段值进行查询")
    @GetMapping("GetByDynamicWithPage")
    public Result getByDynamic(BtLog btLog, Integer page, Integer limit, String likeValue) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", btLog.toString());
        return logService.getByDynamic(btLog, page, limit, likeValue);
    }


    @ApiOperation(value = "日志统计")
    @GetMapping("GetTolCount")
    public Result GetTolCount(String clown, String strWhere) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        return logService.getTolCount(clown, strWhere);
    }

    @ApiOperation(value = "日志添加")
    @PostMapping("addLog")
    public Result addLog(@RequestBody Map<String, Object> map) {
        String msg = null;
        if (EmptyUtil.isNotEmpty(map.get("msg"))) {
            msg = map.get("msg").toString();
        }
        String logType = null;

        if (EmptyUtil.isNotEmpty(map.get("logType"))) {
            logType = map.get("logType").toString();
        }
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        if (EmptyUtil.isEmpty(logType)) {
            logType = "信息";
        }
        return logService.addLog(msg, logType);
    }
}
