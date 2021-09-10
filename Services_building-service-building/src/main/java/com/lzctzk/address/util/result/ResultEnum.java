package com.lzctzk.address.util.result;

import lombok.Getter;

/**
 * 功能描述: 枚举类
 *
 * @param
 * @author luozhen
 * @return
 * @date 2019/2/28 20:32
 */
@Getter
public enum ResultEnum {

    SUCCESS(0, "成功"),
    ERROR(-1, "失败"),
    FULLERROR(-1, "未知错误"),
    UPLOADSUCCESS(1, "文件上传成功"),
    UPLOADERROR(-2, "文件上传出现异常"),
    EXISTERROR(-1, "此数据已存在"),
    ADDERROR(-1, "添加数据错误"),
    UPDATEEROR(-1, "更新数据错误"),
    DELETEERROR(-1, "删除数据错误"),
    SELECTERROR(-1, "查询数据错误"),
    NUllERROR(-1, "参数为空");


    private int code;
    private String msg;

    ResultEnum(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }


}
