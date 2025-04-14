USE TFG2025;
SELECT u.nombre_usuario
FROM usuario u
LEFT JOIN usuario_proyecto up ON up.id_usuario = u.id
WHERE up.id_proyecto = 16;


