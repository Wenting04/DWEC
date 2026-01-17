/* API falso */
/* En este archivo se simula una base de datos con objeto o clase */
// Ej: una clase API con un array interno this.producto = [] (para simular una base de datos)

/* Objetivo: Simular que se guarda un producto en un servidor remoto con retraso y validación de ID */

class API{
    //Constructor (al iniciar la API se crea la lista productos vacío)
    constructor() {
        this.productos = []; // Simula guardado a la base de datos
        /* Producto contendrá:
            ID, Nombre, Descripción, Precio e Imagen */
    }

    /* - -- Método -- - */

    // Método que retrasa 2 segundos, verifica id repetido, probabilidad 50% y guarda en producto (en caso de éxito)
    guardarProducto(prod){
        // Retorna siempre una Promesa
        return new Promise((resolve, reject) =>{
            console.log("Verificando los datos...");

            /* = == 1. Verificar existencia de ID == = */
            const existe = this.productos.some( p => p.id === prod.id );

            // Si existe, entonces reject, si no, entonces seguir
            if ( existe ){
                reject("EL ID ya existe");
                return;
            }

            /* = == 2. Simular espera == = */
            
            // Simular el tiempo de una operación (aprox 2s)
            setTimeout(() => {
                /* = == 3. Simular si hay éxito o error == = */
                const num = Math.round(Math.random() * 10) / 10; // Genera num DECIMAL aleatorio entre 0 al 1
                const correcto = num > 0.5; // True o False

                // Si éxito, entra en el if, si no , else
                    if ( correcto ){

                        this.productos.push(prod);

                        resolve(`Producto guardado correctamente ${num}`);
                    } else {
                        reject(`Error al guardar producto ${num}`);
                    }
            }, 2000); // Está en milisegundos 
        });
    }

    // Método que retrasa 1.5 segundos, 90% éxito y 10% error, compara id (busca) y elimina
    borrarProducto(id){
        // Crear y devolver nueva Pr0mesa
        return new Promise((resolve, reject) =>{
            console.log("Borrando datos...");

            /* = == 1. Verificar si existe == = */
            const existe = this.productos.some( p => p.id === id );

            if ( !existe ){
                reject("El producto no existe");
                return;
            }

            /* = == 2. Simular tiempo de espera 1,5 segundos == = */
            setTimeout(() =>{
                /* = == Simular éxit (90%) o error (10%) == = */
                const num = Math.round(Math.random() * 10) / 10; // Genera num DECIMAL aleatorio entre 0 al 1 
                const correcto = num > 0.1;
                /* Si mayor a 0.1 entonces true, si menor, entonces false */

                // Si éxito, entra y borra
                if ( correcto ){
                    // BUsca índice del producto
                    const indice = this.productos.findIndex( p => p.id === id );

                    // Verificar índice si encontrado
                    if ( indice === -1 ){ // Si no encontrado
                        reject(`Producto no encontrado`);
                    } else { // Si encontrado
                        this.productos.splice(indice, 1);

                        resolve(`Producto eliminado correctamente ${num}`);
                    }
                } else {
                    reject(`Error al borrar producto ${num}`);
                }

            }, 1500); // milisegundos
        });
    }
}

/* = == USAR PROMESAS == = */

// Crear instancia
const api = new API();
/* Instancia global porque hemos importado el archivo entero en el html */