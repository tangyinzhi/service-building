package com.lzctzk.address.pojo.building.mapper;

import com.lzctzk.address.dao.building.entity.OtAttach;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * @author luozhen
 * @version V1.0
 * @date 2019/2/13 15:21
 * @description
 */
@Mapper
public interface AttachBuildingMapper {
    List<OtAttach> selectInnerById(@Param("obId") String obId);

    List<OtAttach> selectInnerByIdEdit(@Param("obId") String obId);

    int updateBuildyMap(@Param("content") Map<String, Object> content, @Param("obId") String obId);

    int updateObBuildyMap(@Param("content") Map<String, Object> content, @Param("obId") String obId);

    int insertBuildyMap(@Param("content") Map<String, Object> content);

    List<Map<String, Object>> selectByMap(@Param("cloums") List<String> cloums, @Param("cloumsValue") String cloumsValue, @Param("tableName") String tableName, @Param("sql") String sql);

    List<Map<String, Object>> selectPageByMap(@Param("cloums") List<String> cloums, @Param("cloumsValue") String cloumsValue, @Param("sql") List<String> sql, @Param("end") Integer end, @Param("start") Integer start, @Param("isAppVal") Boolean isAppVal);

    Integer selectPageByMapCount(@Param("cloums") List<String> cloums, @Param("cloumsValue") String cloumsValue, @Param("tableName") String tableName, @Param("sql") String sql, @Param("isAppVal") Boolean isAppVal);

    int selectMaxObjectId();
}
