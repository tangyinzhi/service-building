package com.lzctzk.address.pojo.building.servcie;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lzctzk.address.dao.building.entity.BtSystem;
import com.lzctzk.address.dao.building.mapper.BtSystemMapper;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultEnum;
import com.lzctzk.address.util.result.ResultMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

/**
 * com.lzctzk.address.pojo.building.servcie
 *
 * @author luozhen
 * @version V1.0
 * @date 2019/3/1 18:02
 * @description
 */
@Service
public class SystemService {

    public static final Logger log = LoggerFactory.getLogger(SystemService.class);

    @Autowired
    LogService logService;
    @Autowired
    private BtSystemMapper btSystemMapper;

    public Result getAll() {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("查询系统");
        List<BtSystem> result = btSystemMapper.selectList(null);
        long count = result.size();
        if (count > 0) {
            return ResultMessage.success(result, count);
        } else {
            return ResultMessage.custom(0, "查询数据为空", null, count);
        }
    }

    public Result save(BtSystem btSystem) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        LocalDateTime nowTime = LocalDateTime.now();
        int result;
        if (EmptyUtil.isEmpty(btSystem.getSystemid())) {
            //新增数据
            logService.addLog("新增系统");
            btSystem.setCreatetime(nowTime);
            btSystem.setUpdatetime(nowTime);
            btSystem.setIsdelete(0);
            result = btSystemMapper.insert(btSystem);
            if (result > 0) {
                return ResultMessage.success(null, result);
            } else {
                return ResultMessage.error(ResultEnum.ADDERROR);
            }
        } else {
            logService.addLog("编辑系统");
            //修改数据
            btSystem.setUpdatetime(nowTime);
            result = btSystemMapper.updateById(btSystem);
            if (result > 0) {
                return ResultMessage.success(null, result);
            } else {
                return ResultMessage.error(ResultEnum.UPDATEEROR);
            }
        }
    }

    public Result delete(String batchIds) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("删除系统");
        List<String> idList = CommonMethod.divisionToList(batchIds, ",");
        int result = btSystemMapper.deleteBatchIds(idList);
        if (result > 0) {
            return ResultMessage.success(null, result);
        } else {
            return ResultMessage.error(ResultEnum.DELETEERROR);
        }
    }

    public Result getBySystemID(String id) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("查询系统");
        BtSystem result = btSystemMapper.selectById(id);
        if (EmptyUtil.isNotEmpty(result)) {
            return ResultMessage.success(result, 1);
        } else {
            return ResultMessage.error(ResultEnum.SELECTERROR);
        }
    }

    public Result getByDynamic(BtSystem btSystem, Integer page, Integer limit, String likeValue) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("查询系统");
        if ((page == null) || (limit == null)) {
            page = 1;
            limit = 10;
        }
        Page<BtSystem> pageData = new Page<>(page, limit);
        QueryWrapper<BtSystem> queryWrapper = checkField(btSystem);
        if (EmptyUtil.isNotEmpty(likeValue)) {
            queryWrapper = LikeAllFeild(likeValue);
        }
        IPage<BtSystem> result = btSystemMapper.selectPage(pageData, queryWrapper);
        Object data = result.getRecords();
        long count = result.getTotal();
        if (count > 0) {
            return ResultMessage.success(data, count);
        } else {
            return ResultMessage.custom(0, "查询数据为空", null, count);
        }
    }

    /**
     * 功能描述: 用于查询时拼接查询条件
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019/2/28 20:59
     */
    private QueryWrapper<BtSystem> checkField(BtSystem system) {
        QueryWrapper<BtSystem> queryWrapper = new QueryWrapper<>();
        if (EmptyUtil.isNotEmpty(system.getSystemid())) {
            queryWrapper.lambda().eq(BtSystem::getSystemid, system.getSystemid());
        }
        if (EmptyUtil.isNotEmpty(system.getSystemname())) {
            queryWrapper.lambda().like(BtSystem::getSystemname, system.getSystemname());
        }
        if (EmptyUtil.isNotEmpty(system.getDescription())) {
            queryWrapper.lambda().like(BtSystem::getDescription, system.getDescription());
        }
        if (EmptyUtil.isNotEmpty(system.getCreateuserid())) {
            queryWrapper.lambda().eq(BtSystem::getCreateuserid, system.getCreateuserid());
        }
        return queryWrapper;
    }

    public QueryWrapper LikeAllFeild(String likeValue) {
        String whereClause = " 1=1";
        QueryWrapper<BtSystem> queryWrapper = new QueryWrapper<>();

        queryWrapper.lambda().or(i -> i.like(BtSystem::getSystemname, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtSystem::getCreateuserid, likeValue));
        queryWrapper.lambda().or(i -> i.eq(BtSystem::getSystemid, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtSystem::getDescription, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtSystem::getCreateip, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtSystem::getCreatetime, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtSystem::getUpdateip, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtSystem::getUpdatetime, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtSystem::getUpdateuserid, likeValue));
        queryWrapper.lambda().and(i -> i.eq(BtSystem::getIsdelete, 0));

        return queryWrapper;
    }

    public Result checkName(String name, String id) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        QueryWrapper<BtSystem> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(BtSystem::getSystemname, name);
        List<BtSystem> result = btSystemMapper.selectList(queryWrapper);
        for (int i = 0; i < result.size(); i++) {
            BtSystem user = result.get(i);
            if (EmptyUtil.isNotEmpty(id) && user.getSystemid().equals(id)) {
                result.remove(user);
            }
        }
        if (result.size() > 0) {
            return ResultMessage.custom(ResultEnum.EXISTERROR, ResultEnum.EXISTERROR.getMsg());
        } else {
            return ResultMessage.success();
        }
    }

    public Result getSystemTree() {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        Map<String, Object> map = new HashMap<>();
        map.put("id", 0);
        map.put("name", "系统名称");
        map.put("pid", 0);
        logService.addLog("获取系统树");
        List<BtSystem> data = btSystemMapper.selectList(null);
        List<Map> childrenData = new ArrayList<>();
        for (BtSystem system : data) {
            Map<String, Object> cacheData = new HashMap<>();
            cacheData.put("id", system.getSystemid());
            cacheData.put("name", system.getSystemname());
            cacheData.put("pid", 0);
            childrenData.add(cacheData);
        }
        map.put("children", childrenData);
        return ResultMessage.success(map);
    }
}