package com.lzctzk.address.pojo.building.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * com.lzctzk.address.pojo.building.mapper
 *
 * @author luozhen
 * @version V1.0
 * @date 2019-3-22 15:26
 * @description
 */
@Mapper
public interface CountMapper {

    List<Map> getCount(@Param("columnName") String columnName, @Param("tableName") String tableName);

    int getCountByDate(@Param("value") String value, @Param("tableName") String tableName);
}
