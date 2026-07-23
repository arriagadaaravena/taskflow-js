import { GestorTareas } from "./GestorTareas.js";

/* ============================================
   TASKFLOW - Aplicación de Gestión de Tareas
   Proyecto Módulo 4 - Programación avanzada en JavaScript
   ============================================ */

/* ---------- PASO 1: Orientación a objetos ----------
   Ejemplos de instanciación para verificar que las clases
   Tarea y GestorTareas funcionan correctamente, antes de
   conectarlas al DOM en los próximos pasos. */

const gestor = new GestorTareas();

// Ejemplo de instanciación: agregar tareas
const tarea1 = gestor.agregarTarea("Estudiar POO en JavaScript");
const tarea2 = gestor.agregarTarea("Practicar consumo de APIs");

console.log("--- Tareas creadas ---");
gestor.obtenerTareas().forEach((t) => console.log(t.toString()));

// Ejemplo: cambiar el estado de una tarea
gestor.cambiarEstadoTarea(tarea1.id);

console.log("--- Después de completar la tarea 1 ---");
gestor.obtenerTareas().forEach((t) => console.log(t.toString()));

// Ejemplo: eliminar una tarea
gestor.eliminarTarea(tarea2.id);

console.log("--- Después de eliminar la tarea 2 ---");
gestor.obtenerTareas().forEach((t) => console.log(t.toString()));