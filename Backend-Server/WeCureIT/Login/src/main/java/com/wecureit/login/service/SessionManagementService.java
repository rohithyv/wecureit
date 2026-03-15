package com.wecureit.login.service;

import com.wecureit.login.entity.User;
import com.wecureit.login.model.SessionData;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class SessionManagementService {
    private final RedisTemplate<String, Object> redisTemplate;
    private static final long SESSION_EXPIRY = 7 * 24 * 60 * 60; // 7 Days

    public String createSession(User user) {
        String sessionKey = UUID.randomUUID().toString();
        SessionData data = new SessionData(user.getEmail(), user.getMobileNumber(),
                user.getFirstName() + " " + user.getLastName());
        redisTemplate.opsForValue().set(sessionKey, data, SESSION_EXPIRY, TimeUnit.SECONDS);
        return sessionKey;
    }

    public SessionData getSession(String sessionKey) {
        if (sessionKey == null) return null;
        return (SessionData) redisTemplate.opsForValue().get(sessionKey);
    }

    public boolean deleteSession(String sessionKey) {
        if (sessionKey != null) return redisTemplate.delete(sessionKey);
        else return false;
    }

    public String createCookie(String key, long maxAge) {
        return ResponseCookie.from("session_key", key)
                .httpOnly(true).secure(false).path("/").maxAge(maxAge).sameSite("Lax").build().toString();
    }

}
