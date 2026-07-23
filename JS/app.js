import { GestorTareas } from "./GestorTareas.js";

/* ============================================
   TASKFLOW - Aplicación de Gestión de Tareas
   Proyecto Módulo 4 - Programación avanzada en JavaScript
   ============================================ */

/* ---------- PASO 1: Orientación a objetos ---------- */

const gestor = new GestorTareas();

const tarea1 = gestor.agregarTarea("Estudiar POO en JavaScript");
const tarea2 = gestor.agregarTarea("Practicar consumo de APIs");

console.log("--- Tareas creadas ---");
gestor.obtenerTareas().forEach((t) => console.log(t.toString()));

gestor.cambiarEstadoTarea(tarea1.id);

console.log("--- Después de completar la tarea 1 ---");
gestor.obtenerTareas().forEach((t) => console.log(t.toString()));


/* ---------- PASO 2: Características ES6+ ---------- */

// Rest operator: agregar varias tareas de una sola vez
console.log("--- Agregando varias tareas con rest operator ---");
gestor.agregarVariasTareas("Diseñar el formulario HTML", "Conectar eventos del DOM", "Probar la API de tareas");

gestor.obtenerTareas().forEach((t) => console.log(t.toString()));

// Arrow function como propiedad de clase (obtenerResumen)
console.log("--- Resumen usando arrow function + destructuring interno ---");
gestor.obtenerTareas().forEach((t) => console.log(t.obtenerResumen()));

// Destructuring al recibir el objeto de resumen por estado
const { total, pendientes, completadas } = gestor.obtenerResumenPorEstado();
console.log(`Total: ${total} | Pendientes: ${pendientes} | Completadas: ${completadas}`);

// Spread operator: comprobamos que obtenerTareas() devuelve una copia
const copiaTareas = gestor.obtenerTareas();
copiaTareas.push("esto no debería afectar al gestor original");
console.log("¿Se alteró el gestor original?", gestor.obtenerTareas().length === copiaTareas.length ? "Sí (❌ error)" : "No (✅ correcto, la copia es independiente)");

// Eliminamos la tarea 2 para dejar el ejemplo limpio
gestor.eliminarTarea(tarea2.id);
console.log("--- Estado final ---");
gestor.obtenerTareas().forEach((t) => console.log(t.toString()));