package com.xcl.enueserver.common;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * 当前登录用户工具类
 */
public class CurrentUserUtils {

    /**
     * 获取当前登录用户的ID
     * @return 用户ID
     */
    public static Long getCurrentUserId() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        return (Long) request.getAttribute("userId");
    }

    /**
     * 获取当前登录用户的用户名
     * @return 用户名
     */
    public static String getCurrentUsername() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        return (String) request.getAttribute("username");
    }
}