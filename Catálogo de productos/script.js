
// Cuando click en el botón "Añadir producto", aparecer formulario
document.getElementById("formAparecer").addEventListener("click", formularioAniadir);
// Cuando click en cancelar, desaparece formulario
document.getElementById("cancelar").addEventListener("click", cancelar);

function formularioAniadir(){
    // Hacer que display="none" (formulario) sea flex
    const aparecer = "flex";
    document.getElementById("form").style.display = aparecer;
}

function cancelar(){
    // Hacer que display="felx" (formulario) sea none
    const aparecer = "none";
    document.getElementById("form").style.display = aparecer;
}