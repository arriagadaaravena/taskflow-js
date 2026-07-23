import { Tarea } from "./Tarea.js";

/* ============================================
   CLASE: GestorTareas
   Administra la colección completa de tareas: crear, listar,
   actualizar estado y eliminar.
   ============================================ */

export class GestorTareas {
  constructor() {
    this.tareas = [];
  }

  // Crea una nueva Tarea y la agrega a la lista.
  // minutosLimite es opcional: si no se indica, la tarea no tiene fecha límite.
  agregarTarea(descripcion, minutosLimite) {
    const nuevaTarea = new Tarea(descripcion, minutosLimite);
    this.tareas.push(nuevaTarea);
    return nuevaTarea;
  }

  // Rest operator (...descripciones): permite pasar cualquier cantidad de
  // descripciones como argumentos y las recibe agrupadas en un arreglo.
  // Ejemplo de uso: gestor.agregarVariasTareas("Tarea A", "Tarea B", "Tarea C")
  agregarVariasTareas(...descripciones) {
    return descripciones.map((descripcion) => this.agregarTarea(descripcion));
  }

  // Busca una tarea por su id y cambia su estado
  cambiarEstadoTarea(id) {
    const tarea = this.tareas.find((t) => t.id === id);
    if (tarea) {
      tarea.cambiarEstado();
    }
    return tarea;
  }

  // Elimina una tarea de la lista según su id
  eliminarTarea(id) {
    this.tareas = this.tareas.filter((t) => t.id !== id);
  }

  // Spread operator (...this.tareas): devuelve una COPIA del arreglo,
  // no la referencia original. Así quien reciba el resultado no puede
  // modificar accidentalmente la lista interna del gestor.
  obtenerTareas() {
    return [...this.tareas];
  }

  // Cuenta cuántas tareas hay en total, pendientes y completadas.
  obtenerResumenPorEstado() {
    const pendientes = this.tareas.filter((t) => t.estado === "pendiente");
    const completadas = this.tareas.filter((t) => t.estado === "completada");

    return {
      total: this.tareas.length,
      pendientes: pendientes.length,
      completadas: completadas.length,
    };
  }
}