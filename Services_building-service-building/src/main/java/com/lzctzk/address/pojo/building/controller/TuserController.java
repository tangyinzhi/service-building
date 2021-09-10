package com.lzctzk.address.pojo.building.controller;

import com.alibaba.fastjson.JSONObject;
import com.lzctzk.address.dao.building.entity.BtUser;
import com.lzctzk.address.dao.building.service.IBtUserService;
import com.lzctzk.address.pojo.building.entity.Oauth2Property;
import com.lzctzk.address.pojo.building.servcie.LogService;
import com.lzctzk.address.pojo.building.servcie.TuserService;
import com.lzctzk.address.util.IP.IpUtil;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultEnum;
import com.lzctzk.address.util.result.ResultMessage;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

/**
 * com.lzctzk.address.pojo.building.controller
 *
 * @author luozhen
 * @version V1.0
 * @date 2019/2/25 10:58
 * @description
 */
@Api(tags = "用户控制器")
@RestController
@RequestMapping("Tuser")
public class TuserController {

    private static final Logger log = LoggerFactory.getLogger(TuserController.class);
    private final Oauth2Property oauth2Property;
    @Autowired
    private TuserService userService;
    @Autowired
    private IBtUserService iuserService;

    @Autowired
    LogService logService;

    public TuserController(Oauth2Property oauth2Property) {
        this.oauth2Property = oauth2Property;
    }


    @ApiOperation(value = "新增数据")
    @PostMapping(value = "InsertUser")
    public Result insertUser(@RequestBody BtUser btUser) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", btUser.toString());
        return userService.save(btUser);
    }

    @ApiOperation(value = "更新数据")
    @PostMapping(value = "UpdateUser")
    public Result updateUser(@RequestBody BtUser btUser) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", btUser.toString());
        return userService.save(btUser);
    }

    @ApiOperation(value = "删除单条数据")
    @PostMapping(value = "DeleteUser")
    public Result deleteUser(String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", id);
        if (EmptyUtil.isNotEmpty(id)) {
            return userService.delete(id);
        } else {
            return ResultMessage.error(ResultEnum.NUllERROR);
        }

    }

    @ApiOperation(value = "批量删除数据")
    @PostMapping(value = "BatchDeleteUser")
    public Result batchDeleteUser(String batchIDs) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", batchIDs);
        if (EmptyUtil.isNotEmpty(batchIDs)) {
            return userService.delete(batchIDs);
        } else {
            return ResultMessage.error(ResultEnum.NUllERROR);
        }

    }

    @ApiOperation(value = "批量修改状态")
    @PostMapping(value = "BatchUpdateStatus")
    public Result batchUpdateStatus(String batchIDs, String enable) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{},{}", batchIDs, enable);
        if (EmptyUtil.isNotEmpty(batchIDs) && EmptyUtil.isNotEmpty(enable)) {
            return userService.batchUpdateStatus(batchIDs, enable);
        } else {
            return ResultMessage.error(ResultEnum.NUllERROR);
        }
    }

    @ApiOperation(value = "获取单条数据", notes = "传入数据id，获取单条数据")
    @GetMapping(value = "GetByID")
    public Result getByID(String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", id);
        if (EmptyUtil.isNotEmpty(id)) {
            return userService.getById(id);
        } else {
            return ResultMessage.error(ResultEnum.NUllERROR);
        }
    }

    @ApiOperation(value = "动态查询（分页）", notes = "传入对象的字段值，根据字段值进行查询")
    @GetMapping(value = "GetByDynamicWithPage")
    public Result getByDynamicWithPage(BtUser btUser, Integer page, Integer limit, String likeValue) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", btUser.toString());
        if ((page == null) || (limit == null)) {
            page = 1;
            limit = 10;
        }
        return userService.getByDynamicWithPage(btUser, page, limit, likeValue);
    }

    @ApiOperation(value = "检查是否重复")
    @GetMapping(value = "CheckName")
    public Result checkName(String name, String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{},{}", name, id);
        if (EmptyUtil.isNotEmpty(name)) {
            return userService.checkName(name, id);
        } else {
            return ResultMessage.error(ResultEnum.NUllERROR);
        }
    }

    @ApiOperation(value = "根据用户ID和系统ID查询权限")
    @GetMapping(value = "GetAuthoritByUserId")
    public Result getGetAuthoritByUserId(String id, String systemId) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{},{}", id, systemId);
        if (EmptyUtil.isNotEmpty(id) && EmptyUtil.isNotEmpty(systemId)) {
            return userService.getGetAuthoritByUserId(id, systemId);
        } else {
            return ResultMessage.error(ResultEnum.NUllERROR);
        }

    }

    /*@ApiOperation(value = "验证用户登录")
    @PostMapping(value = "login")
    public Result login(@RequestBody BtUser btUser) {
        String remoteAddr = IpUtil.getIpAddr();

        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{},{}", btUser.toString());
        Result result = userService.login(btUser);
        logService.addLog("用户登陆");
        return result;
    }*/
    @ApiOperation(value = "验证用户登录")
    @PostMapping(value = "login")
    public Result login() {

        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        BtUser btUser = new BtUser();
        Result result = userService.login(btUser);
        logService.addLog("用户登陆");
        return result;
    }


}
