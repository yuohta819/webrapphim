# STAGE 1: Build (đặt tên là "build")
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copy file pom.xml trước để tận dụng Docker layer caching
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy toàn bộ source và thực hiện build
COPY src ./src
RUN mvn clean package -DskipTests

# STAGE 2: Runtime (Image cuối cùng)
FROM openjdk:17-jdk-slim
WORKDIR /app

# Chỉ copy file jar đã build từ stage "build" sang
COPY --from=build /app/target/my-service.jar app.jar

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]