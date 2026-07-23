/* ============================================
   CLASE: Tarea
   Representa una tarea individual dentro de TaskFlow.
   ============================================ */

export class Tarea {
  constructor(descripcion, minutosLimite) {
    this.id = Date.now(); // Identificador único simple, basado en la marca de tiempo
    this.descripcion = descripcion;
    this.estado = "pendiente"; // Puede ser: "pendiente" o "completada"
    this.fechaCreacion = new Date();

    // Si el usuario indicó minutos límite, calculamos la fecha límite.
    // Si no indicó nada, la tarea queda sin fecha límite (null).
    if (minutosLimite) {
      const milisegundosLimite = minutosLimite * 60 * 1000;
      this.fechaLimite = new Date(Date.now() + milisegundosLimite);
    } else {
      this.fechaLimite = null;
    }
  }

  // Cambia el estado de la tarea entre "pendiente" y "completada"
  cambiarEstado() {
    this.estado = this.estado === "pendiente" ? "completada" : "pendiente";
  }

  // Devuelve una representación en texto de la tarea (útil para depurar en consola)
  toString() {
    return `[${this.estado.toUpperCase()}] ${this.descripcion} (creada: ${this.fechaCreacion.toLocaleString()})`;
  }

  // Devuelve un resumen corto de la tarea.
  // Usamos destructuring para extraer las propiedades que necesitamos.
  obtenerResumen() {
    const { descripcion, estado } = this;
    return `${descripcion} - ${estado}`;
  }

  // Calcula cuántos segundos quedan hasta la fecha límite.
  // Si la tarea no tiene fecha límite, devuelve null.
  calcularSegundosRestantes() {
    if (!this.fechaLimite) {
      return null;
    }

    const ahora = new Date();
    const diferenciaMilisegundos = this.fechaLimite - ahora;
    const segundosRestantes = Math.floor(diferenciaMilisegundos / 1000);

    return segundosRestantes;
  }
}