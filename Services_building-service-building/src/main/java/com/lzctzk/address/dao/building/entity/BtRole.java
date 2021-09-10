package com.lzctzk.address.dao.building.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
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
 * @author dengjie
 * @since 2019-03-01
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("BT_ROLE")
@ApiModel(value = "BtRole对象", description = "")
public class BtRole implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "主键ID（角色ID）")
    @TableField("ID")
    private String id;

    @ApiModelProperty(value = "角色名")
    @TableField("NAME")
    private String name;

    @ApiModelProperty(value = "是否是管理员（1是，0不是）")
    @TableField("ISSYSTEM")
    private String issystem;

    @ApiModelProperty(value = "备注")
    @TableField("REMARK")
    private String remark;

    @ApiModelProperty(value = "权限")
    @TableField("PERMISSION")
    private String permission;

    @ApiModelProperty(value = "系统ID")
    @TableField("SYSTEM_ID")
    private String systemId;

    @ApiModelProperty(value = "系统名称")
    @TableField("SYSTEM_NAME")
    private String systemName;

    @ApiModelProperty(value = "功能权限")
    @TableField("RIGHTINFO")
    private String rightinfo;

    @ApiModelProperty(value = "数据权限(三维服务)")
    @TableField("DATAINFO")
    private String datainfo;

    @ApiModelProperty(value = "创建人ID")
    @TableField("CREATE_USERID")
    private String createUserid;

    @ApiModelProperty(value = "创建IP")
    @TableField("CREATE_IP")
    private String createIp;

    @ApiModelProperty(value = "创建时间")
    @TableField("CREATE_TIME")
    private LocalDateTime createTime;

    @ApiModelProperty(value = "更新人ID")
    @TableField("UPDATE_USERID")
    private String updateUserid;

    @ApiModelProperty(value = "更新IP")
    @TableField("UPDATE_IP")
    private String updateIp;

    @ApiModelProperty(value = "更新时间")
    @TableField("UPDATE_TIME")
    private LocalDateTime updateTime;

    @ApiModelProperty(value = "数据权限(二维服务)")
    @TableField("DATAINFOERWEI")
    private String datainfoerwei;

    @ApiModelProperty(value = "是否删除标志")
    @TableField("ISDELETE")
    @TableLogic
    private Double isdelete;


}
