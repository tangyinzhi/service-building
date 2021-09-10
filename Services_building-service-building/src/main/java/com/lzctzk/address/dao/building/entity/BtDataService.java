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
 * @since 2019-02-27
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("BT_DATA_SERVICE")
@ApiModel(value = "BtDataService对象", description = "")
public class BtDataService implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "主键ID")
    @TableId(value = "ID", type = IdType.UUID)
    private String id;

    @ApiModelProperty(value = "服务名")
    @TableField("SERVICES_NAME")
    private String servicesName;

    @ApiModelProperty(value = "服务全名")
    @TableField("SERVICES_FULLNAME")
    private String servicesFullname;

    @ApiModelProperty(value = "服务类型")
    @TableField("SERVICES_TYPE")
    private String servicesType;

    @ApiModelProperty(value = "服务描述信息")
    @TableField("SERVICES_DESCRIPTION")
    private String servicesDescription;

    @ApiModelProperty(value = "服务地址")
    @TableField("SERVICES_ADDR")
    private String servicesAddr;

    @ApiModelProperty(value = "帮助地址")
    @TableField("SERVICES_HELP_ADDR")
    private String servicesHelpAddr;

    @ApiModelProperty(value = "示例地址")
    @TableField("SERVICES_SAMPLE_ADDR")
    private String servicesSampleAddr;

    @ApiModelProperty(value = "最新修改时间")
    @TableField("HANDER_DATE")
    private LocalDateTime handerDate;

    @ApiModelProperty(value = "最新修改人")
    @TableField("HANDER_ID")
    private String handerId;

    @ApiModelProperty(value = "创建时间")
    @TableField("CREATE_DATE")
    private LocalDateTime createDate;

    @ApiModelProperty(value = "创建人")
    @TableField("CREATE_ID")
    private String createId;

    @ApiModelProperty(value = "访问次数")
    @TableField("VISITS_NUMBER")
    private Long visitsNumber;

    @ApiModelProperty(value = "安全级别")
    @TableField("SECURITY_LEVEL")
    private Long securityLevel;

    @ApiModelProperty(value = "服务详细")
    @TableField("SERVICES_DETAILS")
    private String servicesDetails;

    @ApiModelProperty(value = "关键字")
    @TableField("KEYWORD")
    private String keyword;

    @ApiModelProperty(value = "地图范围")
    @TableField("MAPRANGE")
    private String maprange;

    @ApiModelProperty(value = "系统ID")
    @TableField("SYSTEM_ID")
    private String systemId;

    @ApiModelProperty(value = "系统名称")
    @TableField("SYSTEM_NAME")
    private String systemName;

    @ApiModelProperty(value = "判断是否删除")
    @TableField("ISDELETE")
    @TableLogic
    private Integer isdelete;


}
