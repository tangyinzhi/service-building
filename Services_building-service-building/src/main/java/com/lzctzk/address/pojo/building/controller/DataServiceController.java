package com.lzctzk.address.pojo.building.controller;/**
 * @author luozhen
 * @date 2019/2/27 20:54
 * @version V1.0
 * @description
 */

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lzctzk.address.dao.building.entity.BtDataService;
import com.lzctzk.address.dao.building.service.IBtDataServiceService;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultEnum;
import com.lzctzk.address.util.result.ResultMessage;
import io.swagger.annotations.Api;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * com.lzctzk.address.pojo.building.controller
 *
 * @author luozhen
 * @version V1.0
 * @date 2019/2/27 20:54
 * @description
 */
@Api(tags = "数据服务控制器")
@RestController
@RequestMapping(value = "DataService")
public class DataServiceController {

    private static final Logger log = LoggerFactory.getLogger(DataServiceController.class);

    @Autowired
    private IBtDataServiceService iBtDataServiceService;

    @GetMapping("/getAll")
    public Result getAll() {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        List<BtDataService> result = iBtDataServiceService.list(null);
        if (EmptyUtil.isNotEmpty(result)) {
            return ResultMessage.success(result);
        } else {
            return ResultMessage.custom(0, "查询数据为空", null, 0);
        }
    }

    @PostMapping(value = "SaveDatasevice")
    public Result SaveDatasevice(@RequestBody BtDataService BtDataService) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", BtDataService.toString());
        LocalDateTime nowDate = LocalDateTime.now();
        if (EmptyUtil.isEmpty(BtDataService.getId())) {
            //新增
            BtDataService.setCreateDate(nowDate);
            BtDataService.setHanderDate(nowDate);
            BtDataService.setIsdelete(0);
            Session session = SecurityUtils.getSubject().getSession();
            if (EmptyUtil.isNotEmpty(session)) {
                String userName = session.getAttribute("userName").toString();
                BtDataService.setCreateId(userName);
            }

            BtDataService.setKeyword("泸州,建筑,地图");
            BtDataService.setMaprange("左:95 右:35 上:110 下:24");
            BtDataService.setIsdelete(0);
            if (iBtDataServiceService.save(BtDataService)) {
                return ResultMessage.success();
            } else {
                return ResultMessage.error();
            }
        } else {
            //修改
            BtDataService.setHanderDate(nowDate);
            Session session = SecurityUtils.getSubject().getSession();
            if (EmptyUtil.isNotEmpty(session)) {
                String userName = session.getAttribute("userName").toString();
                BtDataService.setHanderId(userName);
            }
            if (iBtDataServiceService.updateById(BtDataService)) {
                return ResultMessage.success();
            } else {
                return ResultMessage.error();
            }
        }

    }

    @PostMapping("/DeleteDatasevice")
    public Result DeleteDatasevice(String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", id);
        if (iBtDataServiceService.removeById(id)) {
            return ResultMessage.success();
        } else {
            return ResultMessage.error();
        }
    }

    @PostMapping("/BatchDeleteDatasevice")
    public Result BatchDeleteDatasevice(String BatchIDs) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", BatchIDs);
        String[] ids;
        if (BatchIDs.indexOf(",") == -1) {
            String[] cache = {BatchIDs};
            ids = cache;
        } else {
            ids = BatchIDs.split(",");
        }
        List<String> idList = Arrays.asList(ids);
        if (iBtDataServiceService.removeByIds(idList)) {
            return ResultMessage.success();
        } else {
            return ResultMessage.error();
        }
    }

    @GetMapping("/GetByID")
    public Result getByID(String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        BtDataService result = iBtDataServiceService.getById(id);
        if (EmptyUtil.isNotEmpty(result)) {
            return ResultMessage.success(result);
        } else {
            return ResultMessage.custom(0, "查询数据为空", null, 0);
        }
    }

    @GetMapping("/GetBydynamic")
    public Result getByDynamic(BtDataService BtDataService, Integer page, Integer limit, String likeValue) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", BtDataService.toString());
        if (page == null) {
            page = 1;
        }
        if (limit == null) {
            limit = 10;
        }
        Page<BtDataService> pageData = new Page<BtDataService>(page, limit);
        QueryWrapper<BtDataService> queryWrapper = checkFeild(BtDataService);
//        for (Map.Entry<String,Object> entry : mapList.entrySet()) {
//            //System.out.println("Key = " + entry.getKey() + ", Value = " + entry.getValue());
//            String key = entry.getKey();
//            Object value = entry.getValue();
//            if(EmptyUtil.isNotEmpty(value)){
//                queryWrapper.like(key,value);
//            }
//            //以后添加时间段
//        }
        if (EmptyUtil.isNotEmpty(likeValue)) {
            queryWrapper = LikeAllFeild(likeValue);
        }
        IPage<BtDataService> result = iBtDataServiceService.page(pageData, queryWrapper);
        Long count = Long.valueOf(result.getTotal());

        return ResultMessage.success(result.getRecords(), count);

    }

    @GetMapping("/CheckServicesName")
    public Result CheckServicesName(String servicesName, String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{},{}", servicesName, id);
        QueryWrapper<BtDataService> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("SERVICES_NAME", servicesName);
        List<BtDataService> result = iBtDataServiceService.list(queryWrapper);
        for (BtDataService user : result) {
            if (EmptyUtil.isNotEmpty(id) && user.getId().equals(id)) {
                result.remove(user);
            }
        }
        if (result.size() > 0) {
            return ResultMessage.custom(ResultEnum.ERROR, "已存在此用户名");
        } else {
            return ResultMessage.success();
        }
    }

    public QueryWrapper checkFeild(BtDataService btDataService) {
        String whereClause = " 1=1";
        QueryWrapper<BtDataService> queryWrapper = new QueryWrapper<>();
        if (btDataService != null) {
            if (btDataService.getId() != null && EmptyUtil.isNotEmpty(btDataService.getId())) {
                queryWrapper.eq("ID", btDataService.getId());
            }
            if (btDataService.getServicesName() != null && EmptyUtil.isNotEmpty(btDataService.getServicesName())) {
                queryWrapper.like("SERVICES_NAME", btDataService.getServicesName());
            }
            if (btDataService.getSystemId() != null && EmptyUtil.isNotEmpty(btDataService.getSystemId())) {
                queryWrapper.eq("SYSTEM_ID", btDataService.getSystemId());
            }
        }
        return queryWrapper;
    }

    public QueryWrapper LikeAllFeild(String likeValue) {
        String whereClause = " 1=1";
        QueryWrapper<BtDataService> queryWrapper = new QueryWrapper<>();

        queryWrapper.lambda().or(i -> i.like(BtDataService::getServicesName, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataService::getSystemId, likeValue));
        queryWrapper.lambda().or(i -> i.eq(BtDataService::getId, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataService::getKeyword, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataService::getMaprange, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataService::getSecurityLevel, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataService::getServicesAddr, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataService::getServicesDescription, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataService::getServicesDetails, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataService::getServicesFullname, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataService::getServicesHelpAddr, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataService::getSecurityLevel, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataService::getServicesSampleAddr, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataService::getSecurityLevel, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtDataService::getCreateDate, likeValue));
        queryWrapper.lambda().and(i -> i.eq(BtDataService::getIsdelete, 0));

        return queryWrapper;
    }
}
