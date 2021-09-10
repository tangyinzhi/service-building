package com.lzctzk.address.dao.building.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;

import java.io.Serializable;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 *
 * </p>
 *
 * @author luozhen
 * @since 2019-04-02
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("BT_COLUMNS_COMMENTS")
@ApiModel(value = "BtColumnsComments对象", description = "")
public class BtColumnsComments implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "表名")
    @TableField("TABLE_NAME_S")
    private String tableNameS;

    @ApiModelProperty(value = "字段名")
    @TableField("COLUMN_NAME_S")
    private String columnNameS;

    @ApiModelProperty(value = "数据类型")
    @TableField("DATA_TYPE")
    private String dataType;

    @ApiModelProperty(value = "数据存储长度")
    @TableField("DATA_LENGTH")
    private Long dataLength;

    @ApiModelProperty(value = "数据精确度")
    @TableField("DATA_PRECISION")
    private String dataPrecision;

    @ApiModelProperty(value = "数据比例")
    @TableField("DATA_SCALE")
    private String dataScale;

    @ApiModelProperty(value = "是否为空")
    @TableField("NULLABLE_S")
    private String nullableS;

    @ApiModelProperty(value = "字段id")
    @TableField("COLUMN_ID")
    private Long columnId;

    @ApiModelProperty(value = "字段注释")
    @TableField("COMMENTS")
    private String comments;

    @ApiModelProperty(value = "是否可见")
    @TableField("NULLENABLE")
    private String nullenable;

    @ApiModelProperty(value = "主键ID")
    @TableId(value = "ID", type = IdType.UUID)
    private String id;

    @ApiModelProperty(value = "默认值")
    @TableField("DATA_DEFAULT")
    private String dataDefault;

    @ApiModelProperty(value = "是否删除标志")
    @TableField("ISDELETE")
    private Integer isdelete;

    @ApiModelProperty(value = "是否有枚举值")
    @TableField("NULLENUM")
    private String nullenum;


}
