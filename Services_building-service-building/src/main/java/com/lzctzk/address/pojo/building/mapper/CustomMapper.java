package com.lzctzk.address.pojo.building.mapper;

import com.lzctzk.address.dao.building.entity.BtPermission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 功能描述: 自定义sql操作
 *
 * @param
 * @author luozhen
 * @return
 * @date 2019-3-7 9:22
 */
@Mapper
public interface CustomMapper {

    /**
     * @param userId
     * @param systemId
     * @return
     */
    List<BtPermission> getPermission(@Param("userId") String userId, @Param("systemId") String systemId);

    List<String> getDataAuth(@Param("userId") String userId, @Param("systemId") String systemId);

    List<BtPermission> getPermissionBySelect(@Param("userId") String userId, @Param("systemId") String systemId, @Param("type") String type, @Param("parentId") String parentId, @Param("level") String level);

}
