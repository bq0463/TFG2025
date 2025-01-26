CREATE DATABASE TFG2025;

USE TFG2025;

-- Tabla de usuarios
CREATE TABLE usuario(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(50) NOT NULL,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'Miembro'
);

-- Tabla de proyectos
CREATE TABLE proyecto(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    fecha_entrega DATE NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);

-- Tabla de tareas (debe estar asociada a un usuario)
CREATE TABLE tarea(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    valor DECIMAL(6,2) DEFAULT 0.00,
    id_usuario INTEGER NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(50) DEFAULT 'Sin finalizar',
    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Tabla de relación entre proyectos y tareas (opcional)
CREATE TABLE proyecto_tiene_tarea (
    id_proyecto INTEGER NOT NULL,
    id_tarea INTEGER NOT NULL,
    PRIMARY KEY (id_proyecto, id_tarea),
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id) ON DELETE CASCADE,
    FOREIGN KEY (id_tarea) REFERENCES tarea(id) ON DELETE CASCADE
);

-- Tabla de exámenes (debe estar asociado a un usuario)
CREATE TABLE examen(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    nota DECIMAL(4,2) DEFAULT 0.00,
    id_usuario INTEGER NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Relación entre usuarios y proyectos (muchos a muchos)
CREATE TABLE usuario_proyecto (
    id_usuario INTEGER NOT NULL,
    id_proyecto INTEGER NOT NULL,
    PRIMARY KEY (id_usuario, id_proyecto),
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id) ON DELETE RESTRICT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);

DELIMITER $$

CREATE TRIGGER before_delete_proyecto
BEFORE DELETE ON proyecto
FOR EACH ROW
BEGIN
    DECLARE usuario_count INT;
    SELECT COUNT(*) INTO usuario_count FROM usuario_proyecto WHERE id_proyecto = OLD.id;
    IF usuario_count = 0 THEN
        DELETE FROM tarea WHERE id IN (SELECT id_tarea FROM proyecto_tiene_tarea WHERE id_proyecto = OLD.id);
    END IF;
END $$

DELIMITER ;

-- Insertar usuarios de prueba
INSERT INTO usuario (email, contrasena, nombre_usuario) VALUES
('usuario1@example.com', 'pass123', 'usuario1'),
('usuario2@example.com', 'pass123', 'usuario2'),
('usuario3@example.com', 'pass123', 'usuario3');

-- Insertar proyectos de prueba
INSERT INTO proyecto (fecha_entrega, titulo, descripcion) VALUES
('2025-06-01', 'Proyecto A', 'Descripción del proyecto A'),
('2025-07-15', 'Proyecto B', 'Descripción del proyecto B');

-- Insertar tareas de prueba
INSERT INTO tarea (descripcion, valor, id_usuario, fecha_inicio, fecha_fin, estado) VALUES
('Tarea 1', 10.00, 1, '2025-01-01', '2025-02-01', 'Sin finalizar'),
('Tarea 2', 20.00, 2, '2025-02-01', '2025-03-01', 'Finalizado'),
('Tarea 3', 15.00, 3, '2025-03-01', '2025-04-01', '');

-- Asignar tareas a proyectos
INSERT INTO proyecto_tiene_tarea (id_proyecto, id_tarea) VALUES
(1, 1),
(1, 2),
(2, 3);

-- Insertar exámenes de prueba
INSERT INTO examen (nota, id_usuario, fecha) VALUES
(8.50, 1, '2025-01-10'),
(7.00, 2, '2025-02-20');

-- Asignar usuarios a proyectos
INSERT INTO usuario_proyecto (id_usuario, id_proyecto) VALUES
(1, 1),
(1, 2);

-- Insertar datos random
INSERT INTO usuario (email, contrasena, nombre_usuario) VALUES
('random1@example.com', 'random123', 'randomuser1'),
('random2@example.com', 'random123', 'randomuser2');

INSERT INTO proyecto (fecha_entrega, titulo, descripcion) VALUES
('2025-08-20', 'Proyecto C', 'Descripción del proyecto C'),
('2025-09-10', 'Proyecto D', 'Descripción del proyecto D');

INSERT INTO tarea (descripcion, valor, id_usuario, fecha_inicio, fecha_fin, estado) VALUES
('Tarea Random 1', 5.50, 1, '2025-04-01', '2025-05-01', 'Sin finalizar'),
('Tarea Random 2', 12.75, 2, '2025-05-01', '2025-06-01', 'Finalizado');

INSERT INTO examen (nota, id_usuario, fecha) VALUES
(6.50, 3, '2025-03-15'),
(9.00, 2, '2025-04-25');

INSERT INTO usuario_proyecto (id_usuario, id_proyecto) VALUES
(2, 1),
(3, 2);
