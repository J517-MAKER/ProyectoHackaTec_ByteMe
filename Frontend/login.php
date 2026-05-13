<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Asegurar que la salida sea JSON
header('Content-Type: application/json; charset=utf-8');

// Capturar cualquier error
ob_start();

try {
    // Incluir config
    include 'config.php';

    // Obtener datos
    $folio = isset($_POST['folio']) ? trim($_POST['folio']) : '';
    $contrasena = isset($_POST['contrasena']) ? $_POST['contrasena'] : '';
    $rol = isset($_POST['rol']) ? trim($_POST['rol']) : '';

    // Log para debug
    error_log("Folio: $folio, Rol: $rol");

    // Validar campos
    if (empty($folio) || empty($contrasena) || empty($rol)) {
        throw new Exception('Por favor completa todos los campos');
    }

    // Preparar consulta
    $sql = "SELECT id, folio, nombre, apellido, rol, email FROM usuarios 
            WHERE folio = ? AND rol = ? AND estado = 'activo'";

    $stmt = $conexion->prepare($sql);
    
    if (!$stmt) {
        throw new Exception('Error en prepare: ' . $conexion->error);
    }

    $stmt->bind_param("ss", $folio, $rol);
    
    if (!$stmt->execute()) {
        throw new Exception('Error en execute: ' . $stmt->error);
    }

    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $usuario = $resultado->fetch_assoc();
        
        // Verificar contraseña
        $contrasena_hash = hash('sha256', $contrasena);
        
        $sql_verificar = "SELECT contrasena FROM usuarios WHERE id = ?";
        $stmt_verificar = $conexion->prepare($sql_verificar);
        $stmt_verificar->bind_param("i", $usuario['id']);
        $stmt_verificar->execute();
        $resultado_verificar = $stmt_verificar->get_result();
        $usuario_completo = $resultado_verificar->fetch_assoc();
        
        if ($usuario_completo['contrasena'] === $contrasena_hash) {
            // Login exitoso
            $_SESSION['usuario_id'] = $usuario['id'];
            $_SESSION['folio'] = $usuario['folio'];
            $_SESSION['nombre'] = $usuario['nombre'];
            $_SESSION['apellido'] = $usuario['apellido'];
            $_SESSION['rol'] = $usuario['rol'];
            
            $redireccion = '';
            switch($usuario['rol']) {
                case 'CAEL':
                    $redireccion = 'cael.html';
                    break;
                case 'SEL':
                    $redireccion = 'SEL.html';
                    break;
                case 'Supervisión':
                    $redireccion = 'supervision.html';
                    break;
                default:
                    $redireccion = 'index.html';
            }
            
            ob_end_clean();
            echo json_encode([
                'exito' => true,
                'mensaje' => 'Sesión iniciada correctamente',
                'redireccion' => $redireccion,
                'rol' => $usuario['rol']
            ]);
        } else {
            throw new Exception('Usuario o contraseña incorrectos');
        }
    } else {
        throw new Exception('Usuario no encontrado en el rol: ' . $rol);
    }

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