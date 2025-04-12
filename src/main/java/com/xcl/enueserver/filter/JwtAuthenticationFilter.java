package com.xcl.enueserver.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xcl.enueserver.common.BaseResponse;
import com.xcl.enueserver.common.ErrorCode;
import com.xcl.enueserver.common.JwtUtil;
import com.xcl.enueserver.common.ResultUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // 不需要验证的路径
    private static final List<String> WHITELIST = Arrays.asList(
            "/user/admin-login",
            "/user/jobseeker-login",
            "/user/jobseeker-register",
            "/user/company-admin-login",
            "/user/project-manager-login",
            "/company/register",
            "/company/info/*",
            // 其他不需要验证的路径
            "/error"
    );

    public JwtAuthenticationFilter(JwtUtil jwtUtil, ObjectMapper objectMapper) {
        this.jwtUtil = jwtUtil;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 检查请求路径是否在白名单中
        String requestPath = request.getRequestURI();
        if (isPathInWhitelist(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 获取Authorization头
        String authHeader = request.getHeader("Authorization");

        // 检查是否有token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendErrorResponse(response, ErrorCode.UNAUTHORIZED, "未授权：缺少授权头");
            return;
        }

        // 提取token
        String token = authHeader.substring(7);

        // 验证token
        if (!jwtUtil.validateToken(token)) {
            sendErrorResponse(response, ErrorCode.UNAUTHORIZED, "未授权：无效的token");
            return;
        }

        // 提取用户信息，可以放入request中，以便后续的处理器使用
        Long userId = jwtUtil.getUserIdFromToken(token);
        String username = jwtUtil.getUsernameFromToken(token);

        request.setAttribute("userId", userId);
        request.setAttribute("username", username);

        // 继续执行过滤链
        filterChain.doFilter(request, response);
    }

    // 检查路径是否在白名单中
    private boolean isPathInWhitelist(String requestPath) {
        return WHITELIST.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, requestPath));
    }

    // 发送错误响应
    private void sendErrorResponse(HttpServletResponse response, ErrorCode errorCode, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        BaseResponse<?> errorResponse = ResultUtils.error(errorCode.getCode(), message);
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}