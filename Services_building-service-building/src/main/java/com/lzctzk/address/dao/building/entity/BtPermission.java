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
@TableName("BT_PERMISSION")
@ApiModel(value = "BtPermission对象", description = "")
public class BtPermission implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "权限ID")
    @TableId(value = "ID", type = IdType.UUID)
    private Long id;

    @ApiModelProperty(value = "名称")
    @TableField("NAME")
    private String name;

    @ApiModelProperty(value = "显示名")
    @TableField("DISPLAY_NAME")
    private String displayName;

    @ApiModelProperty(value = "全名")
    @TableField("FULLNAME")
    private String fullname;

    @ApiModelProperty(value = "父编号")
    @TableField("PARENTID")
    private Long parentid;

    @ApiModelProperty(value = "链接")
    @TableField("URL")
    private String url;

    @ApiModelProperty(value = "排序")
    @TableField("SORT")
    private Long sort;

    @ApiModelProperty(value = "图标(样式)")
    @TableField("ICON")
    private String icon;

    @ApiModelProperty(value = "可见")
    @TableField("VISIBLE")
    private String visible;

    @ApiModelProperty(value = "必要")
    @TableField("NECESSARY")
    private String necessary;

    @ApiModelProperty(value = "备注")
    @TableField("REMARK")
    private String remark;

    @ApiModelProperty(value = "权限（菜单）类型（0菜单，1目录，2按钮，-1系统名称）")
    @TableField("BP_TYPE")
    private String bpType;

    @ApiModelProperty(value = "权限字符串")
    @TableField("PERMISSION_STRING")
    private String permissionString;

    @ApiModelProperty(value = "标签")
    @TableField("TAG")
    private String tag;

    @ApiModelProperty(value = "权限级别")
    @TableField("BP_LEVEL")
    private String bpLevel;

    @ApiModelProperty(value = "title")
    @TableField("TITLE")
    private String title;

    @ApiModelProperty(value = "创建人ID")
    @TableField("CREATE_USERID")
    private Long createUserid;

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

    @ApiModelProperty(value = "系统ID")
    @TableField("SYSTEM_ID")
    private String systemId;

    @ApiModelProperty(value = "系统名称")
    @TableField("SYSTEM_NAME")
    private String systemName;

    @ApiModelProperty(value = "判断是否删除标志")
    @TableField("ISDELETE")
    @TableLogic
    private Integer isdelete;


}
