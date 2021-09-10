package com.lzctzk.address.pojo.building.servcie;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.lzctzk.address.dao.building.entity.PtBuildingType;
import com.lzctzk.address.dao.building.mapper.PtBuildingTypeMapper;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * com.lzctzk.address.pojo.building.servcie
 *
 * @author luozhen
 * @version V1.0
 * @date 2019/2/12 19:17
 * @description
 */
@Service
public class BuildingTypeService {

    private static final Logger log = LoggerFactory.getLogger(BuildingTypeService.class);

    @Autowired
    private PtBuildingTypeMapper ptBuildingTypeMapper;

    public Result getAll() {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        List<PtBuildingType> result = ptBuildingTypeMapper.selectList(null);
        long count = result.size();
        if (count > 0) {
            return ResultMessage.success(result, count);
        } else {
            return ResultMessage.custom(0, "查询数据为空", null, count);
        }
    }

    public Result getBigType() {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        QueryWrapper<PtBuildingType> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(PtBuildingType::getPbtParent, "0");
        queryWrapper.lambda().eq(PtBuildingType::getPbtLevel, 1);
        List<PtBuildingType> result = ptBuildingTypeMapper.selectList(queryWrapper);
        long count = result.size();
        return ResultMessage.success(result, count);
    }

    public Result getOtherType(String pbtParent) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        int level = pbtParent.length() + 1;
        QueryWrapper<PtBuildingType> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().like(PtBuildingType::getPbtParent, pbtParent);
        queryWrapper.lambda().eq(PtBuildingType::getPbtLevel, level);
        List<PtBuildingType> result = ptBuildingTypeMapper.selectList(queryWrapper);
        long count = result.size();
        return ResultMessage.success(result, count);
    }

}
