package com.lzctzk.address.pojo.building.mapper;


import com.lzctzk.address.dao.building.entity.BtDataAuth;
import com.lzctzk.address.dao.building.entity.BtDataService;
import com.lzctzk.address.dao.building.entity.BtPermission;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * <p>
 * Mapper 接口
 * </p>
 *
 * @author dengjie
 * @since 2019-02-27
 */
@Mapper
public interface RoleMapper {
    Long selectCount();

    Long selectMaxID();

    List<BtPermission> selectPermissionByRoleid(String roleId);

    List<BtDataService> selectDataSeviceByRoleid(String roleId);

    List<BtDataAuth> selectDataAuthByRoleid(String roleId);
}
