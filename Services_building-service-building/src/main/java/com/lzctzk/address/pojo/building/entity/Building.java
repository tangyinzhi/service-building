package com.lzctzk.address.pojo.building.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 建筑物属性表OT_BUILDING
 * </p>
 *
 * @author luozhen
 * @since 2019-02-13
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value = "Building对象", description = "专用于搜索")
public class Building implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "唯一标识")
    @TableId(value = "OB_ID")
    private String obId;

    @ApiModelProperty(value = "建筑编码")
    @TableField("OB_CODE")
    private String obCode;

    @ApiModelProperty(value = "建筑名称")
    @TableField("OB_NAME")
    private String obName;

    @ApiModelProperty(value = "详细地址")
    @TableField("OB_ADDR")
    private String obAddr;

    @ApiModelProperty(value = "基底面积")
    @TableField("OB_LD_AREA")
    private Double obLdArea;

    @ApiModelProperty(value = "建筑面积")
    @TableField("OB_FLOOR_AREA")
    private Double obFloorArea;

    @ApiModelProperty(value = "建筑用途")
    @TableField("OB_USAGE")
    private String obUsage;

    @ApiModelProperty(value = "基础形式")
    @TableField("OB_BASE_FORM")
    private String obBaseForm;

    @ApiModelProperty(value = "结构类型")
    @TableField("OB_STRU")
    private String obStru;

    @ApiModelProperty(value = "建筑层数（地上）")
    @TableField("OB_UP_FLOOR")
    private Integer obUpFloor;

    @ApiModelProperty(value = "建筑层数（地下）")
    @TableField("OB_DOWN_FLOOR")
    private Integer obDownFloor;

    @ApiModelProperty(value = "建筑层高")
    @TableField("OB_FLOOR_HEIGHT")
    private Double obFloorHeight;

    @ApiModelProperty(value = "建筑高度")
    @TableField("OB_HEIGHT")
    private Double obHeight;

    @ApiModelProperty(value = "住宅建筑户数")
    @TableField("OB_DOOR_NUM")
    private Integer obDoorNum;

    @ApiModelProperty(value = "电梯信息")
    @TableField("OB_ELEVATOR_INFO")
    private List<String> obElevatorInfo;

    @ApiModelProperty(value = "地下空间利用信息")
    @TableField("OB_DOWN_INFO")
    private List<String> obDownInfo;

    @ApiModelProperty(value = "人防疏散信息")
    @TableField("OB_AIR_DEFENCE_INFO")
    private String obAirDefenceInfo;

    @ApiModelProperty(value = "消防疏散及救援信息")
    @TableField("OB_FIRE_CONTROL_INFO")
    private String obFireControlInfo;

    @ApiModelProperty(value = "产权单位")
    @TableField("OB_PROPERTY_UNIT")
    private String obPropertyUnit;

    @ApiModelProperty(value = "房屋产权登记号")
    @TableField("OB_PROPERTY_NO")
    private String obPropertyNo;

    @ApiModelProperty(value = "建造年代")
    @TableField("OB_COMP_DATE")
    private LocalDate obCompDate;

    @ApiModelProperty(value = "设计标准")
    @TableField("OB_DESIGN_CRITERIA")
    private List<String> obDesignCriteria;

    @ApiModelProperty(value = "图纸信息")
    @TableField("OB_DRAWING_PATH")
    private String obDrawingPath;

    @ApiModelProperty(value = "建筑状态")
    @TableField("OB_STATUS")
    private String obStatus;

    @ApiModelProperty(value = "地质状况")
    @TableField("OB_GEOLOGY_INFO")
    private String obGeologyInfo;

    @ApiModelProperty(value = "添加时间")
    @TableField("OB_ADD_TIME")
    private LocalDateTime obAddTime;

    @ApiModelProperty(value = "修改时间")
    @TableField("OB_UPDATE_TIME")
    private LocalDateTime obUpdateTime;

    @ApiModelProperty(value = "是否删除")
    @TableField("OB_ISDELETE")
    @TableLogic
    private Integer obIsdelete;

    @ApiModelProperty(value = "备注")
    @TableField("OB_BZ")
    private String obBz;

    @ApiModelProperty(value = "经度")
    @TableField("OB_LONGITUDE")
    private String obLongitude;

    @ApiModelProperty(value = "纬度")
    @TableField("OB_LATITUDE")
    private String obLatitude;

    @TableField("OB_AREA")
    private String obArea;

    @TableField("OB_UP_INFO")
    private String obUpInfo;

    @TableField("OB_MODEL_NAME")
    private String obModelName;

    @TableField("OB_PROPERTY_NAME")
    private String obPropertyName;

    @TableField("OB_IMAGE_INFO")
    private String obImageInfo;
}
