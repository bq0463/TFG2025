USE TFG2025;

DELIMITER $$

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