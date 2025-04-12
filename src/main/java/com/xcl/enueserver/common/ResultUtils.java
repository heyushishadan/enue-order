package com.xcl.enueserver.common;

import com.xcl.enueserver.common.BaseResponse;

public class ResultUtils {
    public static <T> BaseResponse<T> success(T data) {
        BaseResponse<T> response = new BaseResponse<>();
        response.setCode(0);
        response.setData(data);
        response.setMessage("success");
        return response;
    }

    public static <T> BaseResponse<T> error(int code, String message) {
        BaseResponse<T> response = new BaseResponse<>();
        response.setCode(code);
        response.setMessage(message);
        return response;
    }
}