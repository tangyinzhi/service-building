package com.lzctzk.address.pojo.building.mapper;


import org.apache.ibatis.annotations.Mapper;

/**
 * <p>
 * Mapper 接口
 * </p>
 *
 * @author dengjie
 * @since 2019-02-27
 */
@Mapper
public interface PermissionMapper {
    Long selectCount();

    Long selectMaxID();
}
