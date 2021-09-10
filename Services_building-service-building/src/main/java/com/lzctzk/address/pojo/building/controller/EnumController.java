package com.lzctzk.address.pojo.building.controller;

import com.lzctzk.address.dao.building.entity.PtEnum;
import com.lzctzk.address.pojo.building.servcie.EnumService;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultEnum;
import com.lzctzk.address.util.result.ResultMessage;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * com.lzctzk.address.pojo.building.controller
 *
 * @author luozhen
 * @version V1.0
 * @date 2019/2/20 10:28
 * @description
 */
@Api(tags = "枚举类型属性控制器")
@RestController
@RequestMapping("enum")
public class EnumController {

    private static final Logger log = LoggerFactory.getLogger(EnumController.class);

    @Autowired
    private EnumService enumService;

    @ApiOperation(value = "获取所有的数据")
    @GetMapping(value = "getAll")
    public Result getEnum() {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        return enumService.getAll();
    }

    @ApiOperation(value = "动态查询", notes = "传入对象的字段值，根据字段值进行查询")
    @GetMapping(value = "GetByDynamicWith")
    public Result getByDynamic(PtEnum ptEnum) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", ptEnum.toString());
        return enumService.getByDynamic(ptEnum);
    }

    @ApiOperation(value = "动态查询（分页）", notes = "传入对象的字段值，根据字段值进行查询")
    @GetMapping(value = "GetByDynamicWithPage")
    public Result getByDynamicPage(PtEnum ptEnum, Integer page, Integer limit, String likeValue) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", ptEnum.toString());
        if ((page == null) || (limit == null)) {
            page = 1;
            limit = 10;
        }
        return enumService.getByDynamicPage(ptEnum, page, limit, likeValue);
    }

    @ApiOperation(value = "保存数据", notes = "判断是否传入id，没有为新增，有为编辑")
    @PostMapping(value = "save")
    public Result save(PtEnum ptEnum) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        return enumService.save(ptEnum);
    }

    @ApiOperation(value = "删除数据", notes = "传入id字符串，若为批量删除，使用逗号拼接")
    @GetMapping(value = "delete/{id}")
    public Result delete(@PathVariable("id") String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        if (EmptyUtil.isNotEmpty(id)) {
            return enumService.delete(id);
        } else {
            return ResultMessage.error(ResultEnum.NUllERROR);
        }
    }
}
