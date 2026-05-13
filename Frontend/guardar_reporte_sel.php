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

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Metodo no permitido');
    }

    if (!isset($_SESSION['usuario_id'])) {
        throw new Exception('Sesion no iniciada');
    }

    if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'SEL') {
        throw new Exception('No tienes permiso');
    }

    $horaLlegada = isset($_POST['horaLlegada']) ? trim($_POST['horaLlegada']) : '';
    $percances = isset($_POST['percances']) ? trim($_POST['percances']) : '';
    $descripcionPercance = isset($_POST['descripcionPercance']) ? trim($_POST['descripcionPercance']) : '';
    $cantidadPersonas = isset($_POST['cantidadPersonas']) ? intval($_POST['cantidadPersonas']) : 0;
    $colaboradores = isset($_POST['colaboradores']) ? trim($_POST['colaboradores']) : '';

    if (empty($horaLlegada) || empty($percances) || $cantidadPersonas < 1 || empty($colaboradores)) {
        throw new Exception('Faltan campos requeridos');
    }

    $usuario_id = $_SESSION['usuario_id'];
    $folio_usuario = $_SESSION['folio'];

    $sql = "INSERT INTO reportes_sel (usuario_id, folio_usuario, hora_llegada, percance_material, descripcion_percance, cantidad_personas, nombres_colaboradores) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conexion->prepare($sql);
    if (!$stmt) {
        throw new Exception('Error: ' . $conexion->error);
    }

    $stmt->bind_param("ississs", $usuario_id, $folio_usuario, $horaLlegada, $percances, $descripcionPercance, $cantidadPersonas, $colaboradores);
    
    if (!$stmt->execute()) {
        throw new Exception('Error: ' . $stmt->error);
    }

    $reporte_id = $conexion->insert_id;

    ob_end_clean();
    echo json_encode(['exito' => true, 'mensaje' => 'Reporte guardado exitosamente', 'reporte_id' => $reporte_id]);

    $stmt->close();
    $conexion->close();

} catch (Exception $e) {
    ob_end_clean();
    echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
}
?>