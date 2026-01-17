window.addEventListener("DOMContentLoaded", () =>{
    /* ========================= = == 1. Elementos del DOM == = ========================== */
    // Elementos necesarios
    const formAparecer = document.getElementById("formAparecer"); // Botón para aparecer formulario
    const cancelar = document.getElementById("cancelar");         // Botón para desaparecer formulario
    const aniadir = document.getElementById("aniadir");           // Botón para añadir el producto
    const form = document.getElementById("form");                 // Formulario
    const catalogo = document.getElementById("catalogo");         // Tabla de productos
    const error = document.getElementById("error");               // Span de errores

    /* ========================= = == 2. Variables GLOBALES == = ========================= */
    // Elemento globales para filas y columnas (tabla de 5 columnas)
    const productos = []; // Array para almacenar productos

    /* ============================== = == 3. Eventos == = =============================== */
    /* = == MOSTRAR O DESAPARECER formulario == = */
    formAparecer.addEventListener("click", () =>{
        form.classList.toggle("hidden"); // añade si no existe, quita si existe
    });

    /* = == DESAPARECER formulario CANCELAR == = */
    cancelar.addEventListener("click", () =>{
        form.classList.add("hidden");
    });

    // Evento click en submit, entonces función crear
    form.addEventListener("submit", crear);
    /* =================================================================================== */


    /* ============================= = == 4. Funciones == = ============================== */
    async function crear(e){
        e.preventDefault(); // Evita recargar FORMUALRIO cuando se hace clic

        limpiarValidar();

        const id = document.getElementById("id").value.trim();
        const nombre = document.getElementById("nombre").value.trim();
        const descripcion = document.getElementById("desc").value.trim();
        const precio = document.getElementById("precio").value;
        const archivo = document.getElementById("imagen").files[0];
        const url = URL.createObjectURL(archivo);

        // Si false, para
        if ( !validar(id, nombre, descripcion, precio, archivo) ) return;

        // Validar imagen
        try {
            await validarImg(url);
        } catch {
            msgError("No se pudo cargar la imagen", document.getElementById("imagen")); // POrque en esta función no tenemos el id
            return; // Salir, no sigue
        }

        // Deshabilitar botón y cambiar texto del botón para añadir
        aniadir.disabled = true;
        aniadir.textContent = "Guardando...";

        try {
            await guardarProductoBackend( {id, nombre, descripcion, precio} );
            crearProducto( {id, nombre, descripcion, precio, url} );
            productos.push( {id} );
            form.reset();
            contar();
            alert("Producto guardado correctamente");
        } catch (e) {
            // msgError( e , document.getElementById("error"));
            alert(e);
        } finally { // Al finalizar
            // Restaurar botón aniadir
            aniadir.disabled = false;
            aniadir.textContent = `Añadir`;
        }
    }

    // =====================================================
    // 2. Crear tabla
    // =====================================================
    function crearProducto( {id, nombre, descripcion, precio, url} ){
        // Crear elemento div para meterle img y datos
        const div = document.createElement("div");
        div.classList.add("producto"); // Añadirle class="producto"

        // Crear elemento img
        const img = document.createElement("img");
        img.src = url;

        // Crear elemento con los datos
        const datos = document.createElement("div"); // Otro div con la info text
        datos.classList.add("datos", "hidden");   // Añadirle class="datos" // Oculto desde el inicio
        datos.innerHTML = `
            <div><strong>ID:&nbsp; </strong> ${id}</div>
            <div><strong>Nombre:&nbsp; </strong> ${nombre}</div>
            <div><strong>Precio:&nbsp; </strong> ${precio}</div>
            <div><strong>Descripción:&nbsp; </strong></div>
            <div>${descripcion}</div>
        `;

        // Evento para mostrar los datos
        div.addEventListener("click", () => datos.classList.toggle("hidden") );

        // Borrar con click derecho
        div.addEventListener("contextmenu", async (e) => {
            // Para que no se cargue
            e.preventDefault();

            // Si no quiere eliminar, salir (return)
            if ( !confirm(`¿Desea eliminar este el producto ${nombre}?`) ) return;

            // SÍ quiere eliminar
            div.style.opacity = "0.5"; // Mientras espera, div va a ser opaco

            try {
                await borrarProductoBackend(id);
                div.remove();
                contar();
            } catch (e) {
                div.style.opacity = "1"; // Devuelve la opacidad
                // msgError(`Error al borrar el producto ${nombre}`, error);
                alert(`Error al borrar el producto ${nombre}`);
            }
        });

        // Almacenar img y datos en el div
        div.appendChild(img);
        div.appendChild(datos);

        catalogo.appendChild(div);

        // Si la img no carga tmb debemos de eliminarla
        img.onload = img.onerror = () => URL.revokeObjectURL(url); //???
    }


    /* ====================================== = == BACKEND == = ====================================== */
    async function guardarProductoBackend(producto){
        const response = await fetch("api.php?action=guardar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });

        const text = await response.text();
        console.log("RESPUESTA RAW:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            throw "Respuesta inválida del servidor";
        }

        if (!data.success) throw data.message;
    }

    async function borrarProductoBackend(id){
        const response = await fetch("api.php?action=borrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( {id} )
        });

        const data = await response.json();

        if (!data.success) throw data.message;
    }
    /* =============================================================================================== */

});