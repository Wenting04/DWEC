/* 
Crea un tipo de objeto que sirva para representar figuras
Sus propiedades son:
- Marca, un texto
- Modelo, un texto
- Memoria RAM, un número que indica GB de capacidad
- Capacidad Disco Duro, un número que indica GB de capacidad
- Pulgadas de pantalla, un número que indica Pulgadas
Métodos de los ordenadores
- toString, sirve para obtener en forma de texto los detalles del ordenador
Al crear un ordenador se puede indicar todos los valores, pero por defecto (sin ser obligado indicarlos) se toma como valores 17 pulgadas, 512 GB de disco duro y 4 DB de RAM. La marca y el modelo sí son necesarias
Crear otro tipo de objeto que represente ordenadores portátiles los cuales heredan todo lo de los ordenadores pero añaden una propiedad llamada autonomía, que es un número que expresa horas. Se construye este objeto igual que los ordenadores, pero pudiendo añadir la autonomía (por defecto, 4 horas). Por defecto, en los portátiles las pulgadas son 12 y el disco duro 256 GB
*/

// Clase ordenador
class Ordenador {
  //Constructor: define las propiedades iniciales al crear un objeto
  constructor(marca, modelo, ram = 4, disco = 512, pulgadas = 17) {
    this.marca = marca; // Marca del ordenador (obligatorio)
    this.modelo = modelo; // Modelo del ordenador (obligatorio)
    this.ram = ram; // Memoria Ram en GB (por defecto 4)
    this.disco = disco; // Capacidad disco duro en GB (por defecto 512)
    this.pulgadas = pulgadas; // Tamaño de pantalla en pulgadas (por defecto 17)
  }

  // Método toString: devuelve los detalles del ordenador en forma de texto
  toString() {
    return `Ordenador: ${this.marca} ${this.modelo}, RAM: ${this.ram}GB, Disco: ${this.disco}GB, Pantalla: ${this.pulgadas}`;
  }
}

// Clase Portatil (hereda de Ordenador)
class Portatil extends Ordenador {
  constructor(
    marca,
    modelo,
    ram = 4,
    disco = 256,
    pulgadas = 12,
    autonomia = 4
  ) {
    //LLamar al constructor de la clase base (Ordenador)
    super(marca, modelo, ram, disco, pulgadas);
    this.autonomia = autonomia; //Nueva propiedad específica del portátil
  }

  //Sobreescribir el toString para incluir la autonomia
  toString() {
    // super.toString() para obtener info de la clase padre
    return `${super.toString}, Autonomía: ${this.autonomia} horas`;
  }
}

/* - -- Crear ejemplo de objetos -- - */
// No es necesario un class main() porque en JS podemos ejecutar código sin la clase main

// Crear ordenador normal
let miPC = new Ordenador("Dell", "Inspiron");
console.log(miPC.toString());
// Salida: Ordenador: Dell Inspiron, RAM: 4GB, Disco: 512GB, Pantalla: 17"

// Crear un ordenador con todos los valores personalizados
let miPC2 = new Ordenador("HP", "Pavilion", 16, 1024, 15);
console.log(miPC2.toString());
// Salida: Ordenador: HP Pavilion, RAM: 4GB, Disco: 256GB, Pantalla: 12", Autonomía: 4 horas

// Crear portátil
let miPortatil = new Portatil("Lenovo", "Yoga");
console.log(miPortatil.toString());
// Salida: Ordenador: Lenovo Yoga, RAM: 4GB, Disco: 256GB, Pantalla: 12", Autonomía: 4 horas

// Portátil con todos los valores personalizados
let miPortatil2 = new Portatil("Apple", "MacBook Air", 8, 512, 13, 10);
console.log(miPortatil2.toString());
// Salida: Ordenador: Apple MacBook Air, RAM: 8GB, Disco: 512GB, Pantalla: 13", Autonomía: 10 horas
