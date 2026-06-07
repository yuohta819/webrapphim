# Tầng 1: Build ứng dụng
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Build commonservice
COPY commonservice /commonservice
RUN mvn -f /commonservice/pom.xml clean install -DskipTests

# 2. Build apigateway
COPY apigateway/pom.xml .
COPY apigateway/src ./src
RUN mvn clean package -DskipTests

# --- THÊM BƯỚC NÀY ĐỂ DEBUG ---
# Bước này giúp bạn nhìn thấy danh sách file trong target khi chạy build
RUN ls -la /app/target/
# ------------------------------

# Tầng 2: Chạy ứng dụng
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Thay vì dùng wildcard (*-exec.jar), hãy dùng tên file chuẩn xác sau khi đã xem log từ lệnh ls ở trên
# Ví dụ: Nếu file là apigateway-0.0.1-SNAPSHOT.jar thì hãy đổi tên chính xác ở đây
COPY --from=build /app/target/apigateway-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]