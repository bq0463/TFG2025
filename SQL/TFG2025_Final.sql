CREATE DATABASE TFG2025;

USE TFG2025;

CREATE TABLE usuario (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  email varchar(100) UNIQUE NOT NULL,
  contrasena varchar(100) DEFAULT NULL,
  nombre_usuario varchar(50) UNIQUE NOT NULL,
  rol varchar(20) NOT NULL DEFAULT 'Miembro'
);

CREATE TABLE tarea(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    valor DECIMAL(6,2) DEFAULT 0.00,
    id_usuario INTEGER NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(50) DEFAULT 'Sin finalizar',
    tipo enum('tarea','meta') DEFAULT 'tarea',
    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE proyecto(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    fecha_entrega DATE NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE proyecto_tiene_tarea (
    id_proyecto INTEGER NOT NULL,
    id_tarea INTEGER NOT NULL,
    PRIMARY KEY (id_proyecto, id_tarea),
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id) ON DELETE CASCADE,
    FOREIGN KEY (id_tarea) REFERENCES tarea(id) ON DELETE CASCADE
);

CREATE TABLE examen(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    nota DECIMAL(4,2) DEFAULT 0.00,
    id_usuario INTEGER NOT NULL,
    fecha DATE NOT NULL,
    asignatura VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE usuario_proyecto (
    id_usuario INTEGER NOT NULL,
    id_proyecto INTEGER NOT NULL,
    PRIMARY KEY (id_usuario, id_proyecto),
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id) ON DELETE RESTRICT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);


DELIMITER $$

-- Trigger para PROYECTO (permite dejar descripción vacía o NULL)
CREATE TRIGGER proyecto_update BEFORE UPDATE ON proyecto
FOR EACH ROW
BEGIN
    IF NEW.fecha_entrega IS NULL THEN
        SET NEW.fecha_entrega = OLD.fecha_entrega;
    END IF;
    IF NEW.titulo IS NULL OR NEW.titulo = '' THEN
        SET NEW.titulo = OLD.titulo;
    END IF;
    -- Descripción puede quedar vacía o NULL, no se modifica
END $$

-- Trigger para TAREA (permite dejar valor y fecha_inicio en NULL)
CREATE TRIGGER tarea_update BEFORE UPDATE ON tarea
FOR EACH ROW
BEGIN
    IF NEW.descripcion IS NULL OR NEW.descripcion = '' THEN
        SET NEW.descripcion = OLD.descripcion;
    END IF;
    -- valor y fecha_inicio pueden quedar NULL, no se tocan
    IF NEW.id_usuario IS NULL THEN
        SET NEW.id_usuario = OLD.id_usuario;
    END IF;
    IF NEW.fecha_fin IS NULL THEN
        SET NEW.fecha_fin = OLD.fecha_fin;
    END IF;
    IF NEW.estado IS NULL OR NEW.estado = '' THEN
        SET NEW.estado = OLD.estado;
    END IF;
END $$

-- Trigger para EXAMEN (permite dejar nota como NULL)
CREATE TRIGGER examen_update BEFORE UPDATE ON examen
FOR EACH ROW
BEGIN
    -- nota puede quedar NULL
    IF NEW.id_usuario IS NULL THEN
        SET NEW.id_usuario = OLD.id_usuario;
    END IF;
    IF NEW.fecha IS NULL THEN
        SET NEW.fecha = OLD.fecha;
    END IF;
END $$

CREATE TRIGGER usuario_update BEFORE UPDATE ON usuario
FOR EACH ROW
BEGIN
    IF NEW.email IS NULL OR NEW.email = '' THEN
        SET NEW.email = OLD.email;
    END IF;
    IF NEW.contrasena IS NULL OR NEW.contrasena = '' THEN
        SET NEW.contrasena = OLD.contrasena;
    END IF;
    IF NEW.nombre_usuario IS NULL OR NEW.nombre_usuario = '' THEN
        SET NEW.nombre_usuario = OLD.nombre_usuario;
    END IF;
    IF NEW.rol IS NULL OR NEW.rol = '' THEN
        SET NEW.rol = OLD.rol;
    END IF;
END $$

CREATE TRIGGER after_delete_usuario_proyecto
AFTER DELETE ON usuario_proyecto
FOR EACH ROW
BEGIN
    DECLARE usuario_count INT;

    -- Contar cuántos usuarios quedan asociados al proyecto
    SELECT COUNT(*) INTO usuario_count FROM usuario_proyecto WHERE id_proyecto = OLD.id_proyecto;

    -- Si no hay usuarios asociados, eliminar las tareas del proyecto y luego el proyecto
    IF usuario_count = 0 THEN
        -- Eliminar primero la relación proyecto-tarea
        DELETE FROM proyecto_tiene_tarea WHERE id_proyecto = OLD.id_proyecto;

        -- Luego eliminar las tareas (ya que sus relaciones fueron eliminadas)
        DELETE FROM tarea WHERE id NOT IN (SELECT id_tarea FROM proyecto_tiene_tarea);

        -- Finalmente, eliminar el proyecto
        DELETE FROM proyecto WHERE id = OLD.id_proyecto;
    END IF;
END $$

DELIMITER ;