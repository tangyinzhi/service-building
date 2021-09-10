package com.lzctzk.address.pojo.building.servcie;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lzctzk.address.dao.building.entity.BtPermission;
import com.lzctzk.address.dao.building.entity.BtUser;
import com.lzctzk.address.dao.building.mapper.BtUserMapper;
import com.lzctzk.address.pojo.building.mapper.CustomMapper;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultEnum;
import com.lzctzk.address.util.result.ResultMessage;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * com.lzctzk.address.pojo.building.servcie
 *
 * @author luozhen
 * @version V1.0
 * @date 2019/3/1 16:04
 * @description
 */
@Service
public class TuserService {

    private static final Logger log = LoggerFactory.getLogger(TuserService.class);
    @Autowired
    LogService logService;

    @Resource
    private BtUserMapper btUserMapper;

    @Resource
    private CustomMapper customMapper;

    /**
     * 功能描述: 保存数据
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:52
     */
    public Result save(BtUser btUser) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        LocalDateTime nowTime = LocalDateTime.now();
        int result;
        if (EmptyUtil.isEmpty(btUser.getId())) {
            //新增数据
            logService.addLog("新增用户");
            btUser.setRegistertime(nowTime);
            btUser.setIsdelete(0);
            result = btUserMapper.insert(btUser);
            if (result > 0) {
                return ResultMessage.success(null, result);
            } else {
                return ResultMessage.error(ResultEnum.ADDERROR);
            }
        } else {
            logService.addLog("修改用户");
            //修改数据
            result = btUserMapper.updateById(btUser);
            if (result > 0) {
                return ResultMessage.success(null, result);
            } else {
                return ResultMessage.error(ResultEnum.UPDATEEROR);
            }
        }
    }

    /**
     * 功能描述: 批量删除数据
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:48
     */
    public Result delete(String batchIds) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("删除用户");
        List<String> idList = CommonMethod.divisionToList(batchIds, ",");
        int result = btUserMapper.deleteBatchIds(idList);
        if (result > 0) {
            return ResultMessage.success(null, result);
        } else {
            return ResultMessage.error(ResultEnum.DELETEERROR);
        }
    }

    /**
     * 功能描述: 批量修改状态
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:48
     */
    public Result batchUpdateStatus(String batchIds, String enable) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("修改用户");
        List<String> idList = CommonMethod.divisionToList(batchIds, ",");
        UpdateWrapper<BtUser> queryWrapper = new UpdateWrapper<>();
        queryWrapper.lambda().in(BtUser::getId, idList);
        BtUser newUser = new BtUser();
        newUser.setEnable(enable);
        int result = btUserMapper.update(newUser, queryWrapper);
        if (result > 0) {
            return ResultMessage.success(null, result);
        } else {
            return ResultMessage.error(ResultEnum.UPDATEEROR);
        }
    }

    /**
     * 功能描述: 获取单条数据
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:48
     */
    public Result getById(String id) {
        logService.addLog("查询用户");
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        BtUser result = btUserMapper.selectById(id);
        if (EmptyUtil.isNotEmpty(result)) {
            return ResultMessage.success(result, 1);
        } else {
            return ResultMessage.error(ResultEnum.SELECTERROR);
        }
    }

    /**
     * 功能描述: 动态查询（分页）
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:47
     */
    public Result getByDynamicWithPage(BtUser btUser, Integer page, Integer limit, String likeValue) {
        logService.addLog("查询用户");
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        Page<BtUser> pageData = new Page<>(page, limit);
        QueryWrapper<BtUser> queryWrapper = checkField(btUser);
        if (EmptyUtil.isNotEmpty(likeValue)) {
            queryWrapper = LikeAllFeild(likeValue);
        }
        IPage<BtUser> result = btUserMapper.selectPage(pageData, queryWrapper);
        Object data = result.getRecords();
        long count = pageData.getTotal();
        if (count > 0) {
            return ResultMessage.success(data, count);
        } else {
            return ResultMessage.custom(0, "查询数据为空", null, count);
        }
    }

    /**
     * 功能描述: 用于查询时拼接查询条件
     *
     * @author luozhen
     * @date 2019/2/28 20:59
     */
    private QueryWrapper<BtUser> checkField(BtUser user) {
        QueryWrapper<BtUser> queryWrapper = new QueryWrapper<>();
        if (EmptyUtil.isNotEmpty(user.getId())) {
            queryWrapper.lambda().eq(BtUser::getId, user.getId());
        }
        if (EmptyUtil.isNotEmpty(user.getName())) {
            queryWrapper.lambda().like(BtUser::getName, user.getName());
        }
        if (EmptyUtil.isNotEmpty(user.getDisplayname())) {
            queryWrapper.lambda().like(BtUser::getDisplayname, user.getDisplayname());
        }
        if (EmptyUtil.isNotEmpty(user.getSex())) {
            queryWrapper.lambda().eq(BtUser::getSex, user.getSex());
        }
        if (EmptyUtil.isNotEmpty(user.getMail())) {
            queryWrapper.lambda().like(BtUser::getMail, user.getMail());
        }
        if (EmptyUtil.isNotEmpty(user.getCode())) {
            queryWrapper.lambda().like(BtUser::getCode, user.getCode());
        }
        return queryWrapper;
    }

    /**
     * 功能描述: 检查是否重复
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:46
     */
    public Result checkName(String name, String id) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());

        QueryWrapper<BtUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(BtUser::getId, name);
        List<BtUser> result = btUserMapper.selectList(queryWrapper);
        for (int i = 0; i < result.size(); i++) {
            BtUser user = result.get(i);
            if (EmptyUtil.isNotEmpty(id) && user.getId().equals(id)) {
                result.remove(user);
            }
        }
        if (result.size() > 0) {
            return ResultMessage.custom(ResultEnum.EXISTERROR, ResultEnum.EXISTERROR.getMsg());
        } else {
            return ResultMessage.success();
        }
    }

    /**
     * 功能描述: 根据用户ID和系统ID查询权限
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:46
     */
    public Result getGetAuthoritByUserId(String userId, String systemId) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("查询权限");
        if (EmptyUtil.isNotEmpty(userId) && EmptyUtil.isNotEmpty(systemId)) {
            Map<String, Object> result = new HashMap<>();
            List<String> dataInfoList = customMapper.getDataAuth(userId, systemId);
            String dataInfo = String.join(",", dataInfoList);
            result.put("dataInfo", dataInfo);
            List<BtPermission> rightMenuInfoList = customMapper.getPermissionBySelect(userId, systemId, "0", null, null);
            result.put("rightMenuInfo", rightMenuInfoList);

            //第一层
            List<BtPermission> rightInfoList1 = customMapper.getPermissionBySelect(userId, systemId, null, null, "1");
            if (EmptyUtil.isNotEmpty(rightInfoList1) && rightInfoList1.size() > 0) {
                List<Object> item1 = new ArrayList<>();
                for (BtPermission rightInfo1 : rightInfoList1) {
                    Map<String, Object> map1 = new HashMap<>();
                    map1.put("id", rightInfo1.getName());
                    map1.put("name", rightInfo1.getDisplayName());
                    map1.put("title", rightInfo1.getTitle());
                    map1.put("tag", rightInfo1.getTag());
                    map1.put("src", rightInfo1.getIcon());
                    map1.put("pid", rightInfo1.getParentid());
                    map1.put("srcd", rightInfo1.getUrl());
                    //第二层
                    List<BtPermission> rightInfoList2 = customMapper.getPermissionBySelect(userId, systemId, null, rightInfo1.getId().toString(), null);
                    if (EmptyUtil.isNotEmpty(rightInfoList2) && rightInfoList2.size() > 0) {
                        List<Object> item2 = new ArrayList<>();
                        for (BtPermission rightInfo2 : rightInfoList2) {
                            Map<String, Object> map2 = new HashMap<>();
                            map2.put("id", rightInfo2.getName());
                            map2.put("name", rightInfo2.getDisplayName());
                            map2.put("title", rightInfo2.getTitle());
                            map2.put("tag", rightInfo2.getTag());
                            map2.put("src", rightInfo2.getIcon());
                            map2.put("srcd", rightInfo2.getUrl());
                            //第三层
                            List<BtPermission> rightInfoList3 = customMapper.getPermissionBySelect(userId, systemId, null, rightInfo2.getId().toString(), null);
                            if (EmptyUtil.isNotEmpty(rightInfoList3) && rightInfoList3.size() > 0) {
                                List<Object> item3 = new ArrayList<>();
                                for (BtPermission rightInfo3 : rightInfoList3) {
                                    Map<String, Object> map3 = new HashMap<>();
                                    map3.put("id", rightInfo3.getName());
                                    map3.put("name", rightInfo3.getDisplayName());
                                    map3.put("title", rightInfo3.getTitle());
                                    map3.put("tag", rightInfo3.getTag());
                                    map3.put("src", rightInfo3.getIcon());
                                    map3.put("srcd", rightInfo3.getUrl());
                                    item3.add(map3);
                                }
                                map2.put("item", item3);
                            }
                            item2.add(map2);
                        }
                        map1.put("item", item2);
                    }
                    item1.add(map1);
                }
                result.put("rightInfo", item1);
            }
            return ResultMessage.success(result);
        } else {
            return ResultMessage.error(ResultEnum.NUllERROR);
        }
    }

    /**
     * 功能描述: 登录验证
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:41
     */
    public Result login(BtUser user) {
        QueryWrapper<BtUser> queryWrapper = new QueryWrapper<>();
//        queryWrapper.lambda().eq(BtUser::getName, user.getName());
        queryWrapper.lambda().eq(BtUser::getName,"admin");
        BtUser userTrue = btUserMapper.selectOne(queryWrapper);
        log.info(userTrue.getId());
        log.info(userTrue.getName());
        log.info(userTrue.getPassword());
        /*if (EmptyUtil.isEmpty(userTrue)) {
            return ResultMessage.error();
        } else {
            if (user.getPassword().equals(userTrue.getPassword())) {
                UsernamePasswordToken usernamePasswordToken = new UsernamePasswordToken(user.getName(), user.getPassword());
                Subject subject = SecurityUtils.getSubject();
                try {
                    subject.login(usernamePasswordToken);   //完成登录
                } catch (Exception e) {
                    log.error(e.getMessage());
                    return ResultMessage.error();
                }
                return ResultMessage.success(userTrue);
            } else {
                return ResultMessage.custom(-1, "用户名或密码", "用户名或密码错误", 0);
            }
        }*/
        UsernamePasswordToken usernamePasswordToken = new UsernamePasswordToken(userTrue.getName(),userTrue.getPassword());
        Subject subject = SecurityUtils.getSubject();
        subject.login(usernamePasswordToken);
        return ResultMessage.success(userTrue);
        //return ResultMessage.custom(-1,"用户名或密码","用户名或密码错误",0);
    }

    public QueryWrapper LikeAllFeild(String likeValue) {
        String whereClause = " 1=1";
        QueryWrapper<BtUser> queryWrapper = new QueryWrapper<>();

        queryWrapper.lambda().or(i -> i.like(BtUser::getName, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUser::getCode, likeValue));
        queryWrapper.lambda().or(i -> i.eq(BtUser::getId, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUser::getDisplayname, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUser::getRemarks, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUser::getMail, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUser::getSex, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUser::getEnable, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUser::getLastlogiontime, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUser::getMobile, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUser::getAvatae, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUser::getLogions, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUser::getOnlines, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUser::getUserGroup, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUser::getRoleid, likeValue));
        queryWrapper.lambda().and(i -> i.eq(BtUser::getIsdelete, 0));

        return queryWrapper;
    }
}
