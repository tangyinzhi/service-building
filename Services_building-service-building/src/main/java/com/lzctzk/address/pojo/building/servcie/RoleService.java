package com.lzctzk.address.pojo.building.servcie;


import com.lzctzk.address.dao.building.entity.BtDataAuth;
import com.lzctzk.address.dao.building.entity.BtDataService;
import com.lzctzk.address.dao.building.entity.BtPermission;
import com.lzctzk.address.pojo.building.mapper.PermissionMapper;
import com.lzctzk.address.pojo.building.mapper.RoleMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author dengjie
 * @since 2019-02-27
 */
@Service
public class RoleService {

    private static final Logger log = LoggerFactory.getLogger(BuildingService.class);
    @Autowired
    private RoleMapper roleMapper;

    /**
     * 查询总记录数
     *
     * @return
     */
    public Long selectCount() {
        log.info("进入==>服务：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());

        return roleMapper.selectCount();
    }

    /**
     * 查询最大ID
     *
     * @return
     */
    public Long selectMaxID() {
        log.info("进入==>服务：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        return roleMapper.selectMaxID();
    }

    /**
     * 根据角色id查询功能权限
     *
     * @return
     */
    public List<BtPermission> GetPermissionByRoleid(String roleId) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        return roleMapper.selectPermissionByRoleid(roleId);
    }

    /**
     * 根据角色id查询数据权限
     *
     * @return
     */
    public List<BtDataAuth> GetDataAuthByRoleid(String roleId) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        return roleMapper.selectDataAuthByRoleid(roleId);
    }

    /**
     * 根据角色id查询数据服务权限
     *
     * @return
     */
    public List<BtDataService> GetDataSeviceByRoleid(String roleId) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        return roleMapper.selectDataSeviceByRoleid(roleId);
    }
}
