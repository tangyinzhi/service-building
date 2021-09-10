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
 * @author dengjie
 * @since 2019-03-01
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("RELA_ROLE_DATA_SEVICE")
@ApiModel(value = "RelaRoleDataSevice对象", description = "")
public class RelaRoleDataSevice implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "主键ID")
    @TableId(value = "ID", type = IdType.UUID)
    private String id;

    @ApiModelProperty(value = "角色ID")
    @TableField("ROLE_ID")
    private String roleId;

    @ApiModelProperty(value = "二维维数据权限ID")
    @TableField("DATA_SEVICE_ID")
    private String dataSeviceId;


}
