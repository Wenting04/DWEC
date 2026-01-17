/* ========================= = == 1. Elementos del DOM == = ========================== */
// Elementos necesarios
const formAparecer = document.getElementById("formAparecer"); // Botón para aparecer formulario
const cancelar = document.getElementById("cancelar");         // Botón para desaparecer formulario
const aniadir = document.getElementById("aniadir");           // Botón para añadir el producto
const form = document.getElementById("form");                 // Formulario
const catalogo = document.getElementById("catalogo");         // Tabla de productos
const error = document.getElementById("error");               // Span de errores
/* =================================================================================== */


/* ========================= = == 2. Variables GLOBALES == = ========================= */
// Elemento globales para filas y columnas (tabla de 5 columnas)
const productos = []; // Array para almacenar productos
let cont = 0;         // Contador de columnas en la fila
const maxCol = 5;     // Máx de columnas por fila
let fila;             // Fila actual para la tabla
/* =================================================================================== */


/* =========================== = == 3. Event Listener == = =========================== */
/* = == MOSTRAR formulario == = */
// Puede aparecer o desaparecer
formAparecer.addEventListener("click", () =>{
    if( form.classList.contains("hidden") ){
        form.classList.remove("hidden");    // si estaba oculto, mostrar
    } else {
        form.classList.add("hidden");       // si estaba visible, ocultar
    };
});

/* = == DESAPARECER formulario CANCELAR == = */
// Sólo desaparece
cancelar.addEventListener("click", () =>{
    form.classList.add("hidden");
});

// Evento click en submit, entonces función crear
form.addEventListener("submit", crear);

/* = == Hacer aparecer y desaparecer cuando click == = */
    // Es como en formAparecer pero usando toggle
catalogo.addEventListener("click", (e) =>{
    // Cuando quitamos puntero del elemento con clase img
    if (e.target.classList.contains("img")){
        // El elemento que está al lado del actual (img) que es el div de datos
        e.target.nextElementSibling.classList.toggle("hidden"); /* Si estaba oculto aparece, si estaba visible desaparece */
    }
} );

/* = == BORRAR == = */
// Eliminar productos con el botón derecho del ratón y menú contextual
catalogo.addEventListener("contextmenu", async (e) =>{ // Usar async / await para gestionar llamada
    e.preventDefault(); // Evita que aparezca menú contextual

    // Detecta si clic der fue sobre imagen, si no, return
    if (!e.target.classList.contains("img"))
        return;

    // Obtener URL de la imagen clicada
    const urlClic = e.target.src;

    // Buscar producto en el array usando la URL (obtenemos dicho prod y sus datos, es decir, el objeto)
    const prod = productos.find(p => p.url === urlClic);

    // Si producto no encontrado
    if (!prod){
        alert("No se encontró el producto");
        return;
    }

    // A partir del objeto obtenido, conseguir su id
    const id = prod.id;

    // Confirmación
    const ok = confirm(`¿Estás seguro de borrar el producto con el ID ${id} de nombre ${prod.nombre}?`);

    if (!ok)
        return;

    // Semitransparente mientras realiza el proceso (indica proceso)
    const prodDiv = e.target.closest(".producto");
    prodDiv.classList.add("borrando");

    // Usar async / await para gestionar llamada
    await borrar(prodDiv, id); // Dentro del api ya tenemos ajustado el tiempo de simulación para borrar
});
/* =================================================================================== */


/* ============================= = == 4. Funciones == = ============================== */
// Crear tabla
function crear(e){
    e.preventDefault(); // Evita recargar FORMUALRIO cuando se hace clic

    // Validar
    if (!correcto(productos)){ // Limpiar estilos y texto error incluido en función
        return
    }

    // Obtener datos
    const producto = obtenerDatosValue(true);

    // Deshabilitar botón y cambiar texto del botón para añadir
    aniadir.disabled = true;
    aniadir.textContent = "Guardando...";

    // Validar imagen
    validarImg(producto.url)
        .then ( () =>{
            // Guardar en API
            return api.guardarProducto(producto);
        })
        .then( (result) => { // Si se puede guardar
            // Si se ha guardado correctamente, crear celda y fila
            // Si cont de columna = 0, entonces estamos creando una nueva fila
            if (cont === 0){
                fila =  document.createElement("tr");
                catalogo.appendChild(fila);
            }

            // Almacenar producto dentro del array
            productos.push(producto);

            // Crear celda
            const td = document.createElement("td");
            // Usar método crearProducto()
            const prod = crearProducto(producto);   // Almacenamos lo que devuelve de la función
            td.appendChild(prod);                   // Añadimos datos en td

            fila.appendChild(td);                   // Añadimos a la fila

            contar(productos);

            // Acualizar contador
            cont++;
            if (cont === maxCol){
                cont = 0;
            }

            // Limpiar formulario
            limpiarFormulario();

            // Después de añadir, ocultar formulario
            form.classList.add("hidden");
            /* - -- FIN Creado -- - */

            alert(result);
        })
        .catch( (error) => { // Si aparece error
            msgError(error, document.getElementById("id")); // POrque en esta función no tenemos el id
            alert(error);
        })
        .finally( () => { // Al finalizar
            // Restaurar botón aniadir
            aniadir.disabled = false;
            aniadir.textContent = `Añadir`;
        });
}

/* = == BORRAR == = */
// Función que devuelve Promesa de api.borrarProducto
function borrar(prodDiv, id){
    return api.borrarProducto(id)
        .then( (result) =>{
            // Borrar el array
            const indice = productos.findIndex( p => p.id === id );

            if ( indice !== -1 ){
                productos.splice(indice, 1);
                // Borra sólo 1 "caja" desde la posición indice del array productos
            }

            // Borrar del HTML → El <td> donde está la imagen
            const celda = prodDiv.closest("td");

            if (celda){ // Comprobamos que existe la celda
                celda.remove(); // Elimina la celda
                // Revisar si la fila quedó vacía, si es así lo elimina
                const fila = celda.parentElement; // parentElement: el padre de <td> es <tr>

                if (fila && fila.children.length === 0) { // Si la fila existe pero tiene 0 elementos, eliminamos tr
                    fila.remove();
                }
            }

            // Actualizamos contador
            contar(productos);

            // Recalculamos la posición correcta
            /* Recordar que cuando cont llega a 4, despues cont = 0, pq all 5º producto lo ponemos en la fila de abajo */
            cont = productos.length % maxCol;

            // Msg que se muestra cuando se haya borrado
            alert(result);
        })
        .catch ( (error) =>{
            alert(error);
        })
        .finally ( () =>{
            // Sólo cuando promesa se resuelva, eliminar nodo del DOM
            // Si falla, restaura opacidad y muestra alert
            prodDiv.classList.remove("borrando");
        })
}
/* =================================================================================== */