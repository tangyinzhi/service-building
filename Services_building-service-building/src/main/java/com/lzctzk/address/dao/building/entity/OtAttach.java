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
 * 图片附件表OT_ATTACH
 * </p>
 *
 * @author luozhen
 * @since 2019-04-13
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("OT_ATTACH")
@ApiModel(value = "OtAttach对象", description = "图片附件表OT_ATTACH")
public class OtAttach implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "主键UUID")
    @TableId(value = "OA_ID", type = IdType.UUID)
    private String oaId;

    @ApiModelProperty(value = "附件的业务名（示例：“地址图片”）")
    @TableField("OA_PROF_NAME")
    private String oaProfName;

    @ApiModelProperty(value = "相对路径文件名（包含相对文件根目录路径、存储文件名、文件类型 示例：Attach/2018/04/27/cf0c0c36af544d799bbe275047eeec55.jpg）")
    @TableField("OA_FPF_NAME")
    private String oaFpfName;

    @ApiModelProperty(value = "存储文件名 示例：8e2968afedebb20eb133df3763d187022df22596")
    @TableField("OA_SAVE_NAME")
    private String oaSaveName;

    @ApiModelProperty(value = "附件物理存储路径 示例：E:/commonFiles/cksl/Attach/2018/04/27")
    @TableField("OA_PATH")
    private String oaPath;

    @ApiModelProperty(value = "文件类型 示例：.jpg")
    @TableField("OA_TYPE")
    private String oaType;

    @ApiModelProperty(value = "文件大小")
    @TableField("OA_SIZE")
    private String oaSize;

    @ApiModelProperty(value = "附件备注")
    @TableField("OA_REMARK")
    private String oaRemark;

    @ApiModelProperty(value = "附件状态00-废弃(未绑定) 01-有效(已绑定)")
    @TableField("OA_STATUS")
    private String oaStatus;

    @ApiModelProperty(value = "附件上传时间")
    @TableField("OA_UPLOAD_TIME")
    private LocalDateTime oaUploadTime;

    @ApiModelProperty(value = "是否删除（0：未删，1：删除）")
    @TableField("OA_IS_DELETE")
    private Integer oaIsDelete;

    @ApiModelProperty(value = "附件关联编号")
    @TableField("OA_RELE_ID")
    private String oaReleId;

    @ApiModelProperty(value = "附件关联业务类型")
    @TableField("OA_RELE_TYPE")
    private String oaReleType;


}
