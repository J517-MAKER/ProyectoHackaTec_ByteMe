<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'ine_viglane');

$conexion = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

if ($conexion->connect_error) {
    die(json_encode(['exito' => false, 'mensaje' => 'Error de conexión: ' . $conexion->connect_error]));
}

$conexion->set_charset("utf8mb4");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>