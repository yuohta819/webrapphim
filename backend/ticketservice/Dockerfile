# Tầng 1: Build ứng dụng
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Copy cấu hình và mã nguồn của commonservice từ thư mục gốc vào trước
COPY commonservice /commonservice
# Tiến hành build và cài đặt commonservice vào kho thư viện local nội bộ của container
RUN mvn -f /commonservice/pom.xml clean install -DskipTests

# 2. Copy cấu hình và code của CHÍNH SERVICE NÀY (Đường dẫn tính từ thư mục gốc)
COPY ticketservice/pom.xml .
COPY ticketservice/src ./src
RUN mvn clean package -DskipTests

# Tầng 2: Chạy ứng dụng
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
