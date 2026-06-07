package vn.edu.fpt.analyticsservice.repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import vn.edu.fpt.analyticsservice.model.TrackingEvent;

@Repository
public class TrackingEventRepository {
    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    private ObjectMapper objectMapper; 

    /**
     * Lấy TOÀN BỘ danh sách TrackingEvent thô (có phân trang)
     */
    public List<TrackingEvent> getRawTrackingEvents(int limit, int offset) {
        // Đã bỏ hoàn toàn mệnh đề WHERE liên quan đến thời gian
        String sql = "SELECT event_id, event_type, user_id, device_os, client_ip, event_date, properties " +
                "FROM user_events " +
                "ORDER BY event_date DESC " +
                "LIMIT " + offset + ", " + limit;

        // Vì không dùng điều kiện lọc nên params truyền vào để rỗng
        MapSqlParameterSource params = new MapSqlParameterSource();

        return namedParameterJdbcTemplate.query(sql, params, (rs, rowNum) -> {
            TrackingEvent event = new TrackingEvent();
            event.setEventId(rs.getString("event_id"));
            event.setEventType(rs.getString("event_type"));
            event.setUserId(rs.getString("user_id"));
            event.setDeviceOs(rs.getString("device_os"));
            event.setClientIp(rs.getString("client_ip"));
            
            // Lấy event_date đưa vào trường timestamp của Object
            Timestamp eventDate = rs.getTimestamp("event_date");
            if (eventDate != null) {
                event.setTimestamp(eventDate.getTime());
            }
            
            event.setSource(null); 

            String jsonProperties = rs.getString("properties");
            event.setProperties(convertJsonToMap(jsonProperties));

            return event;
        });
    }

    /**
     * Hàm Helper biến đổi JSON String thành Map<String, Object>
     */
    private Map<String, Object> convertJsonToMap(String json) {
        if (json == null || json.trim().isEmpty() || "{}".equals(json)) {
            return Map.of(); 
        }
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            return Map.of();
        }
    }
}