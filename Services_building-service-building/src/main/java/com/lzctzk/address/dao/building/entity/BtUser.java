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
@TableName("BT_USER")
@ApiModel(value = "BtUser对象", description = "")
public class BtUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "登录名")
    @TableField("NAME")
    private String name;

    @ApiModelProperty(value = "登录密码")
    @TableField("PASSWORD")
    private String password;

    @ApiModelProperty(value = "昵称")
    @TableField("DISPLAYNAME")
    private String displayname;

    @ApiModelProperty(value = "性别（0男 1女）")
    @TableField("SEX")
    private String sex;

    @ApiModelProperty(value = "邮件")
    @TableField("MAIL")
    private String mail;

    @ApiModelProperty(value = "手机")
    @TableField("MOBILE")
    private String mobile;

    @ApiModelProperty(value = "编码")
    @TableField("CODE")
    private String code;

    @ApiModelProperty(value = "头像")
    @TableField("AVATAE")
    private String avatae;

    @ApiModelProperty(value = "用户组Id")
    @TableField("ROLEID")
    private String roleid;

    @ApiModelProperty(value = "角色组。次要角色集合")
    @TableField("ROLEIDS")
    private String roleids;

    @ApiModelProperty(value = "是否在线（1在线 0在线）")
    @TableField("ONLINES")
    private String onlines;

    @ApiModelProperty(value = "是否可用（1可用 0不可用）")
    @TableField("ENABLE")
    private String enable;

    @ApiModelProperty(value = "登录次数")
    @TableField("LOGIONS")
    private Double logions;

    @ApiModelProperty(value = "上次登录时间")
    @TableField("LASTLOGIONTIME")
    private LocalDateTime lastlogiontime;

    @ApiModelProperty(value = "上次登录IP")
    @TableField("LASTLOGIONIP")
    private String lastlogionip;

    @ApiModelProperty(value = "注册时间")
    @TableField("REGISTERTIME")
    private LocalDateTime registertime;

    @ApiModelProperty(value = "注册IP")
    @TableField("REGISTERIP")
    private String registerip;

    @ApiModelProperty(value = "备注")
    @TableField("REMARKS")
    private String remarks;

    @ApiModelProperty(value = "用户组")
    @TableField("USER_GROUP")
    private String userGroup;

    @ApiModelProperty(value = "主键ID")
    @TableId(value = "ID", type = IdType.UUID)
    private String id;

    @ApiModelProperty(value = "判断是否删除")
    @TableField("ISDELETE")
    @TableLogic
    private Integer isdelete;

}
