/* - -- DOM -- - */
const myVideo = document.getElementById("myVideo");
const duracion = document.getElementById("duracion");

/* Reproducir automáticamente, reproducir o parar y sin control */
/* - -- Eventos -- - */
// Cuando clic sobre el video, aparecer controles
myVideo.addEventListener("click", reproducirPausar);

// Ejecuta al cargar
window.addEventListener("DOMContentLoaded", playVideo);

/* - -- Funciones -- - */
// Averigua si está pausada y si no lo detiene o reproduce y desmutea
function reproducirPausar() {
    const pausada = myVideo.paused;
    // pausada ? playVideo() : myVideo.pause(); // if (pausada) {play} else {pause}
    if ( pausada ) {
        playVideo();
        muteado();
    } else {
        myVideo.pause();
    }
}

async function playVideo() {
    try{
        await myVideo.play();
    } catch (err) {
        alert("Error al reproducir el video")
    }
}

// Si muteado, se desmutea
function muteado() {
    const muteado = myVideo.muted;

    if ( muteado ) { myVideo.muted = false; };
}

/*
// Función para aparecer y desaparecer controles (extra)
function aparecerBoton() {
    if (myVideo.controls){
        myVideo.controls = false;
        myVideo.load(); // Cargar el video de nuevo
    } else {
        myVideo.controls = true;
    }
    
}
*/

/* Boton derecho y aparezca minutos y segundos */
/* - -- Evento -- - */
myVideo.addEventListener("contextmenu", mostrarMin);

async function mostrarMin(e) {
    // Evita que se muestre el menu que aparece con clic derecho
    e.preventDefault();

    // Pone o quita class="hidden"
    duracion.classList.toggle("hidden");

    const min = Math.floor(myVideo.duration/60); // .duration devuelve en segundos
    const seg = Math.floor(myVideo.duration % 60); // Obtiene el resto al dividir lo que dura en 60

    duracion.innerHTML = min + " minutos con " + seg + " segundos";
}