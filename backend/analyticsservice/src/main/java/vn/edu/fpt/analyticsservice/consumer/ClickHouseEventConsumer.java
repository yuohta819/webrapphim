package vn.edu.fpt.analyticsservice.consumer;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.edu.fpt.analyticsservice.model.TrackingEvent;

@Service
@RequiredArgsConstructor
@Slf4j
@EnableScheduling // Đảm bảo tính năng @Scheduled hoạt động chuẩn xác
public class ClickHouseEventConsumer {

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final List<TrackingEvent> eventBuffer = new ArrayList<>();
    private static final int BATCH_SIZE = 5000;

    @KafkaListener(topics = "user-tracking-events", groupId = "clickhouse-group")
    public synchronized void consume(String message) {
        System.out.println("--> Kafka da ket noi va nhan duoc tin nhan: " + message);
        try {
            TrackingEvent event = objectMapper.readValue(message, TrackingEvent.class);
            if (event == null)
                return;
            eventBuffer.add(event);

            if (eventBuffer.size() >= BATCH_SIZE) {
                flushBuffer();
            }
        } catch (Exception e) {
            log.error("Lỗi parse JSON từ Kafka sang TrackingEvent: {}", e.getMessage());
        }
    }

    @Scheduled(fixedRate = 3000)
    public synchronized void scheduledFlush() {
        if (!eventBuffer.isEmpty()) {
            flushBuffer();
        }
    }

    private void flushBuffer() {
        String sql = "INSERT INTO default.user_events (event_id, event_type, user_id, device_os, client_ip, properties, event_date, event_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        List<TrackingEvent> copyList;
        synchronized (this) {
            copyList = new ArrayList<>(eventBuffer);
            eventBuffer.clear();
        }

        try {
            jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
                @Override
                public void setValues(PreparedStatement ps, int i) throws SQLException {
                    TrackingEvent event = copyList.get(i);

                    // 1. ĐÃ SỬA: Check null cho event_id, nếu null hoặc trống thì tự sinh chuỗi
                    // UUID ngẫu nhiên
                    String eventId = event.getEventId();
                    if (eventId == null || eventId.trim().isEmpty()) {
                        eventId = UUID.randomUUID().toString();
                    }
                    ps.setString(1, eventId);

                    ps.setString(2, event.getEventType());

                    // 2. ĐÃ SỬA: Bảo vệ user_id không bị null (nếu null ghi nhận thành khách vãng
                    // lai ANONYMOUS)
                    ps.setString(3, event.getUserId() != null ? event.getUserId() : "ANONYMOUS");

                    ps.setString(4, event.getDeviceOs());
                    ps.setString(5, event.getClientIp());
                    ps.setString(6, convertMapToJson(event.getProperties()));

                    // 3. ĐÃ SỬA: Khắc phục lỗi ngày 19-01-1970 do timestamp = 0
                    long timestamp = event.getTimestamp();
                    if (timestamp <= 0) {
                        timestamp = System.currentTimeMillis(); // Lấy thời gian thực tại của hệ thống năm 2026
                    }

                    java.sql.Date sqlDate = new java.sql.Date(timestamp);
                    java.sql.Timestamp sqlTimestamp = new java.sql.Timestamp(timestamp);

                    ps.setDate(7, sqlDate); // Cho cột event_date
                    ps.setTimestamp(8, sqlTimestamp); // Cho cột event_time
                }

                @Override
                public int getBatchSize() {
                    return copyList.size();
                }
            });
            log.info("Successfully flushed {} events to ClickHouse", copyList.size());
        } catch (Exception e) {
            log.error("Failed to insert batch into ClickHouse. Buffer recovered.", e);
            synchronized (this) {
                eventBuffer.addAll(copyList);
            }
        }
    }

    private String convertMapToJson(Map<String, Object> map) {
        if (map == null || map.isEmpty())
            return "{}";
        try {
            return objectMapper.writeValueAsString(map);
        } catch (Exception e) {
            return "{}";
        }
    }

    @jakarta.annotation.PostConstruct
    public void initTable() {
        log.info("Checking and creating ClickHouse table if not exists...");

        // 4. ĐÃ SỬA: Chuyển hẳn các cột nhạy cảm dễ bị trống sang kiểu Nullable(String)
        // đề phòng lỗi DB sập sau này
        String createTableSql = "CREATE TABLE IF NOT EXISTS default.user_events ("
                + "    event_id Nullable(String),"
                + "    event_type String,"
                + "    user_id Nullable(String),"
                + "    device_os Nullable(String),"
                + "    client_ip Nullable(String),"
                + "    properties String,"
                + "    event_date Date,"
                + "    event_time DateTime"
                + ") ENGINE = MergeTree()"
                + "PARTITION BY toYYYYMM(event_date)"
                + "ORDER BY (event_type, event_date);"; // ĐÃ SỬA: Bỏ cột user_id khỏi ORDER BY vì đã chuyển thành
                                                        // Nullable (ClickHouse không cho phép đặt Nullable trong khoá
                                                        // chính ORDER BY nếu không bọc kỹ)

        try {
            jdbcTemplate.execute(createTableSql);
            log.info("ClickHouse table 'default.user_events' is ready!");
        } catch (Exception e) {
            log.error("Failed to initialize ClickHouse table", e);
        }
    }
}