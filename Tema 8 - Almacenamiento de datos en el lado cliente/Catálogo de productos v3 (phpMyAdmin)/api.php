<?php
    /* Se va a conectar a la base de datos de la máquina virtual w10 propia porque no puedo acceder a internet fuera de clases en la máquina
    Mi máquina virtual: WampServer -> Usaré phpMyAdmin
    Primero pasos antes de ejecutarse, en phpMyAdmin:
    1. Crear la base de datos
    2. Crear la tabla -> debe de existir ya
    3. Modificar parámetors en conectarBD()

    Dentro de phpMyAdmin:
        1. En Base de datos -> Nombre: "catalogo"; "utf8mb4_unicode_ci" (admitir acentos, ñ, emojs, cualqueir idioma)
        2. Crear tabla:
            CREATE TABLE productos (
                id INT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                descripcion TEXT NOT NULL,
                precio DECIMAL(10,2) NOT NULL
            );
        3. cambiar parámetros en api.php */

    /* ========================== = == Cabecera JSON == = =========================== */
    header("Content-Type: application/json");
    /* =============================================================================== */


    /* ========================= = == Conexión a la bd == = ========================== */
    function conectarBD(){
        // =====================================================
        // 1. Valores de la Base de Datos                            
        // =====================================================
        $host = "localhost"; // Dónde
        $bd = "catalogo"; // Nombre de la base de datos
        $usuario = "root";
        $contra = "rootroot";

        /* Para AwardSpace:
        $host = "fdb1032.awardspace.net"; // Dónde
        $usuario = "4717059_chinook";
        $bd = "4717059_chinook"; // Nombre de la base de datos
        $contra = "chin.1234";
        */

        // =====================================================
        // 2. Crear PDO con try catch                            
        // =====================================================
        try{
            $pdo = new PDO(
                "mysql:host=$host;dbname=$bd;charset=utf8",
                $usuario,
                $contra,
                array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
            );

            return $pdo;
        }catch (PDOException $e){
            // PHP tiene que dar a JS, por eso, codificar primero
            echo json_encode(array(
                "success" => false,
                "message" => "Error de conexión"
            ));
            exit;
        }
    }
    /* =============================================================================== */


    /* ========================= = == Guardar producto == = ========================== */
    function guardarProd(){
        // =====================================================
        // 1. Inicializar variables                             
        // =====================================================
        // Es para después de obtener los datos del body
        $id = null;
        $nombre = null;
        $descripcion = null;
        $precio = null;

        // =====================================================
        // 2. Conexión a la BD                            
        // =====================================================
        $pdo = conectarBD(); // Devuelve el new PDO(...)

        // =====================================================
        // 3. Obtener datos del body (JSON -> array PHP)                            
        // =====================================================
        $datos = json_decode(file_get_contents("php://input"), true);

        // =====================================================
        // 4. Validación                           
        // =====================================================
        $validacion = validarProd($datos);

        if ( !$validacion ){ // Si false, entonces error
            echo json_encode( array(
                "success" => false,
                "message" => "Faltas campos"
            ));
            exit; // Para y sale del PHP
        }

        // =====================================================
        // 5. Asignamos valores                           
        // =====================================================
        // Crear un array con los datos
        $campos = ["id", "nombre", "descripcion", "precio"];

        // Con forEach recorremos para asignar
        foreach ( $campos as $campo ){
            if ( isset( $datos[$campo] ) ){ // isset verifica si hay existe
                $$campo = $datos[$campo];
            }
        }


        // =====================================================
        // 6. Comprobar ID duplicado                           
        // =====================================================
        /* - -- Preparar -- - */
        $stmt = $pdo->prepare( // stmt: statement
            "SELECT id FROM productos WHERE id = :id"  // :id -> Para evitar inyección SQL
        );
        // $stmt contiene una consulta SELECT

        /* - -- Meter valor real -- - */
        $stmt->bindParam(":id", $id);

        /* - -- Ejecutar -- - */
        $stmt->execute(); // Ahora $stmt contiene el resultado de ejecutarlo

        /* Verificar existencia */
        if ($stmt->fetch()){ //Busca si hay 1º línea
            echo json_encode( array(
                "success" => false,
                "message" => "Ya eixste el ID"
            ));
            exit; // Sale del PHP y no continúa
        }

        // =====================================================
        // 7. Insertar producto en la tabla                           
        // =====================================================
        /* - -- Preparar -- - */
        $stmt = $pdo->prepare(
            "INSERT INTO productos (id, nombre, descripcion, precio)
            VALUES (:id, :nombre, :descripcion, :precio)"
        );
        // $stmt contiene una sentencia SQL

        /* - -- Meter valor real -- - */
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":nombre", $nombre);
        $stmt->bindParam(":descripcion", $descripcion);
        $stmt->bindParam(":precio", $precio);


        /* - -- Tratar de ejecutar para guardar -- - */
        try{
            $stmt->execute(); // Ejecutar sentencia
            echo json_encode( array(
                "success" => true,
                "message" => "Producto guardado correctamente"
            ));
        } catch (PDOException $e) {
            echo json_encode( array(
                "success" => false,
                "message" => "Error al guardar producto"
            ));

            exit; // Sale del PHP y no continúa
        }
    }
    /* =============================================================================== */


    /* ========================= = == Validar producto == = ========================== */
    function validarProd($datos){
        $correcto = true; // Se inicia con true

        // Campos que esperamos y su tipo
        $campos = [
            "id" => "number",
            "nombre" => "string",
            "descripcion" => "string",
            "precio" => "number"
        ];

        foreach ($campos as $campo => $tipo){
            // 1. Si campo NO existe
            if ( !isset($datos[$campo]) ){
                $correcto = false;
                break;
            }

            // 2. Si existe, validaos según tipo
            // Si num inválido 
            if ($tipo === "number" && !is_numeric( $datos[$campo] )){
                $correcto = false;
                break;
            }

            // Si string vacío
            if ($tipo === "string"  &&  trim($datos[$campo]) === "" ){ //trim(): quitar espacios
                $correcto = false;
                break;
            }
        }

        return $correcto;
    }
    /* =============================================================================== */

    /* ========================= = == Borrar producto == = =========================== */
    function borrarProd(){

        // =====================================================
        // 1. Conexión a la BD
        // =====================================================
        $pdo = conectarBD();

        // =====================================================
        // 2. Obtener datos del body (JSON -> array PHP)
        // =====================================================
        $data = json_decode( file_get_contents("php://input"), true );

        // =====================================================
        // 3. Validar que exista el ID
        // =====================================================
        if (  !isset( $data["id"] )  ){
            echo json_encode( array(
                "success" => false,
                "message" => "ID vacío"
            ));

            exit; // Sale del PHP y no continúa
        }

        // =====================================================
        // 4. Obtener ID
        // =====================================================
        $id = $data["id"];

        // =====================================================
        // 5. Comprobamos si existe en la base de datos
        // =====================================================
        /* - -- Preparar -- - */
        $stmt = $pdo->prepare(
            "SELECT id FROM productos WHERE id = :id" // Elegir en tabla productos, donde id = :id
        );

        /* - -- Meter valor -- - */
        $stmt->bindParam(":id", $id); // Evita inyección

        /* - -- Ejecutar -- - */
        $stmt->execute();

        /* - -- Ejecutar -- - */
        if ( !$stmt->fetch() ){ //Busca 1º línea, si NO existe, entrar
            echo json_encode( array(
                "success" => false,
                "message" => "Producto inexistente"
            ));

            exit; // Sale, no continúa
        }

        // =====================================================
        // 6. Borrar producto
        // =====================================================
        /* - -- Preparar -- - */
        $stmt = $pdo->prepare(
            "DELETE FROM productos WHERE id = :id" // Eliminar en tabla productos, donde id = :id
        );

        /* - -- Meter valor -- - */
        $stmt->bindParam(":id", $id); // Evita inyección

        /* - -- Ejecutar -- - */
        $stmt->execute();

        // =====================================================
        // 7. Respuesta final
        // =====================================================
        echo json_encode( array(
            "success" => true,
            "message" => "Producto eliminado correctamente"
        ));

        // Salimos una vez terminado
        exit;
    }
    /* =============================================================================== */

    /* ========================== = == Obtener acción == = =========================== */
    function obtenerAction(){
        /* 1º Comprobar de que SÍ hay acción, si no da error */
        if (!isset($_GET["action"])){ // Si no existe
            echo json_encode( array(
                "success" => false,
                "message" => "No hay acciones"
            ));
            exit; // Para y sale del PHP
        }

        // Si hay action, entonces devolvemos
        return $_GET["action"];
    }
    /* =============================================================================== */

    /* =============== = == Cargar productos desde BD al iniciar == = ================ */
    // =====================================================
    // 1. Listar productos
    // =====================================================
    function listarProd(){
        /* - -- Conexión a la BD -- - */
        $pdo = conectarBD();

        /* - -- Obtener datos ordenaos por id -- - */
        $stmt = $pdo->query(
            "SELECT id, nombre, descripcion, precio FROM productos ORDER BY id"
        );

        $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => $productos
        ]);

        exit;
    }
    /* =============================================================================== */


    /* =============================== = == Main == = ================================ */
    // =====================================================
    // 1. Obtener acción
    // =====================================================
    $action = obtenerAction();

    // =====================================================
    // 2. Ejecutar según acción
    // =====================================================
    if ($action === "guardar") {
        guardarProd();
    } elseif ($action === "borrar") {
        borrarProd();
    } elseif ($action === "listar") {
        listarProd();
    } else {
        echo json_encode( array( // Si acción no existe
            "success" => false,
            "message" => "No se ha identificado la acción"
        ));
    }
    /* =============================================================================== */

?>