// Clase Vehículo (principal)
class Vehiculo {
  // Constructor: se ejecuta al crear un nuevo vehículo -> new Vehiculo(pasar valores)
  constructor(
    marca,
    modelo,
    anio = 2020,
    potencia = 100,
    combustible = "gasolina",
    velMax = 180,
    encendido = false
  ) {
    /* En caso de necesitar cmoprobar que se inserte marca y modelo:
    if (!marca || !modelo){
      throw new Error("Marca y modelo no introducidos");
    }
    */
    this.marca = marca;
    this.modelo = modelo;
    this.anio = anio;
    this.potencia = potencia;
    this.combustible = combustible;
    this.velMax = velMax;
    this.encendido = encendido;
  }
  //Uso del this.valor para guardar dato en objeto que se crea

  //toString
  toString() {
    // Uso de this.propiedad para acceder a las propiedades del objeto actual. Sin ella no smuestra objeto no encontrado
    return `Vehículo: ${this.marca} ${this.modelo} (${this.anio})
      Potencia: ${this.potencia} CV
      Combustible: ${this.combustible}
      Velocidad Máxima: ${this.velMax} km/h
      Encendido: ${this.encendido ? "Sí" : "No"}`; //if (encendido = true)
  }

  //Encender vehículo
  encender() {
    if (this.encendido == false) {
      this.encendido = true;
      console.log(`El ${this.marca} ${this.modelo} está en marcha`);
    } else {
      console.log(`El ${this.marca} ${this.modelo} ya estaba encendido`);
    }
  }

  //Apagar vehçiculo
  apagar() {
    if (!this.encendido) {
      console.log(`El ${this.marca} ${this.modelo} ya está apagado`);
    } else {
      this.encendido = false;
      console.log(`El ${this.marca} ${this.modelo} se ha apagado`);
    }
  }

  //Acelerar
  acelerar(velocidad) {
    if (this.encendido) {
      console.log(
        `Velocidad alcanzada del ${this.marca} ${this.modelo}: ${velocidad} km/h.`
      );
    } else {
      console.log(`El ${this.marca} ${this.modelo} está apagado`);
    }
  }
}

// Clase eléctrico que hereda de vehículo
class Electrico extends Vehiculo {
  constructor(
    marca,
    modelo,
    anio = 2020,
    potencia = 150, // por defecto 150 CV
    combustible = "eléctrico", // por defecto eléctrico
    velMax = 180,
    encendido = false,
    autonomia = 300, //por defecto 300 km
    bateria = 100 // por defecto 100%
  ) {
    //Llamar constructor de clase padre/principal (vehiculo)
    super(marca, modelo, anio, potencia, combustible, velMax, encendido);
    this.autonomia = autonomia;
    this.bateria = bateria;
  }

  //Sobreescribir toString
  toString() {
    return `${super.toString()}
      Autonomía: ${this.autonomia} km
      Batería: ${this.bateria}%`;
  }

  //Carga la batería
  cargar() {
    this.bateria = 100;
    console.log(`Batería del ${this.marca} ${this.modelo} cargada al 100%`);
  }

  // Consumir batería
  consumir(km) {
    // Si batería es menor o igual a 0 = vehículo ya apagado
    if (!this.encendido) {
      console.log(`Vehiculo apagado.`);
    } else {
      // Si batería más de 0 = vehículo aún encendido
      this.bateria -= km;

      // Si aún hay batería
      if (this.bateria > 0) {
        console.log(`${km}% consumido. Batería restante: ${this.bateria}%`);
      } else {
        // No queda batería
        this.bateria = 0; //En caso de que resulte negativo
        console.log(`Batería agotada. El vehículo se apagará.`);
        this.apagar();
      }
    }
  }
}

/* - -- Crear vehículos -- - */
// Normales
/* Toyota Collora con config predeterminada: 
  anio 2020, potencia 100, 
  combustible gasolina, velMax 180, 
  encendido = false */
let coche1 = new Vehiculo("Toyota", "Corolla");
console.log(coche1.toString());
coche1.encender();
coche1.acelerar(100);
coche1.apagar();

// Eléctrico ()
/* Tesla Modelo 3, anio 2023 con config predeterminada: 
  potencia 150, 
  combustible eléctrico, velMax 180, 
  encendido = false, autonomia = 300,
  bateria = 100 */
let tesla = new Electrico("Tesla", "Modelo 3", 2023);
console.log(tesla.toString());
tesla.encender();
tesla.acelerar(120);
tesla.consumir(30);
tesla.consumir(70);
tesla.cargar();
tesla.apagar();
