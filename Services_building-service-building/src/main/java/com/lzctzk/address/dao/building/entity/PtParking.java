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
import java.time.LocalDateTime;

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
@TableName("PT_PARKING")
@ApiModel(value = "PtParking对象", description = "")
public class PtParking implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "主键UUID")
    @TableId(value = "PARKING_ID", type = IdType.UUID)
    private String parkingId;

    @ApiModelProperty(value = "停车位类型（路内、公共停车位、其它）")
    @TableField("PARKING_TYPE")
    private String parkingType;

    @ApiModelProperty(value = "地形类型（坡地、平坦）")
    @TableField("PARKING_TERRAIN")
    private String parkingTerrain;

    @ApiModelProperty(value = "管理单位名称")
    @TableField("PARKING_UNIT_NAME")
    private String parkingUnitName;

    @ApiModelProperty(value = "周边设施（灯杆、摄像头）")
    @TableField("PARKING_FACILITY")
    private String parkingFacility;

    @ApiModelProperty(value = "备注")
    @TableField("PARKING_REMARK")
    private String parkingRemark;

    @ApiModelProperty(value = "联系人姓名")
    @TableField("PARKING_PERSON_NAME")
    private String parkingPersonName;

    @ApiModelProperty(value = "联系人电话")
    @TableField("PARKING_PERSON_TEL")
    private String parkingPersonTel;

    @ApiModelProperty(value = "关联图片附件ID")
    @TableField("PARKING_ATTACH_ID")
    private String parkingAttachId;

    @ApiModelProperty(value = "A点坐标：存的所有点坐标")
    @TableField("PARKING_LOCAL_A")
    private String parkingLocalA;

    @ApiModelProperty(value = "B点坐标：分割的个数")
    @TableField("PARKING_LOCAL_B")
    private String parkingLocalB;

    @ApiModelProperty(value = "C点坐标：是否连续的标志")
    @TableField("PARKING_LOCAL_C")
    private String parkingLocalC;

    @ApiModelProperty(value = "D点坐标：新增的批次号")
    @TableField("PARKING_LOCAL_D")
    private String parkingLocalD;

    @ApiModelProperty(value = "中心点坐标")
    @TableField("PARKING_LOCAL_CORE")
    private String parkingLocalCore;

    @ApiModelProperty(value = "周边供需")
    @TableField("PARKING_PSAD")
    private String parkingPsad;

    @ApiModelProperty(value = "车位合理性")
    @TableField("PARKING_RATIONAL")
    private String parkingRational;

    @ApiModelProperty(value = "采集人员编码")
    @TableField("PARKING_COLLECTER_NUM")
    private String parkingCollecterNum;

    @ApiModelProperty(value = "采集人员姓名")
    @TableField("PARKING_COLLECTER_NAME")
    private String parkingCollecterName;

    @ApiModelProperty(value = "采集时间")
    @TableField("PARKING_COLLECTION_DATE")
    private LocalDateTime parkingCollectionDate;

    @ApiModelProperty(value = "最后一次更新时间")
    @TableField("PARKING_LAST_TIME")
    private LocalDateTime parkingLastTime;

    @ApiModelProperty(value = "停车位状态，用于审批")
    @TableField("PARKING_STATUS")
    private String parkingStatus;

    @ApiModelProperty(value = "停车位属性，例如：有无分隔线")
    @TableField("PARKING_ATTRIBUTE")
    private String parkingAttribute;

    @ApiModelProperty(value = "是否收费")
    @TableField("PARKING_ISCHARGE")
    private String parkingIscharge;

    @ApiModelProperty(value = "是否分时段停车")
    @TableField("PARKING_DAYPARTING")
    private String parkingDayparting;

    @ApiModelProperty(value = "是否有智能化改造")
    @TableField("PARKING_ISREFORM")
    private String parkingIsreform;


}
