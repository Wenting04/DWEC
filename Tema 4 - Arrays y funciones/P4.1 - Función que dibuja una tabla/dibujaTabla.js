function creaTabla(
  nFilas = 10, // nº de filas (por defecto 10)
  nCols = 4, // nº de columnas (por defecto 4)
  color = "black", // color de bordes (por defecto negro)
  contenedorId = "tabla1" // id del contenedor donde insertar tabla
) {
  // Crea estructura HTML de la tabla usando template string
  let html = `<table style="border-collapse:collapse; 
                    border:3px solid ${color}; 
                    width: 100%;">`;

  //Para cada fila de las nFilas crea nCols celdas
  // Recorremos filas
  for (let i = 1; i <= nFilas; i++) {
    html += "<tr>";

    //Recorremos columnas
    for (let j = 1; j <= nCols; j++) {
      //Crea celdas con el estilo solicitado añadiendo un espacio
      html += `<td style="border:1px solid ${color}"> 
                    celda ${i},${j}
                </td>`;
    }

    html += "</tr>";
  }

  html += "</table>";
  html += "<br><br>";

  // Añadir tabla al contenedor (sin borrar lo que hay antes, por eso usar el +=)
  document.getElementById(contenedorId).innerHTML += html;
}
