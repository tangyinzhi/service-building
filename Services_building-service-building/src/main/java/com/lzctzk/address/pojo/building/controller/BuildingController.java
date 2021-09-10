package com.lzctzk.address.pojo.building.controller;

import com.lzctzk.address.dao.building.entity.BuildAtt;
import com.lzctzk.address.dao.building.entity.OtBuilding;
import com.lzctzk.address.pojo.building.entity.Building;
import com.lzctzk.address.pojo.building.servcie.BuildingService;
import com.lzctzk.address.pojo.building.servcie.CountService;
import com.lzctzk.address.util.result.Result;
import io.swagger.annotations.Api;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * com.lzctzk.address.pojo.building.controller
 *
 * @author luozhen
 * @version V1.0
 * @date 2019/2/12 09:44
 * @description
 */
@Api(tags = "建筑物属性数据操作控制器")
@RestController
@RequestMapping("/building")
public class BuildingController {

    private static final Logger log = LoggerFactory.getLogger(BuildingController.class);

    @Autowired
    private BuildingService buildingService;

    @Autowired
    private CountService countService;


    @PostMapping(value = "save")
    public Result save(@RequestBody BuildAtt building) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取到的数据为{}", building.toString());
        return buildingService.save(building);
    }

    @PostMapping(value = "saveBtMap")
    public Result saveBtMap(@RequestBody Map<String, Object> content) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取到的数据为{}", content.toString());
        return buildingService.saveBtMap(content);
    }

    @PostMapping(value = "add")
    public Result add(@RequestBody OtBuilding otBuilding) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取到的数据为{}", otBuilding.toString());
        return buildingService.save(otBuilding);
    }

    @PostMapping(value = "delete/{id}")
    public Result delete(@PathVariable("id") String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取到的数据为{}", id);
        return buildingService.delete(id);
    }

    @GetMapping(value = "getAll")
    public Result getAll() {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        return buildingService.getAll();
    }

    @PostMapping(value = "select")
    @ResponseBody
    public Result select(@RequestBody Building building) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取到的数据{}", building.toString());
        return buildingService.getBySelect(building);
    }

    @PostMapping(value = "selectMap")
    @ResponseBody
    public Result selectMap(@RequestBody Map<String, Object> content) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取到的数据{}", content.toString());
        return buildingService.getMapBySelect(content);
    }

    @GetMapping(value = "selectMapByLikeValue")
    public Result selectMapByLikeValue(String likeValue) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取到的数据{}", likeValue);
        return buildingService.getMapByLikeValue(likeValue);
    }
//    @PostMapping(value = "selectMap")
//    public Result selectMap(@RequestBody Building building) {
//        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
//        log.info("获取到的数据{}", building.toString());
//        return buildingService.getBySelect(building);
//    }

    @PostMapping(value = "select/page/{page:\\d+}/limit/{limit:\\d+}")
    public Result select(@PathVariable("page") Integer page, @PathVariable("limit") Integer limit, @RequestBody Building building) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取到的数据{}", building.toString());
        if ((page == null) || (limit == null)) {
            page = 1;
            limit = 10;
        }
        return buildingService.getBySelectPage(building, page, limit);
    }

    @GetMapping(value = "getByDynamicWithPage")
    public Result getByDynamicWithPage(Building building, Integer page, Integer limit, String likeValue) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取到的数据{}", building.toString());
        if ((page == null) || (limit == null)) {
            page = 1;
            limit = 10;
        }
        //return buildingService.getBySelectPage(building, page, limit);
        return buildingService.getSelectPageByMap(building, page, limit, likeValue);
    }

    @GetMapping(value = "getByDynamicWithPageOld")
    public Result getByDynamicWithPageOld(Building building, Integer page, Integer limit, String likeValue) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取到的数据{}", building.toString());
        if ((page == null) || (limit == null)) {
            page = 1;
            limit = 10;
        }
        return buildingService.getBySelectPage(building, page, limit);
    }

    @GetMapping(value = "getCount")
    public Result getCount(String columnName) {
        return countService.getCount(columnName);
    }

    @GetMapping(value = "getCountWithDate")
    public Result getCountWithDate(String columnName, String dateValue) {
        return countService.getCountWithDate(columnName, dateValue);
    }

    /**
     * 保存view相关参数
     *
     * @param view
     * @return
     */
    @PostMapping(value = "saveView")
    public Result saveView(@RequestBody String view) {
        return buildingService.saveView(view);
    }

    /**
     * 获取view相关参数
     *
     * @return
     */
    @GetMapping(value = "getView")
    public Result getView() {
        return buildingService.getView();
    }
}
