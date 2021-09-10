package com.lzctzk.address.util.result;


/**
 * 功能描述: 定制返回值
 *
 * @param
 * @author luozhen
 * @return
 * @date 2018-9-20 15:27
 */
public class ResultMessage {

    public static Result success() {
        return new Result(ResultEnum.SUCCESS, 200);
    }

    public static Result success(Object data) {
        return new Result(ResultEnum.SUCCESS, 200, data);
    }

    public static Result success(Object data, long count) {
        return new Result(ResultEnum.SUCCESS, 200, data, count);
    }

    public static Result error(long count) {
        return new Result(ResultEnum.ERROR, 200, null, count);
    }

    public static Result error() {
        return new Result(ResultEnum.FULLERROR, 200);
    }

    public static Result error(ResultEnum resultEnum) {
        return new Result(resultEnum, 200);
    }

    public static Result custom(ResultEnum resultEnum) {
        return new Result(resultEnum, 200);
    }

    public static Result custom(ResultEnum resultEnum, Object data) {
        return new Result(resultEnum, 200, data);
    }

    public static Result custom(ResultEnum resultEnum, Object data, long count) {
        return new Result(resultEnum, 200, data, count);
    }

    public static Result custom(int code, String msg, Object data, long count) {
        return new Result(code, msg, 200, data, count);
    }
}
