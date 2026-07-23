/* ============================================
   CLASE: Tarea
   Representa una tarea individual dentro de TaskFlow.
   ============================================ */

export class Tarea {
  constructor(descripcion) {
    this.id = Date.now(); // Identificador único simple, basado en la marca de tiempo
    this.descripcion = descripcion;
    this.estado = "pendiente"; // Puede ser: "pendiente" o "completada"
    this.fechaCreacion = new Date();
  }

  // Cambia el estado de la tarea entre "pendiente" y "completada"
  cambiarEstado() {
    this.estado = this.estado === "pendiente" ? "completada" : "pendiente";
  }

  // Devuelve una representación en texto de la tarea (útil para depurar en consola)
  toString() {
    return `[${this.estado.toUpperCase()}] ${this.descripcion} (creada: ${this.fechaCreacion.toLocaleString()})`;
  }
  
  // Arrow function como propiedad de clase: mantiene "this" ligado a la
  // instancia automáticamente, lo que será clave más adelante al usarla
  // como manejador de eventos (this no se pierde al pasarla como callback).
  obtenerResumen = () => {
    const { descripcion, estado } = this; // Destructuring de las propiedades del propio objeto
    return `${descripcion} - ${estado}`;
  };
}