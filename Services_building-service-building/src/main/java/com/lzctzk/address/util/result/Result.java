package com.lzctzk.address.util.result;

import lombok.Getter;
import lombok.Setter;

/**
 * 功能描述: 返回值类
 *
 * @param
 * @author luozhen
 * @return
 * @date 2018-11-15 10:22
 */
@Getter
@Setter
public class Result {
    private int code;

    private String msg;

    private int status;

    private Object data;

    private long count;

    Result(int code, String msg, int status, Object data, long count) {
        this.code = code;
        this.msg = msg;
        this.status = status;
        this.data = data;
        this.count = count;
    }

    Result(ResultEnum resultEnum, int status, Object data, long count) {
        this(resultEnum);
        this.status = status;
        this.data = data;
        this.count = count;
    }


    Result(ResultEnum resultEnum, int status, Object data) {
        this(resultEnum);
        this.status = status;
        this.data = data;
    }


    Result(ResultEnum resultEnum, int status) {
        this(resultEnum);
        this.status = status;
    }

    Result(ResultEnum resultEnum) {
        this.code = resultEnum.getCode();
        this.msg = resultEnum.getMsg();
    }
}
