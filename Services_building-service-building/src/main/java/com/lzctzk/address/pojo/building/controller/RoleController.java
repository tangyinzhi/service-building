package com.lzctzk.address.pojo.building.controller;/**
 * @author luozhen
 * @date 2019/2/26 16:33
 * @version V1.0
 * @description
 */

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.github.pagehelper.PageInfo;
import com.lzctzk.address.dao.building.entity.*;
import com.lzctzk.address.dao.building.service.*;
import com.lzctzk.address.pojo.building.servcie.LogService;
import com.lzctzk.address.pojo.building.servcie.RoleService;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultMessage;
import io.swagger.annotations.Api;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.*;

/**
 * com.lzctzk.address.pojo.building.controller
 *
 * @author luozhen
 * @version V1.0
 * @date 2019/2/26 16:33
 * @description
 */
@Api(tags = "系统控制器")
@RestController
@RequestMapping("Role")
public class RoleController {
    private static final Logger log = LoggerFactory.getLogger(RoleController.class);

    @Autowired
    LogService logService;

    @Autowired
    private IBtRoleService iBtRoleService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private IBtDataServiceService iBtDataServiceService;

    @Autowired
    private IRelaRoleDataAuthService relaRoleDataAuthService;
    @Autowired
    private IRelaRoleDataSeviceService relaRoleDataSeviceService;
    @Autowired
    private IRelaRolePermissionService relaRolePermissionService;

    @GetMapping("/getAll")
    public Result getAll() {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("查询所有角色");
        List<BtRole> result = iBtRoleService.list(null);
        PageInfo<BtRole> pageData = new PageInfo<>(result);
        Long count = Long.valueOf(pageData.getTotal());
        if (EmptyUtil.isNotEmpty(result)) {
            return ResultMessage.success(result, count);
        } else {
            return ResultMessage.error();
        }
    }

    @PostMapping("/InsertRole")
    public Result InsertRole(@RequestBody BtRole btRole) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("新增角色");
        log.info("获取的数据：{}", btRole.toString());
        try {
            LocalDateTime nowTime = LocalDateTime.now();
            btRole.setCreateTime(nowTime);
            btRole.setUpdateTime(nowTime);
            String datainfo = btRole.getDatainfo();
            btRole.setDatainfo(null);
            String permisioninfo = btRole.getRightinfo();
            btRole.setRightinfo(null);
            String datainfoerwei = btRole.getDatainfoerwei();
            btRole.setDatainfoerwei(null);
            btRole.setIsdelete(Double.valueOf(0));
            if (iBtRoleService.save(btRole)) {
                if (EmptyUtil.isNotEmpty(datainfo)) {
                    String[] DatainfoList = btRole.getDatainfo().split(",");
                    if (!BatchInsertDataAuth(DatainfoList, btRole.getId())) {
                        ResultMessage.custom(-97, "更新权限失败", null, Long.valueOf(0));
                    }
                }
                if (EmptyUtil.isNotEmpty(permisioninfo)) {
                    String[] RightfoList = btRole.getRightinfo().split(",");
                    if (!BatchInsertPermisson(RightfoList, btRole.getId())) {
                        ResultMessage.custom(-97, "更新权限失败", null, Long.valueOf(0));
                    }
                }
                return ResultMessage.success();
            } else {
                return ResultMessage.error();
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultMessage.custom(-99, e.getMessage(), null, Long.valueOf(0));
        }
    }

    @PostMapping("/UpdateRole")
    public Result UpdateRole(@RequestBody BtRole btRole) {
        logService.addLog("更新角色");
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", btRole.toString());
        btRole.setUpdateTime(LocalDateTime.now());
        String datainfo = btRole.getDatainfo();
        btRole.setDatainfo(null);
        String permisioninfo = btRole.getRightinfo();
        btRole.setRightinfo(null);
        String datainfoerwei = btRole.getDatainfoerwei();
        btRole.setDatainfoerwei(null);
        try {
            if (iBtRoleService.updateById(btRole)) {

                return ResultMessage.success();
            } else {
                return ResultMessage.error();
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultMessage.custom(-99, e.getMessage(), null, Long.valueOf(0));
        }
    }

    @PostMapping("/UpdateRoleAuth")
    public Result UpdateRoleAuth(@RequestBody BtRole btRole) {
        logService.addLog("更新角色关联");
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", btRole.toString());
        btRole.setUpdateTime(LocalDateTime.now());
        String datainfo = btRole.getDatainfo();
        btRole.setDatainfo(null);
        String permisioninfo = btRole.getRightinfo();
        btRole.setRightinfo(null);
        String datainfoerwei = btRole.getDatainfoerwei();
        btRole.setDatainfoerwei(null);

        try {
            //if (iBtRoleService.updateById(btRole)) {
            //数据权限
            if (EmptyUtil.isNotEmpty(datainfo)) {
                //先删除
                QueryWrapper<RelaRoleDataAuth> queryDataWrapper = new QueryWrapper<>();
                queryDataWrapper.lambda().eq(RelaRoleDataAuth::getRoleId, btRole.getId());
                relaRoleDataAuthService.remove(queryDataWrapper);
                //后新增

                String[] DatainfoList = datainfo.split(",");
                if (!BatchInsertDataAuth(DatainfoList, btRole.getId())) {
                    return ResultMessage.custom(-97, "更新权限失败", null, Long.valueOf(0));
                }
            }
            //功能权限
            if (EmptyUtil.isNotEmpty(permisioninfo)) {
                //先删除

                QueryWrapper<RelaRolePermission> queryWrapper = new QueryWrapper<>();
                queryWrapper.lambda().eq(RelaRolePermission::getRoleId, btRole.getId());
                relaRolePermissionService.remove(queryWrapper);
                //后新增

                String[] RightfoList = permisioninfo.split(",");
                if (!BatchInsertPermisson(RightfoList, btRole.getId())) {
                    return ResultMessage.custom(-97, "更新权限失败", null, Long.valueOf(0));
                }
            }
            //数据服务
            if (EmptyUtil.isNotEmpty(datainfoerwei)) {
                //先删除
                QueryWrapper<RelaRoleDataSevice> querySeviceWrapper = new QueryWrapper<>();
                querySeviceWrapper.lambda().eq(RelaRoleDataSevice::getRoleId, btRole.getId());
                relaRoleDataSeviceService.remove(querySeviceWrapper);
                //后新增

                String[] DataSevisceList = datainfoerwei.split(",");
                if (!BatchInsertDataSevice(DataSevisceList, btRole.getId())) {
                    return ResultMessage.custom(-97, "更新权限失败", null, Long.valueOf(0));
                }
            }
            return ResultMessage.success();
//            } else {
//                return ResultMessage.error();
//            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultMessage.custom(-99, e.getMessage(), null, Long.valueOf(0));
        }
    }

    @PostMapping("/DeleteRole")
    public Result DeleteRole(String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", id);
        logService.addLog("删除角色");
        if (iBtRoleService.removeById(id)) {
            return ResultMessage.success();
        } else {
            return ResultMessage.error();
        }
    }

    @PostMapping("/BatchDeleteRole")
    public Result BatchDeleteRole(String batchIDs) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", batchIDs);
        logService.addLog("批量删除角色");
        String[] ids;
        if (batchIDs.indexOf(",") == -1) {
            String[] cache = {batchIDs};
            ids = cache;
        } else {
            ids = batchIDs.split(",");
        }
        List<String> idList = Arrays.asList(ids);
        if (iBtRoleService.removeByIds(idList)) {
            if (EmptyUtil.isNotEmpty(idList)) {
                //数据权限删除
                QueryWrapper<RelaRoleDataAuth> queryDataWrapper = new QueryWrapper<>();
                queryDataWrapper.lambda().in(RelaRoleDataAuth::getRoleId, idList);
                if (!relaRoleDataAuthService.remove(queryDataWrapper)) {
                    return ResultMessage.custom(-97, "数据权限删除失败", null, Long.valueOf(0));
                }

                //功能权限删除
                QueryWrapper<RelaRolePermission> queryWrapper = new QueryWrapper<>();
                queryWrapper.lambda().in(RelaRolePermission::getRoleId, idList);
                if (!relaRolePermissionService.remove(queryWrapper)) {
                    return ResultMessage.custom(-97, "功能权限删除失败", null, Long.valueOf(0));
                }

                //数据服务删除
                QueryWrapper<RelaRoleDataSevice> querySeviceWrapper = new QueryWrapper<>();
                querySeviceWrapper.lambda().in(RelaRoleDataSevice::getRoleId, idList);
                if (!relaRoleDataSeviceService.remove(querySeviceWrapper)) {
                    return ResultMessage.custom(-97, "数据服务删除失败", null, Long.valueOf(0));
                }
            }
            return ResultMessage.success();
        } else {
            return ResultMessage.error();
        }
    }

    @GetMapping("/GetByID")
    public Result GetByID(String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        BtRole result = iBtRoleService.getById(id);
        logService.addLog("查询角色");
        if (EmptyUtil.isNotEmpty(result)) {
            return ResultMessage.success(result);
        } else {
            return ResultMessage.error();
        }
    }

    @GetMapping("/GetByDynamicWithPage")
    public Result GetByDynamicWithPage(BtRole BtRole, Integer page, Integer limit, String likeValue) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", BtRole.toString());
        logService.addLog("分页查询角色");
        if ((page == null) || (limit == null)) {
            page = 1;
            limit = 10;
        }
        Page<BtRole> pageData = new Page<BtRole>(page, limit);
        QueryWrapper<BtRole> queryWrapper = checkFeild(BtRole);
        if (EmptyUtil.isNotEmpty(likeValue)) {
            queryWrapper = LikeAllFeild(likeValue);
        }

        IPage<BtRole> result = iBtRoleService.page(pageData, queryWrapper);
        Long count = Long.valueOf(result.getTotal());

        return ResultMessage.success(result.getRecords(), count);
    }

    /**
     * 根据角色id查询功能权限接口
     *
     * @param id
     * @return
     */
    @GetMapping("/GetAuthtreeByRoleid")
    public Result GetAuthtreeByRoleid(String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", id);
        logService.addLog("根据角色id查询功能权限");
        try {
            List<BtPermission> result = roleService.GetPermissionByRoleid(id);
            Long count = Long.valueOf(result.size());
            //拼装树
            Map<String, Object> map = new HashMap<>();
            map.put("list", result);
            //查询checkedId
            QueryWrapper<RelaRolePermission> queryWrapper = new QueryWrapper<>();
            queryWrapper.lambda().eq(RelaRolePermission::getRoleId, id).select(RelaRolePermission::getPermissionId);
            List<Long> checkedId = new ArrayList<Long>();
            List<RelaRolePermission> list = relaRolePermissionService.list(queryWrapper);
            for (RelaRolePermission rightId : list) {
                if (EmptyUtil.isNotEmpty(rightId) && EmptyUtil.isNotEmpty(rightId.getPermissionId())) {
                    checkedId.add(rightId.getPermissionId());
                }
            }
            map.put("checkedId", checkedId.toArray());
            return ResultMessage.success(map, count);
        } catch (Exception e) {
            log.error(e.getMessage());
            logService.addLog("根据角色id查询功能权限接口异常", "错误");
            return ResultMessage.custom(-99, "根据角色id查询功能权限接口异常", null, Long.valueOf(0));
        }

    }

    /**
     * 根据角色id查询功能权限接口
     *
     * @param id
     * @return
     */
    @GetMapping("/GetDataAuthtreeByRoleid")
    public Result GetDataAuthtreeByRoleid(String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", id);
        logService.addLog("根据角色id查询功能权限");
        try {
            List<BtDataAuth> result = roleService.GetDataAuthByRoleid(id);
            Long count = Long.valueOf(result.size());
            //拼装树
            Map<String, Object> map = new HashMap<>();
            map.put("list", result);
            //查询checkedId
            QueryWrapper<RelaRoleDataAuth> queryWrapper = new QueryWrapper<>();
            queryWrapper.lambda().eq(RelaRoleDataAuth::getRoleId, id).select(RelaRoleDataAuth::getDataAuthId);
            List<Long> checkedId = new ArrayList<Long>();
            List<RelaRoleDataAuth> list = relaRoleDataAuthService.list(queryWrapper);
            for (RelaRoleDataAuth rightId : list) {
                if (EmptyUtil.isNotEmpty(rightId) && EmptyUtil.isNotEmpty(rightId.getDataAuthId())) {
                    checkedId.add(rightId.getDataAuthId());
                }
            }
            map.put("checkedId", checkedId.toArray());
            return ResultMessage.success(map, count);
        } catch (Exception e) {
            logService.addLog("根据角色id查询功能权限接口异常", "错误");
            log.error(e.getMessage());
            return ResultMessage.custom(-99, "根据角色id查询功能权限接口异常", null, Long.valueOf(0));
        }

    }

    /**
     * 根据角色id查询数据服务
     *
     * @param id
     * @return
     */
    @GetMapping("/GetDataseviceByRoleid")
    public Result GetDataseviceByRoleid(String id) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("获取的数据：{}", id);
        logService.addLog("根据角色id查询数据服务");
        try {
            List<BtDataService> result = roleService.GetDataSeviceByRoleid(id);
            Long count = Long.valueOf(result.size());
            //拼装树
            Map<String, Object> map = new HashMap<>();
            map.put("list", result);
            //查询checkedId
            QueryWrapper<RelaRoleDataSevice> queryWrapper = new QueryWrapper<>();
            queryWrapper.lambda().eq(RelaRoleDataSevice::getRoleId, id).select(RelaRoleDataSevice::getDataSeviceId);
            List<String> checkedId = new ArrayList<String>();
            List<RelaRoleDataSevice> list = relaRoleDataSeviceService.list(queryWrapper);
            for (RelaRoleDataSevice rightId : list) {
                if (EmptyUtil.isNotEmpty(rightId) && EmptyUtil.isNotEmpty(rightId.getDataSeviceId())) {
                    checkedId.add(rightId.getDataSeviceId());
                }
            }
            map.put("checkedId", checkedId.toArray());
            return ResultMessage.success(map, count);
        } catch (Exception e) {
            logService.addLog("根据角色id查询数据服务异常", "错误");
            log.error(e.getMessage());
            return ResultMessage.custom(-99, "根据角色id查询数据服务异常", null, Long.valueOf(0));
        }

    }

    public QueryWrapper checkFeild(BtRole btRole) {
        logService.addLog("查询所有角色");
        String whereClause = " 1=1";
        QueryWrapper<BtRole> queryWrapper = new QueryWrapper<>();
        if (btRole != null) {
            if (btRole.getId() != null && EmptyUtil.isNotEmpty(btRole.getId())) {
                queryWrapper.lambda().eq(BtRole::getId, btRole.getId());
            }
            if (btRole.getName() != null && EmptyUtil.isNotEmpty(btRole.getName())) {
                queryWrapper.lambda().like(BtRole::getName, btRole.getName());
            }
            if (btRole.getSystemId() != null && EmptyUtil.isNotEmpty(btRole.getSystemId())) {
                queryWrapper.lambda().eq(BtRole::getSystemId, btRole.getSystemId());
            }
        }
        return queryWrapper;
    }

    public QueryWrapper LikeAllFeild(String likeValue) {
        String whereClause = " 1=1";
        QueryWrapper<BtRole> queryWrapper = new QueryWrapper<>();

        queryWrapper.lambda().or(i -> i.like(BtRole::getName, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtRole::getDatainfo, likeValue));
        queryWrapper.lambda().or(i -> i.eq(BtRole::getId, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtRole::getSystemId, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtRole::getRightinfo, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtRole::getDatainfoerwei, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtRole::getCreateTime, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtRole::getCreateIp, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtRole::getIssystem, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtRole::getPermission, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtRole::getRemark, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtRole::getSystemName, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtRole::getSystemId, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtRole::getUpdateTime, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtRole::getCreateIp, likeValue));
        queryWrapper.lambda().and(i -> i.eq(BtRole::getIsdelete, 0));

        return queryWrapper;
    }

    /**
     * 批量添加功能权限中间表信息
     *
     * @return
     */
    private boolean BatchInsertPermisson(String[] RightfoList, String roleId) {
        try {
            if (RightfoList != null && RightfoList.length > 0) {
                for (String rightId : RightfoList) {
                    RelaRolePermission dataAuth = new RelaRolePermission();
                    dataAuth.setRoleId(roleId);
                    dataAuth.setPermissionId(Long.parseLong(rightId));
                    if (!relaRolePermissionService.save(dataAuth)) {
                        return false;
                    }
                }
            }
            return true;
        } catch (Exception e) {
            logService.addLog("批量添加功能权限中间表信息异常", "错误");
            log.error(e.getMessage());
            return false;
        }
    }

    /**
     * 批量添加数据权限中间表信息
     *
     * @return
     */
    private boolean BatchInsertDataAuth(String[] RightfoList, String roleId) {
        try {
            logService.addLog("查询所有角色");
            if (RightfoList != null && RightfoList.length > 0) {
                for (String rightId : RightfoList) {
                    RelaRoleDataAuth dataAuth = new RelaRoleDataAuth();
                    dataAuth.setRoleId(roleId);
                    dataAuth.setDataAuthId(Long.parseLong(rightId));
                    if (!relaRoleDataAuthService.save(dataAuth)) {
                        return false;
                    }
                }
            }
            return true;
        } catch (Exception e) {
            logService.addLog("批量添加数据权限中间表信息异常", "错误");
            log.error(e.getMessage());
            return false;
        }
    }

    /**
     * 批量添加数据服务中间表信息
     *
     * @return
     */
    private boolean BatchInsertDataSevice(String[] dataSeviceList, String roleId) {
        try {
            if (dataSeviceList != null && dataSeviceList.length > 0) {
                for (String rightId : dataSeviceList) {
                    RelaRoleDataSevice dataSevice = new RelaRoleDataSevice();
                    dataSevice.setRoleId(roleId);
                    dataSevice.setDataSeviceId(rightId);
                    if (!relaRoleDataSeviceService.save(dataSevice)) {
                        return false;
                    }
                }
            }
            return true;
        } catch (Exception e) {
            log.error(e.getMessage());
            return false;
        }
    }
}
