/* Wenting Zhang */

/* Tutorial rápido: https://leafletjs.com/examples/quick-start/ */
/* =================================================================================== */


/* ========================= = == 1. Elementos del DOM == = ========================== */
// Crear objeto doom similar a clave valor
DOM = {
    mapa: document.getElementById("map"),
    latitud: document.getElementById("latitud"),
    longitud: document.getElementById("longitud"),
    canvas: document.getElementById("canvas")
};

/* ========================= = == 2. Variables GLOBALES == = ========================= */
let listaUbicaciones = JSON.parse(localStorage.getItem("ubicaciones")) || []; // Leer del navegador los datos guardados con la clave "ubicaciones" (si no, se crea array vacío)
let ctx = DOM.canvas.getContext("2d"); // Contexto de dibujo (el "lápiz" con el que dibujamos en canvas)
let contador = 1; // Contador para enumerar ubicaciones en canvas (1º, 2º, 3º, ...)

/* =============================== = == 3. Mapa == = ================================= */
// Inicializar mapa
var map = L.map('map').setView([51.505, -0.09], 13); // Crear mapa con coordenadas en el centro de London
/* setView devuelve un objeto de mapa*/

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/* ============================== = == 4. Eventos == = =============================== */
// Clicar
map.on("click", marcador);
// Al mover el ratón
map.on("click", mostrar);

/* ============================= = == 5. Funciones == = ============================== */
// Guardar ubicación al hacer click
function marcador(e){
    const posicion = {
        lat: e.latlng.lat,
        lng: e.latlng.lng
    };

    // Añadir marcador al mapa
    L.marker([posicion.lat, posicion.lng]).addTo(map);

    // Guardar en array
    listaUbicaciones.push(posicion);

    // Guardar en localStorage (convertirlo en string)
    localStorage.setItem("ubicaciones", JSON.stringify(listaUbicaciones));

    // Actualizar canvas
    dibujarCanvas();
}

// Mostrar coordenadas en tiempo real
function mostrar(e){
    /* Hacemos que contenido de cada cosa se sustituya al evento donde clicamos */
    DOM.latitud.value = e.latlng.lat.toFixed(6); // Limitar a 6 decimales
    DOM.longitud.value = e.latlng.lng.toFixed(6); // Limitar a 6 decimales
}

// Dobujar ubicaciones en Canvas
function dibujarCanvas(){ // Lista de ubicaciones abajo del mapa

    let altura = 30; // Definir altura de cada fila en canvas
    let y = altura; // Posición inicial vertical (va cambiando)
    let indice = 1;

    // Ajustar la altura del canvas según la lista
    DOM.canvas.height = listaUbicaciones.length * altura;

    // Borra el canvas
    ctx.clearRect(0, 0, DOM.canvas.width, DOM.canvas.height);

    // Recorrer cada ubicación del array
    listaUbicaciones.forEach((punto, i) => { // i -> índice de en el array
        // Estilizar (color de fondo se alterna)
        ctx.fillStyle = i % 2 === 0 ? "#f0f0f0" : "#e0e0e0"; // Ver si el índice es par
        ctx.fillRect(0, y - 20, DOM.canvas.width, altura); // Dibuja rectángulo relleno en canvas

        // Escribir texto
        ctx.fillStyle = "#000"; // Color del texto
        ctx.font = "15px Verdana"; // Tamaño y fuente
        ctx.fillText(
            `📍 ${indice}º [${punto.lat.toFixed(6)}, ${punto.lng.toFixed(6)}]`, // Texto que meustra
            20, // Posición horizontal desde borde izq del canvas
            y // Posición vertical del texto
        );

        y += altura; // Mueve vertical a sigueinte fila
        indice++;
    });
}

// Cargar todos los marcadores guardados al inicio
function cargarMarcadores(){
    listaUbicaciones.forEach(punto => {
        L.marker( [punto.lat, punto.lng] ).addTo(map);
    });

    dibujarCanvas();
}

/* ============================= = == 6. Main == = ============================== */
cargarMarcadores();