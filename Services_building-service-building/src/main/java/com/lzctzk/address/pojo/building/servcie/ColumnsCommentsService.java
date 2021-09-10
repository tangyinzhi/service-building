package com.lzctzk.address.pojo.building.servcie;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.lzctzk.address.dao.building.entity.BtColumnsComments;
import com.lzctzk.address.dao.building.mapper.BtColumnsCommentsMapper;
import com.lzctzk.address.pojo.building.mapper.ColumnsCommentsMapper;
import com.lzctzk.address.util.String.StringUtil;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultEnum;
import com.lzctzk.address.util.result.ResultMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * com.lzctzk.address.pojo.building.servcie
 *
 * @author luozhen
 * @version V1.0
 * @date 2019-3-11 10:35
 * @description
 */
@Service
public class ColumnsCommentsService {

    private static final Logger log = LoggerFactory.getLogger(ColumnsCommentsService.class);

    @Autowired
    private BtColumnsCommentsMapper btColumnsCommentsMapper;

    @Autowired
    private ColumnsCommentsMapper columnsCommentsMapper;

    @Autowired
    LogService logService;

    /**
     * 功能描述: 获得所有数据
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-12 8:35
     */
    public Result getAll() {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        List<BtColumnsComments> result = btColumnsCommentsMapper.selectList(null);
        long count = result.size();
        if (count > 0) {
            return ResultMessage.success(result, count);
        } else {
            return ResultMessage.custom(0, "查询数据为空", null, count);
        }
    }

    /**
     * 功能描述: 保存数据
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-12 8:40
     */
    public Result save(BtColumnsComments btColumnsComments) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        if (EmptyUtil.isEmpty(btColumnsComments.getId())) {
            //新增
            btColumnsComments.setIsdelete(0);
            int result = btColumnsCommentsMapper.insert(btColumnsComments);
            if (result > 0) {
                return ResultMessage.success(null, result);
            } else {
                return ResultMessage.error(ResultEnum.ADDERROR);
            }
        } else {
            //修改
            int result = btColumnsCommentsMapper.updateById(btColumnsComments);
            if (result > 0) {
                return ResultMessage.success(null, result);
            } else {
                return ResultMessage.error(ResultEnum.UPDATEEROR);
            }
        }
    }

    /**
     * 功能描述: 保存字段
     *
     * @param btColumnsComments
     * @return
     */
    public Result SaveColumn(BtColumnsComments btColumnsComments) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        try {

            if (EmptyUtil.isEmpty(btColumnsComments.getId())) {
                logService.addLog("新增字段");
                String tableName = btColumnsComments.getTableNameS();
                if (EmptyUtil.isEmpty(tableName)) {
                    return ResultMessage.custom(-93, "表名参数为空", null, 0);
                }
                if (EmptyUtil.isEmpty(btColumnsComments.getColumnNameS())) {
                    return ResultMessage.custom(-93, "字段名参数为空", null, 0);
                }
                btColumnsComments.setTableNameS("BUILD_ATT");
                //新增字段  --表OT_BUILDING
                columnsCommentsMapper.AddColumn(btColumnsComments);
                //设置字段注释
                if (EmptyUtil.isNotEmpty(btColumnsComments.getComments())) {
                    columnsCommentsMapper.ChangeComments(btColumnsComments);
                }

                btColumnsComments.setTableNameS(tableName);
                //新增字段  --表OT_BUILDING
                columnsCommentsMapper.AddColumn(btColumnsComments);
                //设置字段注释
                if (EmptyUtil.isNotEmpty(btColumnsComments.getComments())) {
                    columnsCommentsMapper.ChangeComments(btColumnsComments);
                }
                btColumnsComments.setColumnNameS(btColumnsComments.getColumnNameS().toUpperCase());
                List<BtColumnsComments> list = columnsCommentsMapper.selectYSColumns(btColumnsComments.getColumnNameS());
                if (list.size() <= 0) {
                    //保存数据
                    return save(btColumnsComments);
                }

                BtColumnsComments btColumnsCommentNew = list.get(0);
                btColumnsCommentNew.setNullenum(btColumnsComments.getNullenum());
                //保存数据
                return save(btColumnsCommentNew);
            } else {
                logService.addLog("更新字段");
                String tableName = btColumnsComments.getTableNameS();
                if (EmptyUtil.isEmpty(tableName)) {
                    return ResultMessage.custom(-93, "表名参数为空", null, 0);
                }
                if (EmptyUtil.isEmpty(btColumnsComments.getColumnNameS())) {
                    return ResultMessage.custom(-93, "字段名参数为空", null, 0);
                }
                BtColumnsComments btColumnsCommentsOld = btColumnsCommentsMapper.selectById(btColumnsComments.getId());
                String NullableS = btColumnsCommentsOld.getNullableS();
                btColumnsComments.setColumnNameS(btColumnsComments.getColumnNameS().toUpperCase());
                if (EmptyUtil.isNotEmpty(btColumnsCommentsOld.getNullableS()) && EmptyUtil.isNotEmpty(btColumnsCommentsOld.getNullableS()) && btColumnsCommentsOld.getNullableS().equals(btColumnsComments.getNullableS())) {
                    //更新字段名  --表OT_BUILDING
                    btColumnsComments.setNullableS("null");
                }

                btColumnsComments.setTableNameS("BUILD_ATT");
                if (EmptyUtil.isNotEmpty(btColumnsCommentsOld.getColumnNameS()) && !btColumnsCommentsOld.getColumnNameS().equals(btColumnsComments.getColumnNameS())) {
                    //更新字段名  --表OT_BUILDING
                    columnsCommentsMapper.ChangeName(btColumnsComments.getTableNameS(), btColumnsCommentsOld.getColumnNameS(), btColumnsComments.getColumnNameS());
                }
                //更新字段  --表OT_BUILDING
                columnsCommentsMapper.UpdateColumn(btColumnsComments);
                //更新字段注释
                if (EmptyUtil.isNotEmpty(btColumnsComments.getComments())) {
                    columnsCommentsMapper.ChangeComments(btColumnsComments);
                }

                btColumnsComments.setTableNameS(tableName);
                if (EmptyUtil.isNotEmpty(btColumnsCommentsOld.getColumnNameS()) && !btColumnsCommentsOld.getColumnNameS().equals(btColumnsComments.getColumnNameS())) {
                    //更新字段名  --表OT_BUILDING
                    columnsCommentsMapper.ChangeName(btColumnsComments.getTableNameS(), btColumnsCommentsOld.getColumnNameS(), btColumnsComments.getColumnNameS());
                }
                //更新字段  --表OT_BUILDING
                columnsCommentsMapper.UpdateColumn(btColumnsComments);
                //更新字段注释
                if (EmptyUtil.isNotEmpty(btColumnsComments.getComments())) {
                    columnsCommentsMapper.ChangeComments(btColumnsComments);
                }
                btColumnsComments.setColumnNameS(btColumnsComments.getColumnNameS().toUpperCase());
                List<BtColumnsComments> list = columnsCommentsMapper.selectYSColumns(btColumnsComments.getColumnNameS());
                if (list.size() <= 0) {
                    btColumnsComments.setNullableS(NullableS);
                    //保存数据
                    return save(btColumnsComments);
                }
                BtColumnsComments btColumnsCommentNew = list.get(0);
                btColumnsCommentNew.setId(btColumnsComments.getId());
                btColumnsCommentNew.setIsdelete(btColumnsCommentsOld.getIsdelete());
                btColumnsCommentNew.setNullenum(btColumnsComments.getNullenum());
                btColumnsCommentNew.setNullableS(NullableS);
                //保存数据
                return save(btColumnsCommentNew);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            logService.addLog("保存字段异常", "错误");
            return ResultMessage.custom(-99, e.getMessage(), null, Long.valueOf(0));
        }

    }

    /**
     * 功能描述: 删除数据
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-12 9:11
     */
    public Result delete(String batchIds) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        List<String> idList = CommonMethod.divisionToList(batchIds, ",");
        int result = btColumnsCommentsMapper.deleteBatchIds(idList);
        if (result > 0) {
            return ResultMessage.success(null, result);
        } else {
            return ResultMessage.error(ResultEnum.DELETEERROR);
        }
    }

    /**
     * 功能描述: 重新获取字段
     *
     * @param
     * @return
     * @author dengjie
     * @date 2019-3-29 9:11
     */
    public Result changeComments() {
        Result resultIndex = null;
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        List<BtColumnsComments> list = columnsCommentsMapper.selectYSColumns(null);
        for (BtColumnsComments item : list) {
            if (item != null && com.lzctzk.address.util.empty.EmptyUtil.isNotEmpty(item.getTableNameS()) && com.lzctzk.address.util.empty.EmptyUtil.isNotEmpty(item.getColumnNameS())) {
                QueryWrapper<BtColumnsComments> queryWrapper = new QueryWrapper<>();
                queryWrapper.lambda().eq(BtColumnsComments::getTableNameS, item.getTableNameS());
                queryWrapper.lambda().eq(BtColumnsComments::getColumnNameS, item.getColumnNameS());

                List<BtColumnsComments> result = btColumnsCommentsMapper.selectList(queryWrapper);
                if (result.size() > 0) {
                    BtColumnsComments ColumnsComments = result.get(0);
                    item.setId(ColumnsComments.getId());
                }

                item.setNullenable("Y");
                resultIndex = save(item);
            }
        }
        return resultIndex;
    }

    /**
     * 功能描述: 获取所有字段名
     *
     * @param
     * @return
     * @author dengjie
     * @date 2019-3-29 17:45
     */
    public Result getAllColumn() {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        try {
            List<String> list = columnsCommentsMapper.selectColumnNameS("Y");
            List<Map<String, String>> result = new ArrayList<Map<String, String>>();
            for (String item : list) {
                String item1 = item.toLowerCase();
                String itemNew = StringUtil.replaceUnderlineAndfirstToUpper(item1, "_", "");
                Map<String, String> map = new HashMap<String, String>();
                map.put("Original", item);
                map.put("Change", itemNew);
                result.add(map);
            }
            return ResultMessage.success(result);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultMessage.custom(-99, e.getMessage(), null, Long.valueOf(0));
        }
    }
}
