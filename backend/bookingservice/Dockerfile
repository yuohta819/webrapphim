# Tầng 1: Build ứng dụng
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Copy thư mục commonservice vào /app/commonservice
COPY backend/commonservice /app/commonservice
RUN mvn -f /app/commonservice/pom.xml clean install -DskipTests

# 2. Copy cấu hình và code của bookingservice
# Lưu ý: context giờ là thư mục gốc, nên phải dùng đường dẫn backend/bookingservice
COPY backend/bookingservice/pom.xml .
COPY backend/bookingservice/src ./src

RUN mvn clean package -DskipTests

# Tầng 2: Chạy ứng dụng
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Lưu ý: đường dẫn target giờ sẽ nằm ở /app/target/
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]