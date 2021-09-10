package com.lzctzk.address.pojo.building.controller;
/**
 * @author luozhen
 * @date 2019/2/27 11:41
 * @version V1.0
 * @description
 */

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.lzctzk.address.dao.building.entity.BtLog;
import com.lzctzk.address.dao.building.entity.BtPermission;
import com.lzctzk.address.dao.building.service.IBtPermissionService;
import com.lzctzk.address.pojo.building.servcie.CommonMethod;
import com.lzctzk.address.pojo.building.servcie.LogService;
import com.lzctzk.address.pojo.building.servcie.PermissionService;
import com.lzctzk.address.util.String.StringUtil;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultEnum;
import com.lzctzk.address.util.result.ResultMessage;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * com.lzctzk.address.pojo.building.controller
 *
 * @author Administrator
 * @author luozhen
 * @version V1.0
 * @date 2019/2/27 11:41
 * @description
 */
@Api(tags = "菜单权限控制器")
@RestController
@RequestMapping("Permission")
public class PermissionController {

    private static final Logger log = LoggerFactory.getLogger(PermissionController.class);
    @Autowired
    LogService logService;
    @Autowired
    private IBtPermissionService iBtPermissionService;

    @Autowired
    private PermissionService permissionService;

    @ApiOperation(value = "新增数据")
    @PostMapping(value = "InsertPermission")
    public Result insertPermission(@RequestBody BtPermission btPermission) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", btPermission.toString());
        logService.addLog("新增功能权限");
        if (iBtPermissionService.count() > 0) {
            long id = permissionService.selectMaxID() + 1;
            btPermission.setId(id);
        } else {
            long id = iBtPermissionService.count() + 1;
            btPermission.setId(id);
        }
        if (btPermission.getParentid() == null) {
            long parentId = 0;
            btPermission.setParentid(parentId);
        }
        LocalDateTime nowDate = LocalDateTime.now();
        btPermission.setUpdateTime(nowDate);
        btPermission.setCreateTime(nowDate);
        btPermission.setIsdelete(0);
        btPermission.setPermissionString(StringUtil.randomResourceModeCode());
        if (iBtPermissionService.save(btPermission)) {
            return ResultMessage.success();
        } else {
            return ResultMessage.error();
        }
    }

    @ApiOperation(value = "更新数据")
    @PostMapping(value = "UpdatePermission")
    public Result updatePermission(@RequestBody BtPermission btPermission) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", btPermission.toString());
        logService.addLog("编辑功能权限");
        btPermission.setUpdateTime(LocalDateTime.now());
        if (iBtPermissionService.updateById(btPermission)) {
            return ResultMessage.success();
        } else {
            return ResultMessage.error();
        }
    }

    @ApiOperation(value = "删除单条数据")
    @PostMapping(value = "DeletePermission")
    public Result deletePermission(String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", id);
        logService.addLog("删除编辑权限");
        if (iBtPermissionService.removeById(id)) {
            return ResultMessage.success();
        } else {
            return ResultMessage.error();
        }
    }

    @ApiOperation(value = "删除编辑权限")
    @PostMapping(value = "BatchDeletePermission")
    public Result batchDeletePermission(String batchIDs) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", batchIDs);
        logService.addLog("查询功能权限");
        if (EmptyUtil.isNotEmpty(batchIDs)) {
            String[] ids = CommonMethod.division(batchIDs, ",");
            List<String> idList = Arrays.asList(ids);
            if (iBtPermissionService.removeByIds(idList)) {
                return ResultMessage.success();
            } else {
                return ResultMessage.error();
            }
        }
        return ResultMessage.error();
    }

    @ApiOperation(value = "获取单条数据", notes = "传入数据id，获取单条数据")
    @GetMapping(value = "GetByID")
    public Result getByID(String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("查询功能权限");
        BtPermission result = iBtPermissionService.getById(id);
        if (EmptyUtil.isNotEmpty(result)) {
            return ResultMessage.success(result);
        } else {
            return ResultMessage.error();
        }
    }

    @ApiOperation(value = "动态查询", notes = "传入对象的字段值，根据字段值进行查询")
    @GetMapping(value = "GetByDynamic")
    public Result getByDynamic(BtPermission btPermission, String likeValue) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", btPermission.toString());
        logService.addLog("查询功能权限");
        QueryWrapper<BtPermission> queryWrapper = checkField(btPermission);
        if (EmptyUtil.isNotEmpty(likeValue)) {
            queryWrapper = LikeAllFeild(likeValue);
        }
        List<BtPermission> result = iBtPermissionService.list(queryWrapper);
        long count = result.size();
        return ResultMessage.success(result, count);

    }

    @ApiOperation(value = "检查是否重复")
    @GetMapping(value = "CheckName")
    public Result checkName(String name, String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{},{}", name, id);
        QueryWrapper<BtPermission> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(BtPermission::getName, name);
        List<BtPermission> result = iBtPermissionService.list(queryWrapper);
        for (BtPermission permission : result) {
            if (EmptyUtil.isNotEmpty(id) && permission.getId().equals(id)) {
                result.remove(permission);
            }
        }
        if (result.size() > 0) {
            return ResultMessage.custom(ResultEnum.EXISTERROR, ResultEnum.EXISTERROR.getMsg());
        } else {
            return ResultMessage.success();
        }
    }

    @ApiOperation(value = "根据systemId查询权限树")
    @GetMapping(value = "GetAuthtreeBySystemid")
    public Result getAuthtreeBySystemid(String systemId) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{},{}", systemId);
        QueryWrapper<BtPermission> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(BtPermission::getSystemId, systemId);
        List<BtPermission> listData = iBtPermissionService.list(queryWrapper);
        //拼装树
        Map<String, Object> map = new HashMap<>();
        map.put("list", listData);
        String[] checkedId = new String[]{};
        map.put("checkedId", checkedId);
        return ResultMessage.success(map);
    }

    @ApiOperation(value = "获取权限父级权限")
    @GetMapping(value = "GetByParentMenu")
    public Result getByParentMenu(BtPermission btPermission) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{},{}", btPermission.toString());
        QueryWrapper<BtPermission> queryWrapper = new QueryWrapper<>();
        String level = btPermission.getBpLevel();
        switch (btPermission.getBpType()) {
            case "0": {
                //目录
                break;
            }
            case "1": {
                //一级菜单
                String equalsData = "1";
                if (equalsData.equals(level)) {
                    queryWrapper.lambda().eq(BtPermission::getBpLevel, "0");
                } else {//二级菜单
                    queryWrapper.lambda().eq(BtPermission::getBpType, "1");
                    queryWrapper.lambda().eq(BtPermission::getBpLevel, "1");
                }
                break;
            }
            case "2": {
                //按钮
                queryWrapper.lambda().eq(BtPermission::getBpLevel, "2");
                break;
            }
            default:
        }
        queryWrapper.lambda().eq(BtPermission::getSystemId, btPermission.getSystemId());
        List<BtPermission> result = iBtPermissionService.list(queryWrapper);
        long count = result.size();
        return ResultMessage.success(result, count);
    }

    @ApiOperation(value = "获取权限树的pid")
    @GetMapping(value = "GetTreeSpid")
    public Result getTreeSpid(BtPermission btPermission) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{},{}", btPermission.toString());
        QueryWrapper<BtPermission> queryWrapper = checkField(btPermission);
        List<BtPermission> result = iBtPermissionService.list(queryWrapper);
        long pid = 0;
        if (result.size() == 0) {
            return ResultMessage.success(pid);
        }
        pid = result.get(0).getParentid();
        for (BtPermission permission : result) {
            if (permission.getParentid() != null && pid >= permission.getParentid()) {
                pid = permission.getParentid();
            }
        }
        return ResultMessage.success(pid);
    }

//    @GetMapping(value = "setCode")
//    public Result setCode() {
//        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
//        List<BtPermission> results = iBtPermissionService.list();
//        for (BtPermission result :results){
//            result.setPermissionString(StringUtil.randomResourceModeCode());
//            iBtPermissionService.updateById(result);
//        }
//        return ResultMessage.success();
//    }

    /**
     * 功能描述: 用于查询时拼接查询条件
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019/2/28 20:59
     */
    public QueryWrapper<BtPermission> checkField(BtPermission permission) {
        QueryWrapper<BtPermission> queryWrapper = new QueryWrapper<>();
        if (permission != null) {
            if (EmptyUtil.isNotEmpty(permission.getId())) {
                queryWrapper.lambda().eq(BtPermission::getId, permission.getId());
            }
            if (EmptyUtil.isNotEmpty(permission.getName())) {
                queryWrapper.lambda().like(BtPermission::getName, permission.getName());
            }
            if (EmptyUtil.isNotEmpty(permission.getDisplayName())) {
                queryWrapper.lambda().like(BtPermission::getDisplayName, permission.getDisplayName());
            }
            if (EmptyUtil.isNotEmpty(permission.getSystemId())) {
                queryWrapper.lambda().eq(BtPermission::getSystemId, permission.getSystemId());
            }
        }
        return queryWrapper;
    }

    public QueryWrapper LikeAllFeild(String likeValue) {
        String whereClause = " 1=1";
        QueryWrapper<BtPermission> queryWrapper = new QueryWrapper<>();

        queryWrapper.lambda().or(i -> i.like(BtPermission::getName, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtPermission::getDisplayName, likeValue));
        //queryWrapper.lambda().or(i->i.eq(BtPermission::getId, likeValue));
        //queryWrapper.lambda().or(i->i.like(BtPermission::getParentid, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtPermission::getSystemId, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtPermission::getBpLevel, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtPermission::getIcon, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtPermission::getTitle, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtPermission::getUrl, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtPermission::getBpType, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtPermission::getFullname, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtPermission::getRemark, likeValue));
        queryWrapper.lambda().or(i -> i.eq(BtPermission::getSystemId, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtPermission::getSystemName, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtPermission::getPermissionString, likeValue));
        //queryWrapper.lambda().or(i->i.eq(BtPermission::getParentid, likeValue));
        queryWrapper.lambda().and(i -> i.eq(BtPermission::getIsdelete, 0));

        return queryWrapper;
    }
}
