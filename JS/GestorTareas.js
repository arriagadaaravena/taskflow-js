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

  // Crea una nueva Tarea y la agrega a la lista
  agregarTarea(descripcion) {
    const nuevaTarea = new Tarea(descripcion);
    this.tareas.push(nuevaTarea);
    return nuevaTarea;
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

  // Devuelve la lista completa de tareas
  obtenerTareas() {
    return this.tareas;
  }
}