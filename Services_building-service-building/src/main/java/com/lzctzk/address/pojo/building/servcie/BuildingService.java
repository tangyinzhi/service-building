package com.lzctzk.address.pojo.building.servcie;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lzctzk.address.dao.building.entity.BuildAtt;
import com.lzctzk.address.dao.building.entity.OtBuilding;
import com.lzctzk.address.dao.building.entity.RelaAttachBuilding;
import com.lzctzk.address.dao.building.mapper.BuildAttMapper;
import com.lzctzk.address.dao.building.mapper.OtBuildingMapper;
import com.lzctzk.address.dao.building.mapper.RelaAttachBuildingMapper;
import com.lzctzk.address.pojo.building.entity.Building;
import com.lzctzk.address.pojo.building.entity.MyProps;
import com.lzctzk.address.pojo.building.mapper.AttachBuildingMapper;
import com.lzctzk.address.pojo.building.mapper.ColumnsCommentsMapper;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.jackson.JsonUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultEnum;
import com.lzctzk.address.util.result.ResultMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * com.lzctzk.address.pojo.building.servcie
 *
 * @author luozhen
 * @version V1.0
 * @date 2019/3/3 11:21
 * @description
 */
@Service
public class BuildingService {

    private static final Logger log = LoggerFactory.getLogger(BuildingService.class);

    @Autowired
    private OtBuildingMapper otBuildingMapper;

    @Autowired
    private BuildAttMapper buildAttMapper;

    @Autowired
    private RelaAttachBuildingMapper relaAttachBuildingMapper;
    @Autowired
    private ColumnsCommentsMapper columnsCommentsMapper;

    @Autowired
    private AttachBuildingMapper attachBuildingMapper;

    @Autowired
    private MyProps myProps;

    @Autowired
    LogService logService;

    public Result getAll() {
        logService.addLog("查询建筑物属性");
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        QueryWrapper<OtBuilding> otBuildingQueryWrapper = checkFieldOtBuilding(new Building());
        QueryWrapper<BuildAtt> buildAttQueryWrapper = checkFieldBulidAtt(new Building());
        List<String> list = columnsCommentsMapper.selectColumnNameS("Y");
        String[] array = list.toArray(new String[list.size()]);
        otBuildingQueryWrapper.select(array);
        buildAttQueryWrapper.select(array);

        //List<OtBuilding> otBuildingList = otBuildingMapper.selectList(otBuildingQueryWrapper);
        //List<BuildAtt> buildAttList = buildAttMapper.selectList(buildAttQueryWrapper);
        List<Map<String, Object>> resultEdit = otBuildingMapper.selectMaps(otBuildingQueryWrapper);
        List<Map<String, Object>> resultSave = buildAttMapper.selectMaps(buildAttQueryWrapper);
//        List<BuildAtt> resultEdit = buildAttMapper.selectList(null);
//        List<OtBuilding> resultSave = otBuildingMapper.selectList(null);
        List<Object> result = new ArrayList<>();
        result.addAll(resultEdit);
        result.addAll(resultSave);
        long count = result.size();
        if (count > 0) {
            return ResultMessage.success(result, count);
        } else {
            return ResultMessage.custom(0, "查询数据为空", null, count);
        }
    }

    public Result getBySelect(Building building) {
        logService.addLog("查询建筑物属性");
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        QueryWrapper<OtBuilding> otBuildingQueryWrapper = checkFieldOtBuilding(building);
        QueryWrapper<BuildAtt> buildAttQueryWrapper = checkFieldBulidAtt(building);

        List<String> list = columnsCommentsMapper.selectColumnNameS("Y");

        String[] array = list.toArray(new String[list.size()]);
        otBuildingQueryWrapper.select(array);
        array = list.toArray(new String[list.size()]);
        buildAttQueryWrapper.select(array);

        //List<OtBuilding> otBuildingList = otBuildingMapper.selectList(otBuildingQueryWrapper);
        //List<BuildAtt> buildAttList = buildAttMapper.selectList(buildAttQueryWrapper);
        List<Map<String, Object>> otBuildingList = otBuildingMapper.selectMaps(otBuildingQueryWrapper);
        List<Map<String, Object>> buildAttList = buildAttMapper.selectMaps(buildAttQueryWrapper);
        List<Object> result = new ArrayList<>();
        result.addAll(otBuildingList);
        result.addAll(buildAttList);
        long count = result.size();
        if (count > 0) {
            return ResultMessage.success(result, count);
        } else {
            return ResultMessage.custom(0, "查询数据为空", null, count);
        }
    }

    /**
     * 功能描述: 丰富数据
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019/3/4 9:22
     */
    private BuildAtt rich(BuildAtt buildAtt) {
        LocalDateTime nowDate = LocalDateTime.now();
        buildAtt.setObUpdateTime(nowDate);
        if (EmptyUtil.isEmpty(buildAtt.getObAddTime())) {
            buildAtt.setObAddTime(nowDate);
        }
        if (EmptyUtil.isEmpty(buildAtt.getObIsdelete())) {
            buildAtt.setObIsdelete(0);
        }
        /*if (EmptyUtil.isEmpty(building.getObBz())) {
            String bz = "无";
            building.setObBz(bz);
        }*/
        return buildAtt;
    }

    /**
     * 功能描述: 丰富数据
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019/3/4 9:23
     */
    private OtBuilding rich(OtBuilding otBuilding) {
        LocalDateTime nowDate = LocalDateTime.now();
        otBuilding.setObUpdateTime(nowDate);
        if (EmptyUtil.isEmpty(otBuilding.getObAddTime())) {
            otBuilding.setObAddTime(nowDate);
        }
        if (EmptyUtil.isEmpty(otBuilding.getObIsdelete())) {
            otBuilding.setObIsdelete(0);
        }
        if (EmptyUtil.isEmpty(otBuilding.getObBz())) {
            String bz = "无";
            otBuilding.setObBz(bz);
        }
        return otBuilding;
    }

    public Result save(OtBuilding otBuilding) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        Map<String, Object> result = new HashMap<>();
        //1 丰富数据
        otBuilding = rich(otBuilding);
        //2 保存数据
        if (EmptyUtil.isEmpty(otBuilding.getObId())) {
            int objectID = attachBuildingMapper.selectMaxObjectId();
            Double objectId = objectID + 1.0;
            otBuilding.setObjectid(-objectId);
            int num = otBuildingMapper.insert(otBuilding);
            if (num > 0) {
                String id = otBuilding.getObId();
                log.info("生成的ID：{}", id);
                result.put("OB_BUILDING", "建筑物属性表新增成功");
                result.put("num", num);
                if (EmptyUtil.isNotEmpty(otBuilding.getObDrawingPath()) || EmptyUtil.isNotEmpty(otBuilding.getObGeologyInfo())) {
                    BuildAtt buildAtt = new BuildAtt();
                    buildAtt.setObDrawingPath(otBuilding.getObDrawingPath());
                    buildAtt.setObGeologyInfo(otBuilding.getObGeologyInfo());
                    buildAtt.setObId(otBuilding.getObId());
                    int count = updateRela(buildAtt);
                    result.put("关联表(RELA_PARKING_ATTACH)更新数据条数", count);
                }
            } else {
                result.put("OB_BUILDING", "建筑物属性表新增失败");
                result.put("num", 0);
                return ResultMessage.error(ResultEnum.UPDATEEROR);
            }
        } else {
            int num = otBuildingMapper.updateById(otBuilding);
            if (num > 0) {
                result.put("OB_BUILDING", "建筑物属性表修改成功");
                result.put("num", num);
                if (EmptyUtil.isNotEmpty(otBuilding.getObDrawingPath()) || EmptyUtil.isNotEmpty(otBuilding.getObGeologyInfo())) {
                    String jsonData = JsonUtil.objectToJson(otBuilding);
                    BuildAtt buildAtt = JsonUtil.jsonToClass(jsonData, BuildAtt.class);
                    int count = updateRela(buildAtt);
                    result.put("关联表(RELA_PARKING_ATTACH)更新数据条数", count);
                }
            } else {
                result.put("OB_BUILDING", "建筑物属性表修改失败");
                result.put("num", 0);
                return ResultMessage.error(ResultEnum.UPDATEEROR);
            }
        }
        return ResultMessage.success(result);
    }

    public Result save(BuildAtt buildAtt) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        Map<String, Object> result = new HashMap<>();
        //1 丰富数据
        buildAtt = rich(buildAtt);
        //2 保存数据
        int num = buildAttMapper.updateById(buildAtt);
        if (num > 0) {
            result.put("BUILD_ATT", "建筑物属性表修改成功");
            result.put("num", num);
            int count = updateRela(buildAtt);
            result.put("关联表(RELA_PARKING_ATTACH)更新数据条数", count);
        } else {
            result.put("BUILD_ATT", "建筑物属性表修改失败");
            result.put("num", 0);
            return ResultMessage.error(ResultEnum.UPDATEEROR);
        }
        return ResultMessage.success(result);
    }

    /**
     * 功能描述: 更新中间关联表
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019/3/4 14:57
     */
    private int updateRela(BuildAtt buildAtt) {
        int deleteNum = 0;
        if (EmptyUtil.isNotEmpty(buildAtt.getObId())) {
            deleteNum = removeRela(buildAtt.getObId());
        }
        int count = 0;
        String[] attachIds;
        LocalDateTime nowDate = LocalDateTime.now();
        if (EmptyUtil.isNotEmpty(buildAtt.getObDrawingPath())) {
            attachIds = buildAtt.getObDrawingPath().split(",");
            for (String attachId : attachIds) {
                RelaAttachBuilding relaAttachBuilding = new RelaAttachBuilding();
                relaAttachBuilding.setRabLastTime(nowDate);
                relaAttachBuilding.setRabOaId(attachId);
                relaAttachBuilding.setRabObId(buildAtt.getObId());
                count += relaAttachBuildingMapper.insert(relaAttachBuilding);
            }
        }
        if (EmptyUtil.isNotEmpty(buildAtt.getObGeologyInfo())) {
            attachIds = buildAtt.getObGeologyInfo().split(",");
            for (String attachId : attachIds) {
                RelaAttachBuilding relaAttachBuilding = new RelaAttachBuilding();
                relaAttachBuilding.setRabLastTime(nowDate);
                relaAttachBuilding.setRabOaId(attachId);
                relaAttachBuilding.setRabObId(buildAtt.getObId());
                count += relaAttachBuildingMapper.insert(relaAttachBuilding);
            }
        }
        if (EmptyUtil.isNotEmpty(buildAtt.getObImageInfo())) {
            attachIds = buildAtt.getObImageInfo().split(",");
            for (String attachId : attachIds) {
                RelaAttachBuilding relaAttachBuilding = new RelaAttachBuilding();
                relaAttachBuilding.setRabLastTime(nowDate);
                relaAttachBuilding.setRabOaId(attachId);
                relaAttachBuilding.setRabObId(buildAtt.getObId());
                count += relaAttachBuildingMapper.insert(relaAttachBuilding);
            }
        }
        log.info("添加关联表(RELA_PARKING_ATTACH)数据条数为：{}", count);
        log.info("删除关联表(RELA_PARKING_ATTACH)数据：{}", deleteNum);
        return count + deleteNum;
    }

    /**
     * 功能描述: 删除关联表数据
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019/3/4 9:39
     */
    private int removeRela(String obId) {
        QueryWrapper<RelaAttachBuilding> selectQueryWrapper = new QueryWrapper<>();
        selectQueryWrapper.lambda().eq(RelaAttachBuilding::getRabObId, obId);
        List<RelaAttachBuilding> attachBuildingList = relaAttachBuildingMapper.selectList(selectQueryWrapper);
        if (attachBuildingList.size() > 0) {
            int count = relaAttachBuildingMapper.delete(selectQueryWrapper);
            log.info("删除的关联表(RELA_PARKING_ATTACH)数据条数：{}", count);
            return count;
        } else {
            log.info("未删除关联表(RELA_PARKING_ATTACH)数据");
            return 0;
        }
    }

    /**
     * 功能描述: 用于查询时拼接查询条件<OtBuilding>
     *
     * @author luozhen
     * @date 2019/2/28 20:59
     */
    private QueryWrapper<OtBuilding> checkFieldOtBuilding(Building building) {
        QueryWrapper<OtBuilding> queryWrapper = new QueryWrapper<>();
        if (EmptyUtil.isNotEmpty(building.getObId())) {
            queryWrapper.lambda().eq(OtBuilding::getObId, building.getObId());
        }
        if (EmptyUtil.isNotEmpty(building.getObCode())) {
            queryWrapper.lambda().eq(OtBuilding::getObCode, building.getObCode());
        }
        if (EmptyUtil.isNotEmpty(building.getObName())) {
            queryWrapper.lambda().like(OtBuilding::getObName, building.getObName());
        }
        if (EmptyUtil.isNotEmpty(building.getObAddr())) {
            queryWrapper.lambda().like(OtBuilding::getObAddr, building.getObAddr());
        }
        if (EmptyUtil.isNotEmpty(building.getObLdArea())) {
            queryWrapper.lambda().like(OtBuilding::getObLdArea, building.getObLdArea());
        }
        if (EmptyUtil.isNotEmpty(building.getObFloorArea())) {
            queryWrapper.lambda().like(OtBuilding::getObFloorArea, building.getObFloorArea());
        }
        if (EmptyUtil.isNotEmpty(building.getObUsage())) {
            queryWrapper.lambda().like(OtBuilding::getObUsage, building.getObUsage());
        }
        if (EmptyUtil.isNotEmpty(building.getObBaseForm())) {
            queryWrapper.lambda().like(OtBuilding::getObBaseForm, building.getObBaseForm());
        }
        if (EmptyUtil.isNotEmpty(building.getObStru())) {
            queryWrapper.lambda().like(OtBuilding::getObStru, building.getObStru());
        }
        if (EmptyUtil.isNotEmpty(building.getObUpFloor())) {
            queryWrapper.lambda().like(OtBuilding::getObUpFloor, building.getObUpFloor());
        }
        if (EmptyUtil.isNotEmpty(building.getObDownFloor())) {
            queryWrapper.lambda().like(OtBuilding::getObDownFloor, building.getObDownFloor());
        }
        if (EmptyUtil.isNotEmpty(building.getObFloorHeight())) {
            queryWrapper.lambda().like(OtBuilding::getObFloorHeight, building.getObFloorHeight());
        }
        if (EmptyUtil.isNotEmpty(building.getObHeight())) {
            queryWrapper.lambda().like(OtBuilding::getObHeight, building.getObHeight());
        }
        if (EmptyUtil.isNotEmpty(building.getObDoorNum())) {
            queryWrapper.lambda().like(OtBuilding::getObDoorNum, building.getObDoorNum());
        }
        //多条件查询
        if (EmptyUtil.isNotEmpty(building.getObElevatorInfo())) {
            int count = 0;
            int max = building.getObElevatorInfo().size() - 1;
            QueryWrapper<OtBuilding> conditionWrapper = new QueryWrapper<>();
            if (max == 0) {
                queryWrapper.lambda().like(OtBuilding::getObElevatorInfo, building.getObElevatorInfo().get(0));
            } else {
                for (String str : building.getObElevatorInfo()) {
                    conditionWrapper.lambda().like(OtBuilding::getObElevatorInfo, str);
                    if (count < max) {
                        conditionWrapper.or();
                    }
                    count++;
                }
                queryWrapper.and(i -> conditionWrapper);
            }
        }
        //多条件查询
        if (EmptyUtil.isNotEmpty(building.getObDownInfo())) {
            int count = 0;
            int max = building.getObDownInfo().size() - 1;
            QueryWrapper<OtBuilding> conditionWrapper = new QueryWrapper<>();
            if (max == 0) {
                queryWrapper.lambda().like(OtBuilding::getObDownInfo, building.getObDownInfo().get(0));
            } else {
                for (String str : building.getObDownInfo()) {
                    conditionWrapper.lambda().like(OtBuilding::getObDownInfo, str);
                    if (count < max) {
                        conditionWrapper.or();
                    }
                    count++;
                }
                queryWrapper.and(i -> conditionWrapper);
            }
        }
        if (EmptyUtil.isNotEmpty(building.getObAirDefenceInfo())) {
            queryWrapper.lambda().like(OtBuilding::getObAirDefenceInfo, building.getObAirDefenceInfo());
        }
        if (EmptyUtil.isNotEmpty(building.getObFireControlInfo())) {
            queryWrapper.lambda().like(OtBuilding::getObFireControlInfo, building.getObFireControlInfo());
        }
        if (EmptyUtil.isNotEmpty(building.getObPropertyUnit())) {
            queryWrapper.lambda().like(OtBuilding::getObPropertyUnit, building.getObPropertyUnit());
        }
        if (EmptyUtil.isNotEmpty(building.getObPropertyNo())) {
            queryWrapper.lambda().like(OtBuilding::getObPropertyNo, building.getObPropertyNo());
        }
        if (EmptyUtil.isNotEmpty(building.getObCompDate())) {
            queryWrapper.lambda().like(OtBuilding::getObCompDate, building.getObCompDate());
        }
        //多条件查询
        if (EmptyUtil.isNotEmpty(building.getObDesignCriteria())) {
            int count = 0;
            int max = building.getObDesignCriteria().size() - 1;
            QueryWrapper<OtBuilding> conditionWrapper = new QueryWrapper<>();
            if (max == 0) {
                queryWrapper.lambda().like(OtBuilding::getObDesignCriteria, building.getObDesignCriteria().get(0));
            } else {
                for (String str : building.getObDesignCriteria()) {
                    conditionWrapper.lambda().like(OtBuilding::getObDesignCriteria, str);
                    if (count < max) {
                        conditionWrapper.or();
                    }
                    count++;
                }
                queryWrapper.and(i -> conditionWrapper);
            }
        }
        if (EmptyUtil.isNotEmpty(building.getObDrawingPath())) {
            queryWrapper.lambda().like(OtBuilding::getObDrawingPath, building.getObDrawingPath());
        }
        if (EmptyUtil.isNotEmpty(building.getObStatus())) {
            queryWrapper.lambda().like(OtBuilding::getObStatus, building.getObStatus());
        }
        if (EmptyUtil.isNotEmpty(building.getObGeologyInfo())) {
            queryWrapper.lambda().like(OtBuilding::getObGeologyInfo, building.getObGeologyInfo());
        }
        if (EmptyUtil.isNotEmpty(building.getObModelName())) {
            queryWrapper.lambda().like(OtBuilding::getObModelName, building.getObModelName());
        }
        queryWrapper.lambda().orderByDesc(OtBuilding::getObAddTime, OtBuilding::getObUpdateTime);
        return queryWrapper;
    }

    /**
     * 功能描述: 用于查询时拼接查询条件<BuildAtt>
     *
     * @author luozhen
     * @date 2019/2/28 20:59
     */
    private QueryWrapper<BuildAtt> checkFieldBulidAtt(Building building) {
        QueryWrapper<BuildAtt> queryWrapper = new QueryWrapper<>();
        if (EmptyUtil.isNotEmpty(building.getObId())) {
            queryWrapper.lambda().eq(BuildAtt::getObId, building.getObId());
        }
        if (EmptyUtil.isNotEmpty(building.getObCode())) {
            queryWrapper.lambda().eq(BuildAtt::getObCode, building.getObCode());
        }
        if (EmptyUtil.isNotEmpty(building.getObName())) {
            queryWrapper.lambda().like(BuildAtt::getObName, building.getObName());
        }
        if (EmptyUtil.isNotEmpty(building.getObAddr())) {
            queryWrapper.lambda().like(BuildAtt::getObAddr, building.getObAddr());
        }
        if (EmptyUtil.isNotEmpty(building.getObLdArea())) {
            queryWrapper.lambda().like(BuildAtt::getObLdArea, building.getObLdArea());
        }
        if (EmptyUtil.isNotEmpty(building.getObFloorArea())) {
            queryWrapper.lambda().like(BuildAtt::getObFloorArea, building.getObFloorArea());
        }
        if (EmptyUtil.isNotEmpty(building.getObUsage())) {
            queryWrapper.lambda().like(BuildAtt::getObUsage, building.getObUsage());
        }
        if (EmptyUtil.isNotEmpty(building.getObBaseForm())) {
            queryWrapper.lambda().like(BuildAtt::getObBaseForm, building.getObBaseForm());
        }
        if (EmptyUtil.isNotEmpty(building.getObStru())) {
            queryWrapper.lambda().like(BuildAtt::getObStru, building.getObStru());
        }
        if (EmptyUtil.isNotEmpty(building.getObUpFloor())) {
            queryWrapper.lambda().like(BuildAtt::getObUpFloor, building.getObUpFloor());
        }
        if (EmptyUtil.isNotEmpty(building.getObDownFloor())) {
            queryWrapper.lambda().like(BuildAtt::getObDownFloor, building.getObDownFloor());
        }
        if (EmptyUtil.isNotEmpty(building.getObFloorHeight())) {
            queryWrapper.lambda().like(BuildAtt::getObFloorHeight, building.getObFloorHeight());
        }
        if (EmptyUtil.isNotEmpty(building.getObHeight())) {
            queryWrapper.lambda().like(BuildAtt::getObHeight, building.getObHeight());
        }
        if (EmptyUtil.isNotEmpty(building.getObDoorNum())) {
            queryWrapper.lambda().like(BuildAtt::getObDoorNum, building.getObDoorNum());
        }
        //多条件查询
        if (EmptyUtil.isNotEmpty(building.getObElevatorInfo())) {
            int count = 0;
            int max = building.getObElevatorInfo().size() - 1;
            QueryWrapper<BuildAtt> conditionWrapper = new QueryWrapper<>();
            if (max == 0) {
                queryWrapper.lambda().like(BuildAtt::getObElevatorInfo, building.getObElevatorInfo().get(0));
            } else {
                for (String str : building.getObElevatorInfo()) {
                    conditionWrapper.lambda().like(BuildAtt::getObElevatorInfo, str);
                    if (count < max) {
                        conditionWrapper.or();
                    }
                    count++;
                }
                queryWrapper.and(i -> conditionWrapper);
            }
        }
        //多条件查询
        if (EmptyUtil.isNotEmpty(building.getObDownInfo())) {
            int count = 0;
            int max = building.getObDownInfo().size() - 1;
            QueryWrapper<BuildAtt> conditionWrapper = new QueryWrapper<>();
            if (max == 0) {
                queryWrapper.lambda().like(BuildAtt::getObDownInfo, building.getObDownInfo().get(0));
            } else {
                for (String str : building.getObDownInfo()) {
                    conditionWrapper.lambda().like(BuildAtt::getObDownInfo, str);

                    if (count < max) {
                        conditionWrapper.or();
                    }
                    count++;
                }
                queryWrapper.and(i -> conditionWrapper);
            }
        }
        if (EmptyUtil.isNotEmpty(building.getObAirDefenceInfo())) {
            queryWrapper.lambda().like(BuildAtt::getObAirDefenceInfo, building.getObAirDefenceInfo());
        }
        if (EmptyUtil.isNotEmpty(building.getObFireControlInfo())) {
            queryWrapper.lambda().like(BuildAtt::getObFireControlInfo, building.getObFireControlInfo());
        }
        if (EmptyUtil.isNotEmpty(building.getObPropertyUnit())) {
            queryWrapper.lambda().like(BuildAtt::getObPropertyUnit, building.getObPropertyUnit());
        }
        if (EmptyUtil.isNotEmpty(building.getObPropertyNo())) {
            queryWrapper.lambda().like(BuildAtt::getObPropertyNo, building.getObPropertyNo());
        }
        if (EmptyUtil.isNotEmpty(building.getObCompDate())) {
            queryWrapper.lambda().like(BuildAtt::getObCompDate, building.getObCompDate());
        }
        //多条件查询
        if (EmptyUtil.isNotEmpty(building.getObDesignCriteria())) {
            for (int i = 0; i < building.getObDesignCriteria().size(); i++) {
                if (building.getObDesignCriteria().get(i).equals("1") || building.getObDesignCriteria().get(i).equals("2") || building.getObDesignCriteria().get(i).equals("3") || building.getObDesignCriteria().get(i).equals("4") || building.getObDesignCriteria().get(i).equals("5") || building.getObDesignCriteria().get(i).equals("6") || building.getObDesignCriteria().get(i).equals("7") || building.getObDesignCriteria().get(i).equals("8")) {
                    building.getObDesignCriteria().remove(i);
                }
            }
            int count = 0;
            int max = building.getObDesignCriteria().size() - 1;
            QueryWrapper<BuildAtt> conditionWrapper = new QueryWrapper<>();
            if (max == 0) {
                queryWrapper.lambda().like(BuildAtt::getObDesignCriteria, building.getObDesignCriteria().get(0));
            } else {
                for (String str : building.getObDesignCriteria()) {

                    conditionWrapper.lambda().like(BuildAtt::getObDesignCriteria, str);

                    if (count < max) {
                        conditionWrapper.or();
                    }
                    count++;
                }
                queryWrapper.and(i -> conditionWrapper);
            }
        }
        if (EmptyUtil.isNotEmpty(building.getObDrawingPath())) {
            queryWrapper.lambda().like(BuildAtt::getObDrawingPath, building.getObDrawingPath());
        }
        if (EmptyUtil.isNotEmpty(building.getObStatus())) {
            queryWrapper.lambda().like(BuildAtt::getObStatus, building.getObStatus());
        }
        if (EmptyUtil.isNotEmpty(building.getObGeologyInfo())) {
            queryWrapper.lambda().like(BuildAtt::getObGeologyInfo, building.getObGeologyInfo());
        }
        if (EmptyUtil.isNotEmpty(building.getObModelName())) {
            queryWrapper.lambda().like(BuildAtt::getObModelName, building.getObModelName());
        }
        queryWrapper.lambda().orderByDesc(BuildAtt::getObAddTime, BuildAtt::getObUpdateTime);
        return queryWrapper;
    }

    public Result delete(String batchIDs) {
        logService.addLog("删除建筑物属性");
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        List<String> idList = CommonMethod.divisionToList(batchIDs, ",");
        int result = buildAttMapper.deleteBatchIds(idList);
        if (result == 0) {
            result = otBuildingMapper.deleteBatchIds(idList);
        }
        if (result > 0) {
            return ResultMessage.success(null, result);
        } else {
            return ResultMessage.error(ResultEnum.DELETEERROR);
        }
    }

    public Result getBySelectPage(Building building, Integer page, Integer limit) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("查询建筑物属性");
        Page<BuildAtt> pageData = new Page<>(page, limit);
        QueryWrapper<BuildAtt> queryWrapper = checkFieldBulidAtt(building);

        List<String> list = columnsCommentsMapper.selectColumnNameS("Y");
        String[] array = list.toArray(new String[list.size()]);
        queryWrapper.select(array);

        IPage<Map<String, Object>> result = buildAttMapper.selectMapsPage(pageData, queryWrapper);
        //IPage<BuildAtt> result = buildAttMapper.selectPage(pageData, queryWrapper);
        Object data = result.getRecords();
        Long count = result.getTotal();
        return ResultMessage.success(data, count);
    }

    /**
     * 获取view相关参数
     *
     * @return
     */
    public Result getView() {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("获取表单");
        String fullPath = myProps.getSimpleProp();

        StringBuffer strbuffer = new StringBuffer();
        File myFile = new File(fullPath);//"D:"+File.separatorChar+"DStores.json"
        if (!myFile.exists()) {
            System.err.println("Can't Find " + fullPath);
        }
        try {
            FileInputStream fis = new FileInputStream(fullPath);
            InputStreamReader inputStreamReader = new InputStreamReader(fis, "UTF-8");
            BufferedReader in = new BufferedReader(inputStreamReader);

            String str;
            while ((str = in.readLine()) != null) {
                strbuffer.append(str);  //new String(str,"UTF-8")
            }
            in.close();
        } catch (IOException e) {
            log.error(e.getMessage());
            //e.printStackTrace();
            return ResultMessage.custom(200, "获取view异常", null, 0);
        }
        JSONObject object = JSONObject.parseObject(strbuffer.toString());
        return ResultMessage.success(object, 0);
    }

    /**
     * 保存view相关参数
     *
     * @param view
     * @return
     */
    public Result saveView(String view) {
        logService.addLog("更新表单");
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        JSONObject object = JSONObject.parseObject(view);
        // 生成json格式文件
        try {
            String fullPath = myProps.getSimpleProp();
            // 保证创建一个新文件
            File file = new File(fullPath);
            if (!file.getParentFile().exists()) { // 如果父目录不存在，创建父目录
                file.getParentFile().mkdirs();
            }
            if (file.exists()) { // 如果已存在,删除旧文件
                file.delete();
            }
            file.createNewFile();
            String jsonString = JsonUtil.formatJson(view);
            // 将格式化后的字符串写入文件
            Writer write = new OutputStreamWriter(new FileOutputStream(file), "UTF-8");
            write.write(view);
            write.flush();
            write.close();
        } catch (Exception e) {
            log.error(e.getMessage());
            //e.printStackTrace();
            return ResultMessage.custom(200, "保存view异常", null, 0);
        }
        return ResultMessage.success(null, 0);
    }

    /**
     * 保存
     *
     * @param content
     * @return
     */
    public Result saveBtMap(Map<String, Object> content) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        Map<String, Object> result = new HashMap<>();
        content = MarryMap(content);//清除不需要的map项
        LocalDateTime nowDate = LocalDateTime.now();

        //2 保存数据
        if (EmptyUtil.isEmpty(content.get("OB_ID"))) {
            logService.addLog("新增建筑物属性数据");
            content.put("OB_ADD_TIME", nowDate);
            content.put("OB_ISDELETE", 0);
            String uuid = UUID.randomUUID().toString().replaceAll("-", "");
            content.put("OB_ID", uuid);
            int objectID = attachBuildingMapper.selectMaxObjectId();
            double OBID = -(objectID + 1.0);
            content.put("OBJECTID", OBID);
            int num = attachBuildingMapper.insertBuildyMap(content);
            if (num > 0) {
                String id = uuid;
                log.info("生成的ID：{}", id);
                result.put("OB_BUILDING", "建筑物属性表新增成功");
                result.put("num", num);
                if ((content.containsKey("OB_DRAWING_PATH") && EmptyUtil.isNotEmpty(content.get("OB_DRAWING_PATH")) || (content.containsKey("OB_GEOLOGY_INFO")) && EmptyUtil.isNotEmpty(content.get("OB_GEOLOGY_INFO")))) {
                    BuildAtt buildAtt = new BuildAtt();
                    if (content.containsKey("OB_DRAWING_PATH") && EmptyUtil.isNotEmpty(content.get("OB_DRAWING_PATH"))) {
                        buildAtt.setObDrawingPath(content.get("OB_DRAWING_PATH").toString());
                    }
                    if (content.containsKey("OB_GEOLOGY_INFO") && EmptyUtil.isNotEmpty(content.get("OB_GEOLOGY_INFO"))) {
                        buildAtt.setObDrawingPath(content.get("OB_GEOLOGY_INFO").toString());
                    }
                    if (EmptyUtil.isNotEmpty(content.get("OB_IMAGE_INFO"))) {
                        buildAtt.setObImageInfo(content.get("OB_IMAGE_INFO").toString());
                    }
                    buildAtt.setObId(id);
                    int count = updateRela(buildAtt);
                    result.put("关联表(RELA_PARKING_ATTACH)更新数据条数：{}", count);
                }
            } else {
                result.put("OB_BUILDING", "建筑物属性表新增失败");
                result.put("num", 0);
                return ResultMessage.error(ResultEnum.UPDATEEROR);
            }
        } else {
            logService.addLog("更新建筑物属性数据");
            content.put("OB_UPDATE_TIME", nowDate);
            String id = content.get("OB_ID").toString();
            BuildAtt att = buildAttMapper.selectById(id);
            int num = 0;
            if (EmptyUtil.isNotEmpty(att) && EmptyUtil.isNotEmpty(att.getObId())) {
                num = attachBuildingMapper.updateBuildyMap(content, content.get("OB_ID").toString());
            } else {
                num = attachBuildingMapper.updateObBuildyMap(content, content.get("OB_ID").toString());
            }
            if (num > 0) {
                result.put("OB_BUILDING", "建筑物属性表修改成功");
                result.put("num", num);
                if ((content.containsKey("OB_DRAWING_PATH") && EmptyUtil.isNotEmpty(content.get("OB_DRAWING_PATH")) || (content.containsKey("OB_GEOLOGY_INFO")) && EmptyUtil.isNotEmpty(content.get("OB_GEOLOGY_INFO")))) {
                    BuildAtt buildAtt = new BuildAtt();
                    if (EmptyUtil.isNotEmpty(content.get("OB_DRAWING_PATH"))) {
                        buildAtt.setObDrawingPath(content.get("OB_DRAWING_PATH").toString());
                    }
                    if (EmptyUtil.isNotEmpty(content.get("OB_GEOLOGY_INFO"))) {
                        buildAtt.setObDrawingPath(content.get("OB_GEOLOGY_INFO").toString());
                    }
                    if (EmptyUtil.isNotEmpty(content.get("OB_IMAGE_INFO"))) {
                        buildAtt.setObImageInfo(content.get("OB_IMAGE_INFO").toString());
                    }
                    buildAtt.setObId(id);
                    int count = updateRela(buildAtt);
                    result.put("关联表(RELA_PARKING_ATTACH)更新数据条数", count);
                }
            } else {
                result.put("OB_BUILDING", "建筑物属性表修改失败");
                result.put("num", 0);
                return ResultMessage.error(ResultEnum.UPDATEEROR);
            }
        }
        return ResultMessage.success(result);
    }

    public Result getSelectPageByMap(Building building, Integer page, Integer limit, String likeValue) {
        logService.addLog("查询建筑物属性数据");
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        Page<BuildAtt> pageData = new Page<>(page, limit);
        QueryWrapper<BuildAtt> queryWrapper = checkFieldBulidAtt(building);
        List<String> list = columnsCommentsMapper.selectColumnNameS("Y");
        String[] array = list.toArray(new String[list.size()]);
        String sql = String.join(",", array);
        Boolean isAppVal = false;
        if (EmptyUtil.isNotEmpty(building) && EmptyUtil.isNotEmpty(building.getObModelName())) {
            isAppVal = true;
        }
        List<Map<String, Object>> data = attachBuildingMapper.selectPageByMap(list, likeValue, list, page * limit, (page - 1) * limit, isAppVal);
        int count = attachBuildingMapper.selectPageByMapCount(list, likeValue, "BUILD_ATT", sql, isAppVal);
        int count1 = attachBuildingMapper.selectPageByMapCount(list, likeValue, "OT_BUILDING", sql, isAppVal);
        return ResultMessage.success(data, count + count1);
    }

    public Result getMapBySelect(Map<String, Object> content) {
        logService.addLog("查询建筑物属性数据");
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        content = MarryMap(content);//清除不需要的map项
        QueryWrapper<OtBuilding> otBuildingQueryWrapper = new QueryWrapper<>();
        QueryWrapper<BuildAtt> buildAttQueryWrapper = new QueryWrapper<>();
        for (Map.Entry<String, Object> entry : content.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            if (EmptyUtil.isNotEmpty(key) && key.equals("OBJECTID")) {
                otBuildingQueryWrapper.eq(key, value);
                buildAttQueryWrapper.eq(key, value);
                continue;
            }
            if (EmptyUtil.isNotEmpty(value)) {
                otBuildingQueryWrapper.like(key, value);
                buildAttQueryWrapper.like(key, value);
            }
            //以后添加时间段
        }
        List<String> list = columnsCommentsMapper.selectColumnNameS("Y");
        String[] array = list.toArray(new String[list.size()]);
        otBuildingQueryWrapper.select(array);
        array = list.toArray(new String[list.size()]);
        buildAttQueryWrapper.select(array);

        //List<OtBuilding> otBuildingList = otBuildingMapper.selectList(otBuildingQueryWrapper);
        //List<BuildAtt> buildAttList = buildAttMapper.selectList(buildAttQueryWrapper);
        List<Map<String, Object>> otBuildingList = otBuildingMapper.selectMaps(otBuildingQueryWrapper);
        List<Map<String, Object>> buildAttList = buildAttMapper.selectMaps(buildAttQueryWrapper);
        List<Object> result = new ArrayList<>();
        result.addAll(otBuildingList);
        result.addAll(buildAttList);
        long count = result.size();
        if (count > 0) {
            return ResultMessage.success(result, count);
        } else {
            return ResultMessage.custom(1, "查询数据为空", null, count);
        }
    }

    public Result getMapByLikeValue(String likeValue) {
        logService.addLog("查询建筑物属性数据");
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        List<String> list = columnsCommentsMapper.selectColumnNameS("Y");
        String[] array = list.toArray(new String[list.size()]);
        String sql = String.join(",", array);

        List<Map<String, Object>> buildAttList = attachBuildingMapper.selectByMap(list, likeValue, "OT_BUILDING", sql);

        List<Map<String, Object>> otBuildingList = attachBuildingMapper.selectByMap(list, likeValue, "BUILD_ATT", sql);


        List<Object> result = new ArrayList<>();
        result.addAll(otBuildingList);
        result.addAll(buildAttList);
        long count = result.size();
        if (count > 0) {
            return ResultMessage.success(result, count);
        } else {
            return ResultMessage.custom(1, "查询数据为空", null, count);
        }
    }

    /**
     * 清除不需要的map项
     *
     * @param content
     * @return
     */
    public Map<String, Object> MarryMap(Map<String, Object> content) {
        if (EmptyUtil.isNotEmpty(content)) {
            List<String> list = columnsCommentsMapper.selectColumnNameS("Y");

            for (Map.Entry<String, Object> entry : content.entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();
                if (EmptyUtil.isNotEmpty(value) && !list.contains(key)) {
                    content.replace(key, null);
                }
                //以后添加时间段
            }
        }
        return content;
    }
}
