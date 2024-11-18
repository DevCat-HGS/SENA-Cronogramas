CREATE DATABASE IF NOT EXISTS sena_management;
USE sena_management;

-- Tabla de Instructores
CREATE TABLE Instructor (
    ID_Instructor INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Apellido VARCHAR(50) NOT NULL,
    No_Documento_Identidad VARCHAR(20) UNIQUE NOT NULL,
    NIS VARCHAR(20) UNIQUE NOT NULL,
    Correo VARCHAR(100) NOT NULL
);

-- Tabla de Actividades de Formación
CREATE TABLE Actividad_Formacion (
    ID_Actividad INT AUTO_INCREMENT PRIMARY KEY,
    Numero_Ficha VARCHAR(20) NOT NULL,
    Fase_Proyecto VARCHAR(100) NOT NULL,
    Actividad_Desarrollar VARCHAR(255) NOT NULL,
    Competencia_Desarrollar VARCHAR(255) NOT NULL,
    Resultados_Aprendizaje TEXT,
    Ambiente_Aprendizaje VARCHAR(100),
    Fecha_Desde DATE NOT NULL,
    Fecha_Hasta DATE NOT NULL,
    Hora_Desde TIME NOT NULL,
    Hora_Hasta TIME NOT NULL,
    Horas_Por_Dia INT NOT NULL,
    Total_Horas INT NOT NULL
);

-- Tabla de Relación entre Instructores y Actividades
CREATE TABLE Instructor_Actividad (
    ID_Instructor INT,
    ID_Actividad INT,
    PRIMARY KEY (ID_Instructor, ID_Actividad),
    FOREIGN KEY (ID_Instructor) REFERENCES Instructor(ID_Instructor),
    FOREIGN KEY (ID_Actividad) REFERENCES Actividad_Formacion(ID_Actividad)
);

-- Tabla de Reportes
CREATE TABLE Reporte (
    ID_Reporte INT AUTO_INCREMENT PRIMARY KEY,
    Mes_A_Reportar VARCHAR(20) NOT NULL,
    Dias_Habiles INT NOT NULL,
    ID_Instructor INT,
    FOREIGN KEY (ID_Instructor) REFERENCES Instructor(ID_Instructor)
);

-- Tabla de Eventos
CREATE TABLE Evento (
    ID_Evento INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_Evento VARCHAR(255) NOT NULL,
    Fecha_Entrega DATE NOT NULL
);

-- Tabla de Relación entre Instructores y Eventos
CREATE TABLE Instructor_Evento (
    ID_Instructor INT,
    ID_Evento INT,
    PRIMARY KEY (ID_Instructor, ID_Evento),
    FOREIGN KEY (ID_Instructor) REFERENCES Instructor(ID_Instructor),
    FOREIGN KEY (ID_Evento) REFERENCES Evento(ID_Evento)
);
