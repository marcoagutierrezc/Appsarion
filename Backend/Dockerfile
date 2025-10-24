# Usar imagen base de JDK 21
FROM eclipse-temurin:21-jdk

# Puerto de exposición
EXPOSE 8080

# Directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios para Gradle
COPY gradlew gradlew.bat build.gradle settings.gradle ./
COPY gradle ./gradle

# Descargar dependencias sin compilar todo
RUN chmod +x gradlew
RUN ./gradlew dependencies --no-daemon

# Copiar el código fuente
COPY src ./src

# Construir la aplicación
RUN ./gradlew clean build -x test --no-daemon

# Ejecutar el jar resultante
ENTRYPOINT ["java", "-jar", "build/libs/EPI-0.0.1-SNAPSHOT.jar"]
