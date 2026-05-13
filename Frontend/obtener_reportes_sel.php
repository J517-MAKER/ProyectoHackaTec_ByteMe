<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');

try {
    if (!file_exists('config.php')) {
        throw new Exception('Archivo config.php no encontrado');
    }
    include 'config.php';

    if (!isset($_SESSION['usuario_id'])) {
        throw new Exception('Sesion no iniciada. Por favor inicia sesion');
    }

    if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'SEL') {
        throw new Exception('No tienes permiso para ver reportes');
    }

    $usuario_id = $_SESSION['usuario_id'];

    $sql = "SELECT id, hora_llegada, percance_material, descripcion_percance, cantidad_personas, nombres_colaboradores, fecha_reporte, estado 
            FROM reportes_sel 
            WHERE usuario_id = ? 
            ORDER BY fecha_reporte DESC";

    $stmt = $conexion->prepare($sql);
    
    if (!$stmt) {
        throw new Exception('Error en consulta: ' . $conexion->error);
    }

    $stmt->bind_param("i", $usuario_id);
    
    if (!$stmt->execute()) {
        throw new Exception('Error ejecutando consulta: ' . $stmt->error);
    }

    $resultado = $stmt->get_result();

    $reportes = [];
    while ($fila = $resultado->fetch_assoc()) {
        $reportes[] = $fila;
    }

    ob_end_clean();
    echo json_encode([
        'exito' => true,
        'reportes' => $reportes,
        'total' => count($reportes)
    ]);

    $stmt->close();
    $conexion->close();

} catch (Exception $e) {
    ob_end_clean();
    echo json_encode([
        'exito' => false,
        'mensaje' => $e->getMessage()
    ]);
}
?>