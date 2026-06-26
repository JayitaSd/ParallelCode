package com.example.backend.websocket;

import com.example.backend.util.JwtUtil;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
public class WebSocketAuthInterceptor implements HandshakeInterceptor {
    private final JwtUtil jwtUtil;

    public WebSocketAuthInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {

        if (request instanceof ServletServerHttpRequest servletRequest) {

            String query = servletRequest.getURI().getQuery();

            if (query != null && query.startsWith("token=")) {
                String token = query.substring(6);

                try {
                    String username = jwtUtil.extractUsername(token);
                    attributes.put("username", username);
                    System.out.println("✅ Handshake success for user: " + username);
                    return true;
                } catch (Exception e) {
                    System.out.println("❌ Invalid token");
                    return false;
                }
            }
        }

        System.out.println("❌ No token in query");
        return false;
    }
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {}
}
