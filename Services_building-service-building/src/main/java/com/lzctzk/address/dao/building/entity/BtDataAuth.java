package com.lzctzk.address.dao.building.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
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
 * @since 2019-02-27
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("BT_DATA_AUTH")
@ApiModel(value = "BtDataAuth对象", description = "")
public class BtDataAuth implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "id")
    @TableId(value = "ID")
    private Long id;

    @ApiModelProperty(value = "图层名")
    @TableField("DATA_NAME")
    private String dataName;

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

    @ApiModelProperty(value = "父ID")
    @TableField("PID")
    private Long pid;

    @ApiModelProperty(value = "系统ID")
    @TableField("SYSTEM_ID")
    private String systemId;

    @ApiModelProperty(value = "系统名称")
    @TableField("SYSTEM_NAME")
    private String systemName;

    @ApiModelProperty(value = "是否删除")
    @TableField("ISDELETE")
    @TableLogic
    private Integer isdelete;


}
