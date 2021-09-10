package com.lzctzk.address.pojo.building.servcie;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lzctzk.address.dao.building.entity.BtUserGroup;
import com.lzctzk.address.dao.building.entity.RelaGroupRole;
import com.lzctzk.address.dao.building.mapper.BtUserGroupMapper;
import com.lzctzk.address.dao.building.mapper.RelaGroupRoleMapper;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultEnum;
import com.lzctzk.address.util.result.ResultMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * com.lzctzk.address.pojo.building.servcie
 *
 * @author luozhen
 * @version V1.0
 * @date 2019-3-11 15:35
 * @description
 */
@Service
public class UserGroupService {

    private static final Logger log = LoggerFactory.getLogger(UserGroupService.class);

    @Autowired
    private BtUserGroupMapper btUserGroupMapper;

    @Autowired
    private RelaGroupRoleMapper relaGroupRoleMapper;
    @Autowired
    LogService logService;

    public Result getAll() {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        List<BtUserGroup> result = btUserGroupMapper.selectList(null);
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
     * @date 2019-3-11 17:36
     */
    public Result save(BtUserGroup userGroup) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        LocalDateTime nowDate = LocalDateTime.now();
        userGroup.setUpdateTime(nowDate);
        int result;
        if (EmptyUtil.isEmpty(userGroup.getGroupId())) {
            logService.addLog("新增用户组");
            //新增
            userGroup.setIsdelete(0);
            userGroup.setCreateTime(nowDate);
            String roleIds = userGroup.getCreateIp();
            userGroup.setCreateIp(null);
            result = btUserGroupMapper.insert(userGroup);
            if (result > 0) {
                //角色关系新增
                if (EmptyUtil.isNotEmpty(roleIds)) {
                    String[] roleList = CommonMethod.division(roleIds, ",");
                    if (!batchInsertRole(roleList, userGroup.getGroupId())) {
                        return ResultMessage.custom(-97, "新增用户组的角色失败", null, 0);
                    }
                }
                return ResultMessage.success(null, result);
            } else {
                return ResultMessage.error(ResultEnum.ADDERROR);
            }
        } else {
            logService.addLog("修改用户组");
            //修改
            String roleIds = userGroup.getCreateIp();
            userGroup.setCreateIp(null);
            result = btUserGroupMapper.updateById(userGroup);
            if (result > 0) {
                //角色
                //先删除
                QueryWrapper<RelaGroupRole> queryDataWrapper = new QueryWrapper<>();
                queryDataWrapper.lambda().eq(RelaGroupRole::getDataGroupId, userGroup.getGroupId());
                int deleteData = relaGroupRoleMapper.delete(queryDataWrapper);
                log.info("删除数据条数：{}", deleteData);
                //后新增
                if (EmptyUtil.isNotEmpty(roleIds)) {
                    String[] roleList = CommonMethod.division(roleIds, ",");
                    if (!batchInsertRole(roleList, userGroup.getGroupId())) {
                        return ResultMessage.custom(-97, "新增用户组的角色失败", null, 0);
                    }
                }
                return ResultMessage.success(null, result);
            } else {
                return ResultMessage.error(ResultEnum.UPDATEEROR);
            }
        }
    }

    /**
     * 批量添加角色中间表信息
     *
     * @return
     */
    private boolean batchInsertRole(String[] rightForList, String groupId) {
        if (EmptyUtil.isNotEmpty(rightForList)) {
            int count = 0;
            for (String rightId : rightForList) {
                RelaGroupRole groupRole = new RelaGroupRole();
                groupRole.setDataGroupId(groupId);
                groupRole.setRoleId(rightId);
                int result;
                result = relaGroupRoleMapper.insert(groupRole);
                if (result > 0) {
                    count++;
                } else {
                    return false;
                }
            }
            log.info("角色中间表数据添加条数：{}", count);
            return true;
        } else {
            log.info("角色中间表数据添加失败");
            return false;
        }
    }

    /**
     * 功能描述: 删除数据
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:37
     */
    public Result delete(String batchIDs) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        List<String> idList = CommonMethod.divisionToList(batchIDs, ",");
        int result = btUserGroupMapper.deleteBatchIds(idList);
        if (result > 0) {
            //删除中间表信息
            log.info("删除数据条数：{}", result);
            QueryWrapper<RelaGroupRole> queryDataWrapper = new QueryWrapper<>();
            queryDataWrapper.lambda().in(RelaGroupRole::getDataGroupId, idList);
            int deleteData = relaGroupRoleMapper.delete(queryDataWrapper);
            if (deleteData <= 0) {
                return ResultMessage.custom(-97, "删除用户组的角色失败", null, 0);
            }
            return ResultMessage.success();
        } else {
            return ResultMessage.error(ResultEnum.DELETEERROR);
        }
    }

    /**
     * 功能描述: 查询数据，获取单条
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:37
     */
    public Result getById(String id) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        BtUserGroup result = btUserGroupMapper.selectById(id);
        if (EmptyUtil.isNotEmpty(result)) {
            //查询checkedId
            QueryWrapper<RelaGroupRole> queryWrapper = new QueryWrapper<>();
            List<RelaGroupRole> list = relaGroupRoleMapper.selectList(queryWrapper);
            if (EmptyUtil.isNotEmpty(list)) {
                //用于存储角色ID
                String creatId = "";
                for (RelaGroupRole rightId : list) {
                    if (EmptyUtil.isNotEmpty(rightId) && EmptyUtil.isNotEmpty(rightId.getRoleId())) {
                        if ("".equals(creatId)) {
                            creatId = rightId.getRoleId();
                            continue;
                        }
                        creatId = creatId + "," + rightId.getRoleId();
                    }
                }
                result.setCreateIp(creatId);
            }
            return ResultMessage.success(result);
        } else {
            return ResultMessage.error();
        }
    }

    /**
     * 功能描述: 动态查询数据，分页
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:38
     */
    public Result getByDynamicWithPage(BtUserGroup userGroup, Integer page, Integer limit, String likeValue) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        Page<BtUserGroup> pageData = new Page<>(page, limit);
        QueryWrapper<BtUserGroup> queryWrapper = checkField(userGroup);
        if (EmptyUtil.isNotEmpty(likeValue)) {
            queryWrapper = LikeAllFeild(likeValue);
        }
        IPage<BtUserGroup> result = btUserGroupMapper.selectPage(pageData, queryWrapper);
        Object data = result.getRecords();
        long count = result.getTotal();
        if (count > 0) {
            return ResultMessage.success(data, count);
        } else {
            return ResultMessage.custom(0, "查询数据为空", null, count);
        }
    }

    /**
     * 功能描述: 用于查询时拼接查询条件
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019/2/28 20:59
     */
    private QueryWrapper<BtUserGroup> checkField(BtUserGroup userGroup) {
        QueryWrapper<BtUserGroup> queryWrapper = new QueryWrapper<>();
        if (EmptyUtil.isNotEmpty(userGroup.getGroupId())) {
            queryWrapper.lambda().eq(BtUserGroup::getGroupId, userGroup.getGroupId());
        }
        if (EmptyUtil.isNotEmpty(userGroup.getGroupName())) {
            queryWrapper.lambda().like(BtUserGroup::getGroupName, userGroup.getGroupName());
        }
        queryWrapper.lambda().and(i -> i.eq(BtUserGroup::getIsdelete, 0));
        return queryWrapper;
    }

    /**
     * 功能描述: 检查是否重复
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019-3-11 17:06
     */
    public Result checkGroupName(String name, String id) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        QueryWrapper<BtUserGroup> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(BtUserGroup::getGroupName, name);
        List<BtUserGroup> result = btUserGroupMapper.selectList(queryWrapper);
        for (int i = 0; i < result.size(); i++) {
            BtUserGroup user = result.get(i);
            if (EmptyUtil.isNotEmpty(id) && user.getGroupId().equals(id)) {
                result.remove(user);
            }
        }
        if (result.size() > 0) {
            return ResultMessage.custom(ResultEnum.EXISTERROR, ResultEnum.EXISTERROR.getMsg());
        } else {
            return ResultMessage.success();
        }
    }

    public QueryWrapper LikeAllFeild(String likeValue) {
        String whereClause = " 1=1";
        QueryWrapper<BtUserGroup> queryWrapper = new QueryWrapper<>();

        queryWrapper.lambda().or(i -> i.like(BtUserGroup::getGroupName, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUserGroup::getCreateTime, likeValue));
        queryWrapper.lambda().or(i -> i.eq(BtUserGroup::getGroupId, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUserGroup::getGroupType, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUserGroup::getRemarks, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUserGroup::getUpdateTime, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUserGroup::getCreateTime, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUserGroup::getCreateIp, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUserGroup::getUpdateUserId, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtUserGroup::getGroupId, likeValue));
        queryWrapper.lambda().and(i -> i.eq(BtUserGroup::getIsdelete, 0));

        return queryWrapper;
    }
}
