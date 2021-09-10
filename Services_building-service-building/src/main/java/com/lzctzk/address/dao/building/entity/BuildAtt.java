package com.lzctzk.address.dao.building.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

/**
 * <p>
 *
 * </p>
 *
 * @author luozhen
 * @since 2019-03-21
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("BUILD_ATT")
@ApiModel(value = "BuildAtt对象", description = "")
public class BuildAtt implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableField("OBJECTID")
    private Double objectid;

    @TableId(value = "OB_ID", type = IdType.UUID)
    private String obId;

    @TableField("OB_CODE")
    private String obCode;

    @TableField("OB_NAME")
    private String obName;

    @TableField("OB_ADDR")
    private String obAddr;

    @TableField("OB_LD_AREA")
    private Double obLdArea;

    @TableField("OB_FLOOR_AREA")
    private Double obFloorArea;

    @TableField("OB_USAGE")
    private String obUsage;

    @TableField("OB_BASE_FORM")
    private String obBaseForm;

    @TableField("OB_STRU")
    private String obStru;

    @TableField("OB_UP_FLOOR")
    private Integer obUpFloor;

    @TableField("OB_DOWN_FLOOR")
    private Integer obDownFloor;

    @TableField("OB_FLOOR_HEIGHT")
    private Double obFloorHeight;

    @TableField("OB_HEIGHT")
    private Double obHeight;

    @TableField("OB_DOOR_NUM")
    private Integer obDoorNum;

    @TableField("OB_ELEVATOR_INFO")
    private String obElevatorInfo;

    @TableField("OB_DOWN_INFO")
    private String obDownInfo;

    @TableField("OB_AIR_DEFENCE_INFO")
    private String obAirDefenceInfo;

    @TableField("OB_FIRE_CONTROL_INFO")
    private String obFireControlInfo;

    @TableField("OB_PROPERTY_UNIT")
    private String obPropertyUnit;

    @TableField("OB_PROPERTY_NO")
    private String obPropertyNo;

    @JsonFormat(pattern = "yyyy-MM")
    @TableField("OB_COMP_DATE")
    private Date obCompDate;

    @TableField("OB_DESIGN_CRITERIA")
    private String obDesignCriteria;

    @TableField("OB_DRAWING_PATH")
    private String obDrawingPath;

    @TableField("OB_STATUS")
    private String obStatus;

    @TableField("OB_GEOLOGY_INFO")
    private String obGeologyInfo;

    @TableField("OB_ADD_TIME")
    private LocalDateTime obAddTime;

    @TableField("OB_UPDATE_TIME")
    private LocalDateTime obUpdateTime;

    @TableField("OB_ISDELETE")
    @TableLogic
    private Integer obIsdelete;

    @TableField("OB_AREA")
    private String obArea;

    @TableField("OB_UP_INFO")
    private String obUpInfo;

    @TableField("OB_MODEL_NAME")
    private String obModelName;

    @TableField("OB_PROPERTY_NAME")
    private String obPropertyName;

    @TableField("SHAPE")
    private String shape;

    @TableField("OB_IMAGE_INFO")
    private String obImageInfo;


}
