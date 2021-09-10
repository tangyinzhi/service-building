package com.lzctzk.address.dao.building.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <p>
 * 变量枚举表
 * </p>
 *
 * @author luozhen
 * @since 2019-03-11
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("PT_ENUM")
@ApiModel(value = "PtEnum对象", description = "变量枚举表")
public class PtEnum implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "唯一标识")
    @TableId(value = "PE_ID", type = IdType.UUID)
    private String peId;

    @ApiModelProperty(value = "枚举名称")
    @TableField("PE_NAME")
    private String peName;

    @ApiModelProperty(value = "对应表")
    @TableField("PE_TABLE")
    private String peTable;

    @ApiModelProperty(value = "对应表名")
    @TableField("PE_TABLE_NAME")
    private String peTableName;

    @ApiModelProperty(value = "对应字段")
    @TableField("PE_PARAMETER")
    private String peParameter;

    @ApiModelProperty(value = "对应字段名")
    @TableField("PE_PARAMETER_NAME")
    private String peParameterName;

    @ApiModelProperty(value = "添加时间")
    @TableField("PE_ADD_TIME")
    private LocalDateTime peAddTime;

    @ApiModelProperty(value = "修改时间")
    @TableField("PE_UPDATE_TIME")
    private LocalDateTime peUpdateTime;

    @ApiModelProperty(value = "备注")
    @TableField("PE_BZ")
    private String peBz;

    @ApiModelProperty(value = "是否删除的标识")
    @TableField("PE_ISDELETE")
    @TableLogic
    private Integer peIsdelete;


}
