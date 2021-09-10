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
 *
 * </p>
 *
 * @author luozhen
 * @since 2019-02-26
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("BT_SYSTEM")
@ApiModel(value = "BtSystem对象", description = "")
public class BtSystem implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "系统ID")
    @TableId(value = "SYSTEMID", type = IdType.UUID)
    private String systemid;

    @ApiModelProperty(value = "系统名称")
    @TableField("SYSTEMNAME")
    private String systemname;

    @ApiModelProperty(value = "系统说明")
    @TableField("DESCRIPTION")
    private String description;

    @ApiModelProperty(value = "创建人ID")
    @TableField("CREATEUSERID")
    private Long createuserid;

    @ApiModelProperty(value = "创建IP")
    @TableField("CREATEIP")
    private String createip;

    @ApiModelProperty(value = "创建时间")
    @TableField("CREATETIME")
    private LocalDateTime createtime;

    @ApiModelProperty(value = "更新人ID")
    @TableField("UPDATEUSERID")
    private String updateuserid;

    @ApiModelProperty(value = "更新IP")
    @TableField("UPDATEIP")
    private String updateip;

    @ApiModelProperty(value = "更新时间")
    @TableField("UPDATETIME")
    private LocalDateTime updatetime;

    @ApiModelProperty(value = "判断是否删除")
    @TableField("ISDELETE")
    @TableLogic
    private Integer isdelete;


}
