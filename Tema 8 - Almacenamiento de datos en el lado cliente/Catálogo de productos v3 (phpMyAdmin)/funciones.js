function validar(id, nombre, descripcion, precio, archivo){
    // Al validar, si alguno es incorrecto, devuelve correcto = false
    let correcto = true;

    /* Limpiar datos (color y msg de error) */
    limpiarValidar();

    /* - -- Validar -- - */
    if (!id){
        msgError(`| Campo ID vacío |`, document.getElementById("id"));
        correcto = false;
    }

    if (!nombre){
        msgError(`| Campo nombre vacío |`, document.getElementById("nombre"));
        correcto = false;
    }

    if (!descripcion){
        msgError(`| Campo descripción vacío |`, document.getElementById("desc"));
        correcto = false;
    }

    if (!precio || precio < 0){
        msgError(`| Precio incorrecto |`, document.getElementById("precio"));
        correcto = false;
    }

    if (!archivo){
        msgError(`| Campo imagen vacía |`, document.getElementById("imagen"));
        correcto = false;
    }
    /* - ------------- - */

    return correcto;
}

// Función devuelve una Promesa que intenta comprobar si una imagen se puede cargar correctamente a partir de una URL
function validarImg(url){
    return new Promise( (resolve, reject) =>{ // Crea y devuelve una nueva Promesa
        const img = new Image(); // Crear objeto Image en memoria
        img.onload = () => resolve(); // Si la img fue cargada correctamente
        img.onerror = () => reject("La URL de la imagen es inválida o no se pudo cargar"); // Si img falla
        img.src = url; // Asigna la URL
    }); // Esta promesa nos permite usar validarImg(url)   .then(...)   .catch(...)   o   await validarImg(url)
}

function limpiarValidar(){
    // ForEach que recorre todo y cambia color de background
    [   
        document.getElementById("id"), 
        document.getElementById("nombre"), 
        document.getElementById("desc"), 
        document.getElementById("precio"), 
        document.getElementById("imagen")
    ].forEach(dato => dato.style.backgroundColor = "");

    // En caso de que campo de error tuviera msg, limpiarlo
    document.getElementById("error").innerHTML = "";
}

function msgError(mgs, dato){   // Le pasas el msg y elemento

    // En caso de que dato sea string, canviarlo
    if ( typeof dato === "string" ) {
        dato = document.getElementById(dato);
    }

    const error = document.getElementById("error"); // Lo pone automáticamente en error
    error.innerHTML += mgs;
    dato.style.backgroundColor = "lightcoral"; // Cambio de fondo a rojo sólo si está mal
}

// Contador productos
function contar(){
    const contProd = document.getElementById("cont");
    const cantidad = document.getElementById("catalogo").children.length;
    contProd.innerText = `${cantidad} producto(s)`;
}