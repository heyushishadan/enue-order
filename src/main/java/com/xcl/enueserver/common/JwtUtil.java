package com.xcl.enueserver.common;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    // 密钥，实际项目中应该从配置文件中读取并加密存储
    @Value("${jwt.secret}")
    private String secret;

    // token有效期（毫秒）
    @Value("${jwt.expiration:86400000}")
    private long expiration;

    // 获取加密密钥
    private SecretKey getSigningKey() {
        // 使用Keys.secretKeyFor方法直接生成足够安全的密钥
        // 或者确保使用的密钥足够长
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);

        // 如果输入的密钥不够长，可以使用哈希算法来扩展它
        if (keyBytes.length < 32) {
            log.warn("jwt.secret长度不足（当前{}字节），请使用至少32字节的密钥", keyBytes.length);
            try {
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                byte[] hashedBytes = digest.digest(keyBytes);
                return Keys.hmacShaKeyFor(hashedBytes);
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException("SHA-256算法不可用", e);
            }
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    // 从token中提取用户名
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, claims -> claims.get("username", String.class));
    }

    // 从token中提取用户ID
    public Long getUserIdFromToken(String token) {
        return getClaimFromToken(token, claims -> claims.get("userId", Long.class));
    }

    // 检查token是否过期
    public boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    // 从token中提取过期时间
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    // 从token中提取指定的声明信息
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    // 从token中提取所有声明信息
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 生成token
    public String generateToken(Long userId, String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        return createToken(claims);
    }

    // 创建token
    private String createToken(Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 验证token是否有效
    public boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
}