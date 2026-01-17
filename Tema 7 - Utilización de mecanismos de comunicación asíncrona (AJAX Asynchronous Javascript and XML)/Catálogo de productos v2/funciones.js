/* ====================================== = == VALIDAR == = ====================================== */
// Si campo vacío o precio inválido, imprime error abajo de formulario
function correcto(productos){
    // Al validar, si alguno es incorrecto, devuelve correcto = false
    let correcto = true;

    // Obtener datos para validar
    const prod = obtenerDatosValue(false);
    const archivo = prod.imagen.files[0]; // Obtener el primer archivo seleccionado

    /* Limpiar datos (color y msg de error) */
    limpiarValidar();

    /* - -- Validar -- - */
    if (prod.id.value.trim() === ""){
        msgError(`| Campo ID vacío |`, prod.id);
        correcto = false;
    }

    // Ver si ya existe el producto con el mismo id
    if (productos.some(p => p.id === prod.id.value.trim())){
        msgError(`| ID existente |`, prod.id);
        correcto = false;
    }

    if (prod.nombre.value.trim() === ""){
        msgError(`| Campo nombre vacío |`, prod.nombre);
        correcto = false;
    }

    if (prod.desc.value.trim() === ""){
        msgError(`| Campo descripción vacío |`, prod.desc);
        correcto = false;
    }

    if (prod.precio.value.trim() === "" || Number(prod.precio.value) < 0){
        msgError(`| Precio incorrecto |`, prod.precio);
        correcto = false;
    }

    if (!archivo){
        msgError(`| Campo imagen vacía |`, prod.imagen);
        correcto = false;
    }
    /* - ------------- - */

    return correcto;
}

// Funciones auxiliares
function limpiarValidar(){
    const prod = obtenerDatosValue(false);
    // ForEach que recorre todo y cambia color de background
    [prod.id, prod.nombre, prod.desc, prod.precio, prod.imagen].forEach(dato => dato.style.backgroundColor = "");

    // En caso de que campo de error tuviera msg, limpiarlo
    error.innerHTML = ``;
}

// Función devuelve una Promesa que intenta comprobar si una imagen se puede cargar correctamente a partir de una URL
function validarImg(url){
    return new Promise( (resolve, reject) =>{ // Crea y devuelve una nueva Promesa
        //La promesa debe intentar cargar la imagen
        const img = new Image();
        img.onload = () => resolve(); // Si la img fue cargada correctamente
        img.onerror = () => reject("La URL de la imagen es inválida o no se pudo cargar"); // Si img falla
        img.src = url; // Asigna la URL
    });
}
/* =============================================================================================== */


/* ===================================== = == MSG ERROR == = ===================================== */
function msgError(mgs, dato){
    const error = document.getElementById("error");
    error.innerHTML += mgs;
    dato.style.backgroundColor = "lightcoral"; // Cambio de fondo a rojo sólo si está mal
}
/* =============================================================================================== */


/* ======================================= = == CREAR == = ======================================= */
/* = == CREAR producto == = */
function crearProducto(prod){

    // Desglosar
    const id = prod.id;
    const nombre = prod.nombre;
    const desc = prod.desc;
    const precio = prod.precio;
    const url = prod.url;

    // Crear elemento div para meterle img y datos
    const div = document.createElement("div");
    div.classList.add("producto"); // Añadirle class="producto"

    // Crear elemento img
    const img = document.createElement("img");
    img.classList.add("img");
    img.src= url;

    // Crear elemento con los datos
    const datos = document.createElement("div"); // Otro div con la info text
    datos.classList.add("datos");   // Añadirle class="datos"
    datos.classList.add("hidden");  // Oculto desde el inicio
    datos.innerHTML = `
        <div><strong>ID:&nbsp; </strong> ${id}</div>
        <div><strong>Nombre:&nbsp; </strong> ${nombre}</div>
        <div><strong>Precio:&nbsp; </strong> ${precio}</div>
        <div><strong>Descripción:&nbsp; </strong></div>
        <div>${desc}</div>
    `;

    // Almacenar img y datos en el div
    div.appendChild(img);
    div.appendChild(datos);

    return div;
}
/* =============================================================================================== */


/* ====================================== = == LIMPIAR == = ====================================== */
// Limpiar formulario
function limpiarFormulario(){
    document.getElementById("id").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("imagen").value = "";
}
/* =============================================================================================== */


/* ===================================== = == CONTADOR == = ===================================== */
// Contador productos
function contar(productos){
    const contProd = document.getElementById("cont");

    contProd.innerText = `${productos.length} producto(s)`;
}
/* =============================================================================================== */


/* ======================================= = == DATOS == = ======================================= */
/* = == OBTENER DATOS == = */
function obtenerDatosValue(tipo){
    let obj; // Declaramos obj sin inicializar, usaremos let

    if (tipo == true){
        // Obtener datos del elemento
        const id = document.getElementById("id").value;
        const nombre = document.getElementById("nombre").value;
        const desc = document.getElementById("desc").value;
        const precio = document.getElementById("precio").value;
        
        const imagen = document.getElementById("imagen");   // Obtenemos las imágenes en un array
        const archivo = imagen.files[0];                    // Obtener el primer archivo seleccionado
        const url = URL.createObjectURL(archivo);           // Crear URL temporal

        obj = { id, nombre, desc, precio, url };            // Asignamos el objeto
    } else {
        const id = document.getElementById("id");
        const nombre = document.getElementById("nombre");
        const desc = document.getElementById("desc");
        const precio = document.getElementById("precio");
        const imagen = document.getElementById("imagen");   // Obtenemos las imágenes en un array

        obj = { id, nombre, desc, precio, imagen };         // Asignamos el objeto
    }

    // Básicamente devuelve datos como en un objeto
    return obj;
    // Cuando invocamos el método, vamos a almacenarlo en un objeto
}
/* =============================================================================================== */