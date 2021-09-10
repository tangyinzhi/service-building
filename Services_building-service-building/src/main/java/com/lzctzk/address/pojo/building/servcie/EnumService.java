package com.lzctzk.address.pojo.building.servcie;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lzctzk.address.dao.building.entity.PtEnum;
import com.lzctzk.address.dao.building.mapper.PtEnumMapper;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultEnum;
import com.lzctzk.address.util.result.ResultMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * com.lzctzk.address.pojo.building.servcie
 *
 * @author luozhen
 * @version V1.0
 * @date 2019/3/3 09:45
 * @description
 */
@Service
public class EnumService {

    private static final Logger log = LoggerFactory.getLogger(EnumService.class);

    @Autowired
    private PtEnumMapper ptEnumMapper;
    @Autowired
    LogService logService;

    /**
     * 功能描述: 获取所有数据
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:56
     */
    public Result getAll() {
        logService.addLog("查询字段值");

        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        List<PtEnum> result = ptEnumMapper.selectList(null);
        long count = result.size();
        if (count > 0) {
            return ResultMessage.success(result, count);
        } else {
            return ResultMessage.custom(0, "查询数据为空", null, count);
        }
    }

    /**
     * 功能描述: 用于动态查询条件设置
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:56
     */
    private QueryWrapper<PtEnum> checkField(PtEnum ptEnum) {
        QueryWrapper<PtEnum> queryWrapper = new QueryWrapper<>();
        if (EmptyUtil.isNotEmpty(ptEnum.getPeId())) {
            queryWrapper.lambda().eq(PtEnum::getPeId, ptEnum.getPeId());
        }
        if (EmptyUtil.isNotEmpty(ptEnum.getPeName())) {
            queryWrapper.lambda().like(PtEnum::getPeName, ptEnum.getPeName());
        }
        if (EmptyUtil.isNotEmpty(ptEnum.getPeTable())) {
            queryWrapper.lambda().like(PtEnum::getPeTable, ptEnum.getPeTable());
        }
        if (EmptyUtil.isNotEmpty(ptEnum.getPeTableName())) {
            queryWrapper.lambda().like(PtEnum::getPeTableName, ptEnum.getPeTableName());
        }
        if (EmptyUtil.isNotEmpty(ptEnum.getPeParameter())) {
            queryWrapper.lambda().like(PtEnum::getPeParameter, ptEnum.getPeParameter());
        }
        if (EmptyUtil.isNotEmpty(ptEnum.getPeParameterName())) {
            queryWrapper.lambda().like(PtEnum::getPeParameterName, ptEnum.getPeParameterName());
        }
        if (EmptyUtil.isNotEmpty(ptEnum.getPeBz())) {
            queryWrapper.lambda().like(PtEnum::getPeBz, ptEnum.getPeBz());
        }
        return queryWrapper;
    }

    /**
     * 功能描述: 动态查询
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:54
     */
    public Result getByDynamic(PtEnum ptEnum) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("查询字段值");
        QueryWrapper<PtEnum> queryWrapper = checkField(ptEnum);
        List<PtEnum> result = ptEnumMapper.selectList(queryWrapper);
        long count = result.size();
        if (count > 0) {
            return ResultMessage.success(result, count);
        } else {
            return ResultMessage.custom(0, "查询数据为空", null, count);
        }
    }

    /**
     * 功能描述: 动态查询（分页）
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:55
     */
    public Result getByDynamicPage(PtEnum ptEnum, Integer page, Integer limit, String likeValue) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("查询字段值");
        Page<PtEnum> pageData = new Page<>(page, limit);
        QueryWrapper<PtEnum> queryWrapper = checkField(ptEnum);
        if (EmptyUtil.isNotEmpty(likeValue)) {
            queryWrapper = LikeAllFeild(likeValue);
        }
        IPage<PtEnum> result = ptEnumMapper.selectPage(pageData, queryWrapper);
        Object data = result.getRecords();
        long count = result.getTotal();
        if (count > 0) {
            return ResultMessage.success(data, count);
        } else {
            return ResultMessage.custom(0, "查询数据为空", null, count);
        }
    }


    /**
     * 验证是否为重复数据,并新增数据
     *
     * @param ptEnum
     * @return
     */
    private Result validationForAdd(PtEnum ptEnum) {
        QueryWrapper<PtEnum> queryWrapper = new QueryWrapper<>();
        if (EmptyUtil.isNotEmpty(ptEnum.getPeName())) {
            queryWrapper.lambda().eq(PtEnum::getPeName, ptEnum.getPeName());
        } else {
            return ResultMessage.custom(-1, "枚举名称为空", null, 0);
        }
        if (EmptyUtil.isNotEmpty(ptEnum.getPeTable())) {
            queryWrapper.lambda().eq(PtEnum::getPeTable, ptEnum.getPeTable());
        } else {
            return ResultMessage.custom(-1, "对应表为空", null, 0);
        }
        if (EmptyUtil.isNotEmpty(ptEnum.getPeParameter())) {
            queryWrapper.lambda().eq(PtEnum::getPeParameter, ptEnum.getPeParameter());
        } else {
            return ResultMessage.custom(-1, "对应字段为空", null, 0);
        }
        List<PtEnum> validationData = ptEnumMapper.selectList(queryWrapper);
        if (validationData.size() > 0) {
            return ResultMessage.error(ResultEnum.EXISTERROR);
        } else {
            int result = ptEnumMapper.insert(ptEnum);
            if (result > 0) {
                return ResultMessage.success(null, result);
            } else {
                return ResultMessage.error(ResultEnum.ADDERROR);
            }
        }
    }

    /**
     * 功能描述: 保存数据
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:55
     */
    public Result save(PtEnum ptEnum) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        LocalDateTime nowDate = LocalDateTime.now();
        int result;
        ptEnum.setPeUpdateTime(nowDate);
        if (EmptyUtil.isEmpty(ptEnum.getPeId())) {
            logService.addLog("编辑字段值");
            //新增数据
            ptEnum.setPeIsdelete(0);
            ptEnum.setPeAddTime(nowDate);
            //验证重复保存
            return validationForAdd(ptEnum);
        } else {
            logService.addLog("更新字段值");
            //修改数据
            result = ptEnumMapper.updateById(ptEnum);
            if (result > 0) {
                return ResultMessage.success(null, result);
            } else {
                return ResultMessage.error(ResultEnum.UPDATEEROR);
            }
        }
    }

    /**
     * 功能描述: 删除数据
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:55
     */
    public Result delete(String batchIds) {
        logService.addLog("删除字段值");
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        List<String> idList = CommonMethod.divisionToList(batchIds, ",");
        int result = ptEnumMapper.deleteBatchIds(idList);
        if (result > 0) {
            return ResultMessage.success(null, result);
        } else {
            return ResultMessage.error(ResultEnum.DELETEERROR);
        }
    }

    public QueryWrapper LikeAllFeild(String likeValue) {
        QueryWrapper<PtEnum> queryWrapper = new QueryWrapper<>();

        queryWrapper.lambda().or(i -> i.like(PtEnum::getPeName, likeValue));
        queryWrapper.lambda().or(i -> i.like(PtEnum::getPeParameter, likeValue));
        queryWrapper.lambda().or(i -> i.eq(PtEnum::getPeId, likeValue));
        queryWrapper.lambda().or(i -> i.like(PtEnum::getPeTable, likeValue));
        queryWrapper.lambda().or(i -> i.like(PtEnum::getPeBz, likeValue));
        queryWrapper.lambda().or(i -> i.like(PtEnum::getPeParameterName, likeValue));
        queryWrapper.lambda().or(i -> i.like(PtEnum::getPeAddTime, likeValue));
        queryWrapper.lambda().or(i -> i.like(PtEnum::getPeAddTime, likeValue));
        queryWrapper.lambda().or(i -> i.like(PtEnum::getPeUpdateTime, likeValue));
        queryWrapper.lambda().and(i -> i.eq(PtEnum::getPeIsdelete, 0));

        return queryWrapper;
    }
}
