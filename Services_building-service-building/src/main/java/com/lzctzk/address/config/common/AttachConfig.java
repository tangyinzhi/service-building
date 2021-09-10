package com.lzctzk.address.config.common;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * com.lzctzk.address.config.common
 *
 * @author luozhen
 * @version V1.0
 * @date 2019-4-11 16:57
 * @description
 */
@Data
@Component
public class AttachConfig {

    @Value("${attach.fpf-name}")
    private String fpfName;

    /**
     * 附件存储地址
     */
    @Value("${attach.url}")
    private String url;

    /**
     * 附件的业务名
     */
    @Value("${attach.prof-name}")
    private String profName;

    /**
     * 附件默认状态 未启用
     */
    @Value("${attach.status.unused}")
    private String unused;

    /**
     * 附件状态 启用
     */
    @Value("${attach.status.used}")
    private String used;

    /**
     * 临时附件存储地址
     */
    @Value("${attach.temp-url}")
    private String tempUrl;

}
