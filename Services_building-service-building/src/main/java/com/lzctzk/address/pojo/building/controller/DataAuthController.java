package com.lzctzk.address.pojo.building.controller;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.github.pagehelper.PageInfo;
import com.lzctzk.address.dao.building.entity.BtDataAuth;
import com.lzctzk.address.dao.building.service.IBtDataAuthService;
import com.lzctzk.address.pojo.building.servcie.DataAuthService;
import com.lzctzk.address.pojo.building.servcie.LogService;
import com.lzctzk.address.util.date.MapUtil;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultEnum;
import com.lzctzk.address.util.result.ResultMessage;
import io.swagger.annotations.Api;
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
 * <p>
 * 前端控制器
 * </p>
 *
 * @author dengjie
 * @since 2019-02-27
 */
@Api(tags = "三维数据服务控制器")
@RestController
@RequestMapping("/DataAuth")
public class DataAuthController {
    private static final Logger log = LoggerFactory.getLogger(TuserController.class);

    @Autowired
    LogService logService;

    @Autowired
    private IBtDataAuthService iBtDataAuthService;

    @Autowired
    private DataAuthService iDataAuthService;

    @GetMapping("/getAll")
    public Result getAll() {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("查询所有数据权限");
        List<BtDataAuth> result = iBtDataAuthService.list(null);
        PageInfo<BtDataAuth> pageData = new PageInfo<>(result);
        Long count = Long.valueOf(pageData.getTotal());
        if (EmptyUtil.isNotEmpty(result)) {
            return ResultMessage.success(result, count);
        } else {
            return ResultMessage.error();
        }
    }

    @PostMapping("/SaveDataauth")
    public Result saveDataauth(@RequestBody BtDataAuth BtDataAuth) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", BtDataAuth.toString());
        logService.addLog("查询所有数据权限");
        if (BtDataAuth.getId() == null) {
            logService.addLog("新增数据权限");
            LocalDateTime nowTime = LocalDateTime.now();
            if (iBtDataAuthService.count() > 0) {
                BtDataAuth.setId(iDataAuthService.selectMaxID() + 1);
            } else {
                BtDataAuth.setId(Long.valueOf(iBtDataAuthService.count() + 1));
            }
            if (BtDataAuth.getPid() == null) {
                BtDataAuth.setPid(Long.valueOf(0));
            }
            BtDataAuth.setCreateTime(nowTime);
            BtDataAuth.setUpdateTime(nowTime);
            BtDataAuth.setIsdelete(0);
            if (iBtDataAuthService.save(BtDataAuth)) {
                return ResultMessage.success();
            } else {
                return ResultMessage.error();
            }
        } else {
            logService.addLog("更新数据权限");
            if (iBtDataAuthService.updateById(BtDataAuth)) {
                return ResultMessage.success();
            } else {
                return ResultMessage.error();
            }
        }

    }

    @PostMapping("/insertDataauth")
    public Result insertDataauth(@RequestBody BtDataAuth BtDataAuth) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", BtDataAuth.toString());
        logService.addLog("新增数据权限");
        LocalDateTime nowTime = LocalDateTime.now();
        if (iBtDataAuthService.count() > 0) {
            BtDataAuth.setId(iDataAuthService.selectMaxID() + 1);
        } else {
            BtDataAuth.setId(Long.valueOf(iBtDataAuthService.count() + 1));
        }
        if (BtDataAuth.getPid() == null) {
            BtDataAuth.setPid(Long.valueOf(0));
        }
        BtDataAuth.setCreateTime(nowTime);
        BtDataAuth.setUpdateTime(nowTime);
        BtDataAuth.setIsdelete(0);
        if (iBtDataAuthService.save(BtDataAuth)) {
            return ResultMessage.success();
        } else {
            return ResultMessage.error();
        }
    }

    @PostMapping("/UpdateDataauth")
    public Result UpdateDataauth(@RequestBody BtDataAuth BtDataAuth) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", BtDataAuth.toString());
        logService.addLog("更新数据权限");
        if (iBtDataAuthService.updateById(BtDataAuth)) {
            return ResultMessage.success();
        } else {
            return ResultMessage.error();
        }
    }

    @PostMapping("/DeleteDataauth")
    public Result DeleteDataauth(String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", id);
        logService.addLog("删除数据权限");
        if (iBtDataAuthService.removeById(id)) {
            return ResultMessage.success();
        } else {
            return ResultMessage.error();
        }
    }

    @PostMapping("/BatchDeleteDataauth")
    public Result batchDeleteSystem(String BatchIDs) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", BatchIDs);
        logService.addLog("批量删除数据权限");
        String[] ids;
        if (BatchIDs.indexOf(",") == -1) {
            String[] cache = {BatchIDs};
            ids = cache;
        } else {
            ids = BatchIDs.split(",");
        }
        List<String> idList = Arrays.asList(ids);
        if (iBtDataAuthService.removeByIds(idList)) {
            return ResultMessage.success();
        } else {
            return ResultMessage.error();
        }
    }

    @GetMapping("/GetByID")
    public Result GetBySystemID(String id) {
        logService.addLog("查询数据权限");
        if (id == null) {
            return ResultMessage.error();
        }
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        BtDataAuth result = iBtDataAuthService.getById(id);
        if (EmptyUtil.isNotEmpty(result)) {
            return ResultMessage.success(result);
        } else {
            return ResultMessage.error();
        }
    }

    @GetMapping("/GetBydynamic")
    public Result getByDynamic(BtDataAuth BtDataAuth, String likeValue) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", BtDataAuth.toString());
        logService.addLog("分页查询数据权限");
        Map<String, Object> mapList = MapUtil.object2Map(BtDataAuth);
        mapList.remove("serialVersionUID");
        QueryWrapper<BtDataAuth> queryWrapper = checkFeild(BtDataAuth);
        if (EmptyUtil.isNotEmpty(likeValue)) {
            queryWrapper = LikeAllFeild(likeValue);
        }
        //查询
        List<BtDataAuth> result = iBtDataAuthService.list(queryWrapper);
        Long count = Long.valueOf(result.size());

        return ResultMessage.success(result, count);
    }

    @GetMapping("/CheckDataname")
    public Result checkName(String name, String Id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{},{}", name, Id);

        QueryWrapper<BtDataAuth> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("DATA_NAME", name);
        List<BtDataAuth> result = iBtDataAuthService.list(queryWrapper);
        for (BtDataAuth System : result) {
            if (EmptyUtil.isNotEmpty(Id) && System.getId().equals(Id)) {
                result.remove(System);
            }
        }
        if (result.size() > 0) {
            return ResultMessage.custom(ResultEnum.EXISTERROR);
        } else {
            return ResultMessage.success();
        }
    }


    @GetMapping("/GetAuthtreeBySystemid")
    public Result getAuthtreeBySystemid(String systemId) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", systemId);
        logService.addLog("根据系统ID查询所有数据权限");
        QueryWrapper<BtDataAuth> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("SYSTEM_ID", systemId);

        List<BtDataAuth> result = iBtDataAuthService.list(queryWrapper);
        Long count = Long.valueOf(result.size());
        //拼装返回结果
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("list", result);
        String[] checkedId = new String[]{};
        map.put("checkedId", checkedId);
        return ResultMessage.success(map, count);

    }

    @GetMapping("/GetTreeSpid")
    public Result GetTreeSpid(BtDataAuth BtDataAuth, String likeValue) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", BtDataAuth.toString());
        Map<String, Object> mapList = MapUtil.object2Map(BtDataAuth);
        mapList.remove("serialVersionUID");
        QueryWrapper<BtDataAuth> queryWrapper = checkFeild(BtDataAuth);
        if (EmptyUtil.isNotEmpty(likeValue)) {
            queryWrapper = LikeAllFeild(likeValue);
        }
        List<BtDataAuth> result = iBtDataAuthService.list(queryWrapper);

        Long minid = Long.valueOf(0);
        if (result.size() > 0) {
            minid = result.get(0).getPid();
            for (BtDataAuth item : result) {
                if (item.getPid() < minid) {
                    minid = item.getPid();
                }
            }
        }
        Long count = Long.valueOf(result.size());
        return ResultMessage.success(minid, count);
    }

    public QueryWrapper checkFeild(BtDataAuth BtDataAuth) {
        String whereClause = " 1=1";
        QueryWrapper<BtDataAuth> queryWrapper = new QueryWrapper<>();
        if (BtDataAuth != null) {
            if (BtDataAuth.getId() != null && EmptyUtil.isNotEmpty(BtDataAuth.getId())) {
                queryWrapper.eq("ID", BtDataAuth.getId());
            }
            if (BtDataAuth.getDataName() != null && EmptyUtil.isNotEmpty(BtDataAuth.getDataName())) {
                queryWrapper.like("DATA_NAME", BtDataAuth.getDataName());
            }
            if (BtDataAuth.getSystemId() != null && EmptyUtil.isNotEmpty(BtDataAuth.getSystemId())) {
                queryWrapper.eq("SYSTEM_ID", BtDataAuth.getSystemId());
            }
        }
        return queryWrapper;
    }

    public QueryWrapper LikeAllFeild(String likeValue) {
        String whereClause = " 1=1";
        QueryWrapper<BtDataAuth> queryWrapper = new QueryWrapper<>();

        // queryWrapper.lambda().or(i->i.eq(BtDataAuth::getPid, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataAuth::getSystemId, likeValue));
        // queryWrapper.lambda().or(i->i.eq(BtDataAuth::getId, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataAuth::getDataName, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataAuth::getSystemName, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataAuth::getCreateIp, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataAuth::getCreateTime, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataAuth::getCreateUserid, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataAuth::getUpdateIp, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataAuth::getUpdateTime, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataAuth::getUpdateUserid, likeValue));
        queryWrapper.lambda().and(i -> i.eq(BtDataAuth::getIsdelete, 0));
        return queryWrapper;
    }
}
