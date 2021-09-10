package com.lzctzk.address.pojo.building.mapper;


import com.lzctzk.address.dao.building.entity.BtDataAuth;
import com.lzctzk.address.dao.building.entity.BtDataService;
import com.lzctzk.address.dao.building.entity.BtPermission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.HashMap;
import java.util.List;

/**
 * <p>
 * Mapper 接口
 * </p>
 *
 * @author dengjie
 * @since 2019-03-03
 */
@Mapper
public interface LogMapper {
    List<HashMap> selectUserTolCount(String clown);

    List<HashMap> selectIPTolCount(String clown);

    List<HashMap> selectTypeTolCount(String clown);

    List<HashMap> selectTimeTolCount(String clown);

    List<HashMap> selectTolCount(@Param("clown") String clown);


}
