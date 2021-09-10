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
@TableName("PT_ATTACH_PARKING")
@ApiModel(value = "PtAttachParking对象", description = "")
public class PtAttachParking implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "主键UUID")
    @TableId(value = "ATTACH_ID", type = IdType.UUID)
    private String attachId;

    @ApiModelProperty(value = "关联编号")
    @TableField("ATTACH_RELA_ID")
    private String attachRelaId;

    @ApiModelProperty(value = "附件的业务名（示例：“地址图片”）")
    @TableField("ATTACH_PROF_NAME")
    private String attachProfName;

    @ApiModelProperty(value = "相对路径文件名（包含相对文件根目录路径、存储文件名、文件类型 示例：Attach/2018/04/27/cf0c0c36af544d799bbe275047eeec55.jpg）")
    @TableField("ATTACH_FPF_NAME")
    private String attachFpfName;

    @ApiModelProperty(value = "存储文件名 示例：8e2968afedebb20eb133df3763d187022df22596")
    @TableField("ATTACH_SAVE_NAME")
    private String attachSaveName;

    @ApiModelProperty(value = "附件物理存储路径 示例：E:/commonFiles/cksl/Attach/2018/04/27")
    @TableField("ATTACH_PATH")
    private String attachPath;

    @ApiModelProperty(value = "文件类型 示例：.jpg")
    @TableField("ATTACH_TYPE")
    private String attachType;

    @ApiModelProperty(value = "文件大小")
    @TableField("ATTACH_SIZE")
    private String attachSize;

    @ApiModelProperty(value = "附件备注")
    @TableField("ATTACH_REMARK")
    private String attachRemark;

    @ApiModelProperty(value = "附件状态00-废弃(未绑定) 01-有效(已绑定)")
    @TableField("ATTACH_STATUS")
    private String attachStatus;

    @ApiModelProperty(value = "附件上传时间")
    @TableField("ATTACH_UPLOAD_TIME")
    private LocalDateTime attachUploadTime;

    @ApiModelProperty(value = "删除字段标识")
    @TableField("ATTACH_DELETE_STATUS")
    private String attachDeleteStatus;

}
