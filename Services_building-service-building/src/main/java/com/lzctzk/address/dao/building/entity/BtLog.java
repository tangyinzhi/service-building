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
 *
 * </p>
 *
 * @author dengjie
 * @since 2019-03-02
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("BT_LOG")
@ApiModel(value = "BtLog对象", description = "")
public class BtLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "主键")
    @TableId(value = "ID", type = IdType.UUID)
    private String id;

    @ApiModelProperty(value = "用户")
    @TableField("LOGUSER")
    private String loguser;

    @ApiModelProperty(value = "IP地址")
    @TableField("LOG_IP")
    private String logIp;

    @ApiModelProperty(value = "信息类型")
    @TableField("LOG_TYPE")
    private String logType;

    @ApiModelProperty(value = "时间")
    @TableField("LOG_TIME")
    private LocalDateTime logTime;

    @ApiModelProperty(value = "信息内容")
    @TableField("LOG_MESSAGE")
    private String logMessage;

    @ApiModelProperty(value = "插件名")
    @TableField("PLUG_NAME")
    private String plugName;


}
