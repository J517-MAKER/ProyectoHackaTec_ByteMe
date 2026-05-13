<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');

ob_start();

try {
    // Incluir config
    include 'config.php';

    // Verificar sesión
    if (!isset($_SESSION['usuario_id']) || $_SESSION['rol'] !== 'SEL') {
        throw new Exception('No tienes permiso para acceder');
    }

    // Obtener datos del formulario
    $horaLlegada = isset($_POST['horaLlegada']) ? $_POST['horaLlegada'] : '';
    $percances = isset($_POST['percances']) ? $_POST['percances'] : '';
    $descripcionPercance = isset($_POST['descripcionPercance']) ? $_POST['descripcionPercance'] : '';
    $cantidadPersonas = isset($_POST['cantidadPersonas']) ? intval($_POST['cantidadPersonas']) : 0;
    $colaboradores = isset($_POST['colaboradores']) ? $_POST['colaboradores'] : '';

    // Validar campos requeridos
    if (empty($horaLlegada) || empty($percances) || empty($cantidadPersonas) || empty($colaboradores)) {
        throw new Exception('Por favor completa todos los campos requeridos');
    }

    // Validar hora
    if (!preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $horaLlegada)) {
        throw new Exception('Formato de hora inválido');
    }

    // Validar cantidad de personas
    if ($cantidadPersonas < 1 || $cantidadPersonas > 100) {
        throw new Exception('La cantidad de personas debe estar entre 1 y 100');
    }

    // Preparar consulta INSERT
    $sql = "INSERT INTO reportes_sel 
            (usuario_id, folio_usuario, hora_llegada, percance_material, descripcion_percance, cantidad_personas, nombres_colaboradores) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        throw new Exception('Error en prepare: ' . $conexion->error);
    }

    // Bind de parámetros
    $usuario_id = $_SESSION['usuario_id'];
    $folio_usuario = $_SESSION['folio'];

    $stmt->bind_param(
        "issssis",
        $usuario_id,
        $folio_usuario,
        $horaLlegada,
        $percances,
        $descripcionPercance,
        $cantidadPersonas,
        $colaboradores
    );

    // Ejecutar
    if (!$stmt->execute()) {
        throw new Exception('Error al guardar el reporte: ' . $stmt->error);
    }

    $reporte_id = $conexion->insert_id;

    // Log de auditoría (opcional)
    error_log("Reporte SEL guardado - ID: $reporte_id, Usuario: $usuario_id, Hora: $horaLlegada");

    ob_end_clean();
    echo json_encode([
        'exito' => true,
        'mensaje' => 'Reporte guardado exitosamente',
        'reporte_id' => $reporte_id
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