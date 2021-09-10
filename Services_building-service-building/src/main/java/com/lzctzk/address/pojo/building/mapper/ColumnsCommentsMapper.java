package com.lzctzk.address.pojo.building.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.lzctzk.address.dao.building.entity.BtColumnsComments;

import java.util.List;

/**
 * @author luozhen
 * @version V1.0
 * @date 2019/2/13 15:21
 * @description
 */
@Mapper
public interface ColumnsCommentsMapper {
    public int AddColumn(BtColumnsComments ColumnsComment);

    public int UpdateColumn(BtColumnsComments ColumnsComment);

    public int ChangeComments(BtColumnsComments ColumnsComment);

    public int ChangeName(@Param("tableNameS") String tableNameS, @Param("oldName") String oldName, @Param("newName") String newName);

    /**
     * 获取表格的字段
     *
     * @return
     */
    public List<BtColumnsComments> selectYSColumns(@Param("columnNameS") String columnNameS);

    public List<String> selectColumnNameS(@Param("nullenable") String nullenable);

}
