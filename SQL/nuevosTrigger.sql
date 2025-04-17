-- Los nuevos trigger que han cambiado

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

DELIMITER ;