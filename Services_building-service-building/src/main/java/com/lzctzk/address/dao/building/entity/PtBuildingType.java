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
 * @since 2019-02-12
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("PT_BUILDING_TYPE")
@ApiModel(value = "PtBuildingType对象", description = "")
public class PtBuildingType implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "唯一标识")
    @TableId(value = "PBT_ID", type = IdType.UUID)
    private String pbtId;

    @ApiModelProperty(value = "类别代码")
    @TableField("PBT_CODE")
    private String pbtCode;

    @ApiModelProperty(value = "父类代码")
    @TableField("PBT_PARENT")
    private String pbtParent;

    @ApiModelProperty(value = "代码级别")
    @TableField("PBT_LEVEL")
    private Integer pbtLevel;

    @ApiModelProperty(value = "类别名称")
    @TableField("PBT_NAME")
    private String pbtName;

    @ApiModelProperty(value = "类别说明")
    @TableField("PBT_COMMENT")
    private String pbtComment;

}
