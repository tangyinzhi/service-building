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
 * @author dengjie
 * @since 2019-03-01
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("BT_USER_GROUP")
@ApiModel(value = "BtUserGroup对象", description = "")
public class BtUserGroup implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "主键ID")
    @TableId(value = "GROUP_ID", type = IdType.UUID)
    private String groupId;

    @ApiModelProperty(value = "用户组名")
    @TableField("GROUP_NAME")
    private String groupName;

    @ApiModelProperty(value = "用户组类型")
    @TableField("GROUP_TYPE")
    private String groupType;

    @ApiModelProperty(value = "创建人ID")
    @TableField("CREATE_USER_ID")
    private String createUserId;

    @ApiModelProperty(value = "创建IP")
    @TableField("CREATE_IP")
    private String createIp;

    @ApiModelProperty(value = "创建时间")
    @TableField("CREATE_TIME")
    private LocalDateTime createTime;

    @ApiModelProperty(value = "更新人ID")
    @TableField("UPDATE_USER_ID")
    private String updateUserId;

    @ApiModelProperty(value = "更新IP")
    @TableField("UPDATE_IP")
    private String updateIp;

    @ApiModelProperty(value = "更新时间")
    @TableField("UPDATE_TIME")
    private LocalDateTime updateTime;

    @ApiModelProperty(value = "判断是否删除")
    @TableField("ISDELETE")
    @TableLogic
    private Integer isdelete;

    @ApiModelProperty(value = "备注")
    @TableField("REMARKS")
    private String remarks;


}
