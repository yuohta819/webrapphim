# Tầng 1: Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy cả folder backend để giữ cấu trúc project
COPY backend/commonservice ./commonservice
COPY backend/dashboardservice ./dashboardservice

# Build commonservice trước
RUN mvn -f commonservice/pom.xml clean install -DskipTests -q

# Build dashboardservice (sẽ tự động lấy commonservice từ local repo đã install)
RUN mvn -f dashboardservice/pom.xml clean package -DskipTests -q

# Tầng 2: Chạy
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copy file jar từ target của dashboardservice
COPY --from=build /app/dashboardservice/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]