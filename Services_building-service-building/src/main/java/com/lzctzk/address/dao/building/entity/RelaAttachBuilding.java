package com.lzctzk.address.dao.building.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;

import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.TableField;

import java.io.Serializable;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 关联表RELA_ATTACH_BUILDING
 * </p>
 *
 * @author luozhen
 * @since 2019-02-27
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("RELA_ATTACH_BUILDING")
@ApiModel(value = "RelaAttachBuilding对象", description = "关联表RELA_ATTACH_BUILDING")
public class RelaAttachBuilding implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "唯一标识编码")
    @TableId(value = "RAB_ID", type = IdType.UUID)
    private String rabId;

    @ApiModelProperty(value = "附件唯一编码")
    @TableField("RAB_OA_ID")
    private String rabOaId;

    @ApiModelProperty(value = "建筑物唯一编码")
    @TableField("RAB_OB_ID")
    private String rabObId;

    @ApiModelProperty(value = "最后更新时间")
    @TableField("RAB_LAST_TIME")
    private LocalDateTime rabLastTime;


}
