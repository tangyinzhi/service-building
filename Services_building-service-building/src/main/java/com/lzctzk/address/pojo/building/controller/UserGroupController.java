package com.lzctzk.address.pojo.building.controller;/**
 * @author luozhen
 * @date 2019/2/28 18:14
 * @version V1.0
 * @description
 */

import com.lzctzk.address.dao.building.entity.BtUserGroup;
import com.lzctzk.address.pojo.building.servcie.LogService;
import com.lzctzk.address.pojo.building.servcie.UserGroupService;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultEnum;
import com.lzctzk.address.util.result.ResultMessage;
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
 * @date 2019/2/28 18:14
 * @description
 */
@Api(tags = "用户组控制器")
@RestController
@RequestMapping(value = "userGroup")
public class UserGroupController {

    private static final Logger log = LoggerFactory.getLogger(UserGroupController.class);

    @Autowired
    LogService logService;

    @Autowired
    private UserGroupService userGroupService;

    @ApiOperation(value = "获取所有的数据")
    @GetMapping(value = "getAll")
    public Result getAll() {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("查询用户组");
        return userGroupService.getAll();
    }

    @ApiOperation(value = "保存数据", notes = "判断是否传入id，没有为新增，有为编辑")
    @PostMapping(value = "saveUserGroup")
    public Result saveUserGroup(@RequestBody BtUserGroup userGroup) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", userGroup.toString());

        return userGroupService.save(userGroup);
    }

    @ApiOperation(value = "删除数据", notes = "传入id字符串，若为批量删除，使用逗号拼接")
    @PostMapping(value = "deleteUserGroup")
    public Result deleteUserGroup(String batchIDs) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", batchIDs);
        logService.addLog("删除用户组");
        if (EmptyUtil.isNotEmpty(batchIDs)) {
            return userGroupService.delete(batchIDs);
        } else {
            return ResultMessage.error(ResultEnum.NUllERROR);
        }
    }

    @ApiOperation(value = "获取单条数据", notes = "传入数据id，获取单条数据")
    @GetMapping(value = "getByID")
    public Result getByID(String id) {
        logService.addLog("查询用户组");
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", id);
        if (EmptyUtil.isNotEmpty(id)) {
            return userGroupService.getById(id);
        } else {
            return ResultMessage.error(ResultEnum.NUllERROR);
        }
    }

    @ApiOperation(value = "动态查询（分页）", notes = "传入对象的字段值，根据字段值进行查询")
    @GetMapping(value = "getByDynamicWithPage")
    public Result getByDynamicWithPage(BtUserGroup userGroup, Integer page, Integer limit, String likeValue) {
        logService.addLog("查询用户组");
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", userGroup.toString());
        if ((page == null) || (limit == null)) {
            page = 1;
            limit = 10;
        }
        return userGroupService.getByDynamicWithPage(userGroup, page, limit, likeValue);
    }

    @ApiOperation(value = "检查是否重复")
    @GetMapping("CheckGroupName")
    public Result checkGroupName(String name, String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{},{}", name, id);
        if (EmptyUtil.isNotEmpty(name)) {
            return userGroupService.checkGroupName(name, id);
        } else {
            return ResultMessage.error(ResultEnum.NUllERROR);
        }

    }


}
