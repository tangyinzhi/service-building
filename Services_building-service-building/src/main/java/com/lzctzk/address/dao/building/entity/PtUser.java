package com.lzctzk.address.dao.building.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * <p>
 *
 * </p>
 *
 * @author luozhen
 * @since 2018-11-26
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("PT_USER")
@ApiModel(value = "PtUser对象", description = "")
public class PtUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "主键UUID")
    @TableId(value = "USER_ID", type = IdType.UUID)
    private String userId;

    @ApiModelProperty(value = "账号名")
    @TableField("USER_NAME")
    private String userName;

    @ApiModelProperty(value = "登录密码")
    @TableField("USER_PASSWORD")
    private String userPassword;

    @ApiModelProperty(value = "组")
    @TableField("USER_GROUP")
    private String userGroup;

    @ApiModelProperty(value = "人员")
    @TableField("USER_PERSON")
    private String userPerson;


}
