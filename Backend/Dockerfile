
#IMAGEN MODELO
FROM eclipse-temurin:21.0.4_7-jdk

#PUERTO DE DESPLIGUE DEL CONTENEDOR (INFORMACIÓN)
EXPOSE 8080

#DEFINIR DIRECTORIO RAIZ
WORKDIR /app

#COPIAR Y PEGAR ARCHIVOS DENTRO DEL CONTENEDOR
COPY ./build.gradle /app
COPY ./gradle /app/gradle
COPY ./gradlew /app
COPY ./gradlew.bat /app
COPY ./settings.gradle /app/

# Descargar las dependencias sin compilar
RUN ./gradlew build --no-daemon --parallel --stacktrace

# Ejecutar la compilación en modo offline
RUN ./gradlew build --offline --no-daemon

#COPIAR EL CODIGO FUENTE EN EL CONTENEDOR
COPY ./src /app/src

#CONSTRUIR APLICACIÓN
RUN ./gradlew clean build -x test


# LEVANTAR APLICACIÓN CUANDO EL CONTENEDOR INICIE
ENTRYPOINT ["java","-jar","build/libs/EPI-0.0.1-SNAPSHOT.jar"]