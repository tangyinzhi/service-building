package com.lzctzk.address.pojo.building.controller;/**
 * @author luozhen
 * @date 2019/2/27 21:30
 * @version V1.0
 * @description
 */

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lzctzk.address.dao.building.entity.BtColumnsComments;
import com.lzctzk.address.dao.building.service.IBtColumnsCommentsService;
import com.lzctzk.address.pojo.building.servcie.ColumnsCommentsService;
import com.lzctzk.address.pojo.building.servcie.LogService;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultEnum;
import com.lzctzk.address.util.result.ResultMessage;
import io.swagger.annotations.Api;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

/**
 * com.lzctzk.address.pojo.building.controller
 *
 * @author luozhen
 * @version V1.0
 * @date 2019/2/27 21:30
 * @Description
 */
@Api(tags = "字段管理控制器")
@RestController
@RequestMapping(value = "ColumnsManager")
public class ColumnsCommentsController {

    private static final Logger log = LoggerFactory.getLogger(ColumnsCommentsController.class);

    @Autowired
    private IBtColumnsCommentsService iBtColumnsCommentsService;
    @Autowired
    private ColumnsCommentsService columnsCommentsService;
    @Autowired
    LogService logService;

    @PostMapping(value = "SaveColumn")
    public Result SaveColumn(@RequestBody BtColumnsComments btColumnsComments) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", btColumnsComments.toString());
        return columnsCommentsService.SaveColumn(btColumnsComments);

    }

    @PostMapping("/DeleteColumn")
    public Result DeleteColumn(String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", id);
        logService.addLog("删除字段");
        if (EmptyUtil.isEmpty(id)) {
            return ResultMessage.error(ResultEnum.NUllERROR);
        }
        BtColumnsComments btColumnsCommentsOld = iBtColumnsCommentsService.getById(id);
        if (EmptyUtil.isEmpty(btColumnsCommentsOld)) {
            return ResultMessage.error();
        }
        btColumnsCommentsOld.setIsdelete(1);
        if (iBtColumnsCommentsService.updateById(btColumnsCommentsOld)) {
            return ResultMessage.success();
        } else {
            return ResultMessage.error();
        }
    }

    @PostMapping("/BatchDeleteColumn")
    public Result BatchDeleteColumn(String BatchIDs) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", BatchIDs);
        logService.addLog("批量删除字段");
        String[] ids;
        if (BatchIDs.indexOf(",") == -1) {
            String[] cache = {BatchIDs};
            ids = cache;
        } else {
            ids = BatchIDs.split(",");
        }
        List<String> idList = Arrays.asList(ids);
        if (iBtColumnsCommentsService.removeByIds(idList)) {
            return ResultMessage.success();
        } else {
            return ResultMessage.error();
        }
    }

    @GetMapping("/GetByID")
    public Result getByID(String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        BtColumnsComments result = iBtColumnsCommentsService.getById(id);
        logService.addLog("查询字段");
        if (EmptyUtil.isNotEmpty(result)) {
            return ResultMessage.success(result);
        } else {
            return ResultMessage.error();
        }
    }

    @GetMapping("/GetByDynamicWithPage")
    public Result GetByDynamicWithPage(BtColumnsComments BtColumnsComments, Integer page, Integer limit, String likeValue) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", BtColumnsComments.toString());
        if ((page == null) || (limit == null)) {
            page = 1;
            limit = 10;
        }
        logService.addLog("查询字段");
        Page<BtColumnsComments> pageData = new Page<>(page, limit);
        QueryWrapper<BtColumnsComments> queryWrapper = new QueryWrapper<>();
//        Map<String,Object> mapList = MapUtil.object2Map(BtColumnsComments);
//        mapList.remove("serialVersionUID");
//        QueryWrapper<BtColumnsComments> queryWrapper = new QueryWrapper<>();
//        for (Map.Entry<String,Object> entry : mapList.entrySet()) {
//            String key = entry.getKey();
//            Object value = entry.getValue();
//            if(EmptyUtil.isNotEmpty(value)){
//                queryWrapper.like(key,value);
//            }
//            //以后添加时间段
//        }
        queryWrapper.eq("ISDELETE", 0);
        if (EmptyUtil.isNotEmpty(likeValue)) {
            queryWrapper = LikeAllFeild(likeValue);
        }
        IPage<BtColumnsComments> result = iBtColumnsCommentsService.page(pageData, queryWrapper);
        Long count = Long.valueOf(result.getTotal());
        if (count > 0) {
            return ResultMessage.success(result.getRecords(), count);
        } else {
            return ResultMessage.custom(ResultEnum.ERROR, "查询数据为空");
        }
    }

    public QueryWrapper LikeAllFeild(String likeValue) {
        String whereClause = " 1=1";
        QueryWrapper<BtColumnsComments> queryWrapper = new QueryWrapper<>();

        queryWrapper.lambda().or(i -> i.like(BtColumnsComments::getTableNameS, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtColumnsComments::getColumnNameS, likeValue));
        queryWrapper.lambda().or(i -> i.eq(BtColumnsComments::getId, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtColumnsComments::getNullableS, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtColumnsComments::getComments, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtColumnsComments::getDataDefault, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtColumnsComments::getDataLength, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtColumnsComments::getDataPrecision, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtColumnsComments::getDataScale, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtColumnsComments::getDataType, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtColumnsComments::getNullenable, likeValue));
        queryWrapper.lambda().and(i -> i.eq(BtColumnsComments::getIsdelete, 0));
        return queryWrapper;
    }

    @GetMapping("/CheckColumnName")
    public Result CheckColumnName(String tableName, String ID, String columnName) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{},{}", tableName, ID);
        QueryWrapper<BtColumnsComments> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("TABLE_NAME_S", tableName);
        queryWrapper.eq("COLUMN_NAME_S", columnName);
        List<BtColumnsComments> result = iBtColumnsCommentsService.list(queryWrapper);
        for (int i = 0; i < result.size(); i++) {
            BtColumnsComments user = result.get(i);
            if (EmptyUtil.isNotEmpty(ID) && user.getId().equals(ID)) {
                result.remove(user);
            }
        }
        if (result.size() > 0) {
            return ResultMessage.custom(ResultEnum.ERROR, "已存在此字段名");
        } else {
            return ResultMessage.success();
        }
    }

    @GetMapping("/changeComments")
    public Result changeComments() {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        return columnsCommentsService.changeComments();
    }

    /**
     * 获取所有字段名
     *
     * @return
     */
    @GetMapping("/getAllColumn")
    public Result getAllColumn() {
        logService.addLog("获取所有字段名");
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        return columnsCommentsService.getAllColumn();
    }

}
