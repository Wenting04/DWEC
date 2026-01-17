// Elementos necesarios
const formAparecer = document.getElementById("formAparecer"); // Botón para aparecer formulario
const cancelar = document.getElementById("cancelar"); // Botón para desaparecer formulario
const aniadir = document.getElementById("aniadir"); // Botón para añadir el producto y desaparecer form
const form = document.getElementById("form"); // Formulario
const catalogo = document.getElementById("catalogo"); // Donde se muestra los productos
const error = document.getElementById("error");

// Array para almacenar productos
const productos = [];


/* = == MOSTRAR formulario == = */
// Puede aparecer o desaparecer
formAparecer.addEventListener("click", () =>{
    if( form.classList.contains("hidden") ){
        form.classList.remove("hidden"); // si estaba oculto, mostrar
    } else {
        form.classList.add("hidden"); // si estaba visible, ocultar
        /* Podemos usar toggle:
        form.classList.toggle("hidden"); // añade si no existe, quita si existe */
    };

    /* Tmb podemos obtener qué tipo de display es y luego comparar:
    const tipo = getComputedStyle(form).display;
    if ( tipo === "none" ) { form.style.display = "flex"} else { form.style.display = "none" }; */
});

/* = == DESAPARECER formulario CANCELAR == = */
// Sólo desaparece
cancelar.addEventListener("click", () =>{
    form.classList.add("hidden");
});


/* = == VALIDAR == = */
// Si campo vacío o precio inválido, imprime error abajo de formulario
function correcto(){
    // Al validar, si alguno es incorrecto, devuelve correcto = false
    let correcto = true; // quiero modificarlo en caso erroneo, por eso let

    // En caso de que campo de error tuviera msg, limpiarlo
    error.innerHTML = ``;

    // Obtener datos para validar
    const id = document.getElementById("id");
    const nombre = document.getElementById("nombre");
    const desc = document.getElementById("desc");
    const precio = document.getElementById("precio");

    const imagen = document.getElementById("imagen"); // Obtenemos las imágenes en un array
    const archivo = imagen.files[0]; // Obtener el primer archivo seleccionado

    /* Limpiar colores anteriores */
    // Podríamos crear un array con esos nombres y hacer un foreach
    id.style.backgroundColor = "";
    nombre.style.backgroundColor = "";
    desc.style.backgroundColor = "";
    precio.style.backgroundColor = "";
    imagen.style.backgroundColor = "";

    /* - -- Validar -- - */
    if (id.value.trim() === ""){
        error.innerHTML += `| Campo ID vacío |`;
        id.style.backgroundColor = "lightcoral"; // Cambio de fondo a rojo sólo si está mal
        correcto = false;
    }

    // Ver si ya existe el producto con el mismo id
    if (productos.some(p => p.id === id.value.trim())){
        error.innerHTML += `| ID existente |`;
        id.style.backgroundColor = "lightcoral"; // Cambio de fondo a rojo sólo si está mal
        correcto = false;
    }
    /* Desglosado:
    productos.some(...) → Devuelve true si AL MENOS 1 elemento del array cumple tal condición
    p => p.id === id.value.trim() → función flecha, recibe cada producto (p) del array productos y compara
        p.id → id del producto que ya existe en la lista
        id.value.trim() → id que el usuario escribe en el form
    */


    if (nombre.value.trim() === ""){
        error.innerHTML += `| Campo nombre vacío |`;
        nombre.style.backgroundColor = "lightcoral"; // Cambio de fondo a rojo sólo si está mal
        correcto = false;
    }

    if (desc.value.trim() === ""){
        error.innerHTML += `| Campo descripción vacío |`;
        desc.style.backgroundColor = "lightcoral"; // Cambio de fondo a rojo sólo si está mal
        correcto = false;
    }

    if (precio.value.trim() === "" || Number(precio.value) < 0){
        error.innerHTML += `| Precio incorrecto |`;
        precio.style.backgroundColor = "lightcoral"; // Cambio de fondo a rojo sólo si está mal
        correcto = false;
    }

    if (!archivo){
        error.innerHTML += `| Campo imagen vacía |`;
        imagen.style.backgroundColor = "lightcoral"; // Cambio de fondo a rojo sólo si está mal
        correcto = false;
    }
    /* - ------------- - */

    return correcto;
}


/* = == CREAR producto == = */
function crearProducto(){

    // Obtener datos del elemento
    const id = document.getElementById("id").value;
    const nombre = document.getElementById("nombre").value;
    const desc = document.getElementById("desc").value;
    const precio = document.getElementById("precio").value;
    
    const imagen = document.getElementById("imagen"); // Obtenemos las imágenes en un array
    const archivo = imagen.files[0]; // Obtener el primer archivo seleccionado
    const url = URL.createObjectURL(archivo); // Crear URL temporal

    // Crear elemento div para meterle img y datos
    const div = document.createElement("div");
    div.classList.add("producto"); // Añadirle class="producto"

    // Crear elemento img
    const img = document.createElement("img");
    img.classList.add("img");
    img.src= url;

    // Crear elemento con los datos
    const datos = document.createElement("div"); // Otro div con la info text
    datos.classList.add("datos"); // Añadirle class="datos"
    datos.classList.add("hidden");
    datos.innerHTML = `<div><strong>ID:&nbsp; </strong> ${id}<br></div>
        <div><strong>Nombre:&nbsp; </strong> ${nombre}<br></div>
        <div><strong>Precio:&nbsp; </strong> ${precio}<br></div>
        <div><strong>Descripción:&nbsp; </strong> ${desc}</div>`;

    // Almacenar img y datos en el div
    div.appendChild(img);
    div.appendChild(datos);

    // Almacenar producto dentro del array
    productos.push({ id, nombre, precio, desc });

    return div;
}


// Elemento globales para filas y columnas (tabla de 5 columnas)
let cont = 0;
const maxCol = 5; // Máx de columnas por fila
let fila;

// Crear tabla
function crear(e){
    e.preventDefault(); // Evita recargar FORMUALRIO cuando se hace clic

    // Validar
    if (!correcto()){
        return
    }

    // Si cont de columna = 0, entonces estamos creando una nueva fila
    if (cont === 0){
        fila =  document.createElement("tr");
        catalogo.appendChild(fila);
    }

    // Crear celda
    const td = document.createElement("td");
    const prod = crearProducto(); // Almacenamos lo que devuelve de la función
    td.appendChild(prod); // Añadimos datos en td

    fila.appendChild(td); // Añadimos a la fila

    contar();

    // Acualizar contador
    cont++;
    if (cont === maxCol){
        cont = 0;
    }

    // Limpiar formulario
    limpiar("id");
    limpiar("nombre");
    limpiar("desc");
    limpiar("precio");
    limpiar("imagen");

    // Después de añadir, ocultar formulario
    form.classList.add("hidden");
}

// Evento click en submit, entonces función crear
form.addEventListener("submit", crear);


// Contador productos
function contar(){
    const contProd = document.getElementById("cont");

    contProd.innerText = `${productos.length} producto(s)`;
}

// Limpiar
function limpiar(x){
    document.getElementById(x).value = "";
}


/* = == Aparecer cuando hover en imagen == =  */
catalogo.addEventListener("mouseover", (e) =>{
    // si el click esa un elemento con clase img
    if (e.target.classList.contains("img")){
        // El elemento que está al lado del actual (img) que es el div de datos
        e.target.nextElementSibling.classList.remove("hidden");
    }
} );

/* = == Aparecer cuando hover en imagen == =  */
catalogo.addEventListener("mouseout", (e) =>{
    // si el click esa un elemento con clase img
    if (e.target.classList.contains("img")){
        // El elemento que está al lado del actual (img) que es el div de datos
        e.target.nextElementSibling.classList.add("hidden");
    }
} );