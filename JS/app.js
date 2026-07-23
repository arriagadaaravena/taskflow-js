import { GestorTareas } from "./GestorTareas.js";

/* ============================================
   TASKFLOW - Aplicación de Gestión de Tareas
   Proyecto Módulo 4 - Programación avanzada en JavaScript
   ============================================ */

const gestor = new GestorTareas();

/* ---------- Referencias al DOM ---------- */
const formTarea = document.getElementById("form-tarea");
const inputDescripcion = document.getElementById("input-descripcion");
const inputMinutos = document.getElementById("input-minutos");
const btnAgregar = document.getElementById("btn-agregar");
const listaTareas = document.getElementById("lista-tareas");
const resumenTareas = document.getElementById("resumen-tareas");
const notificacionDiv = document.getElementById("notificacion");

// Guardamos aquí los ids de los setInterval activos (uno por cada
// tarea con contador regresivo), para poder detenerlos antes de
// volver a dibujar la lista y evitar que se acumulen sin control.
let intervalosActivos = [];


/* ---------- PASO 3: Eventos y manipulación del DOM ---------- */

// Dibuja (renderiza) la lista completa de tareas en el DOM.
function renderizarTareas() {
  // Antes de volver a dibujar, detenemos todos los contadores regresivos
  // que estaban corriendo, porque sus elementos HTML van a desaparecer.
  for (let i = 0; i < intervalosActivos.length; i++) {
    clearInterval(intervalosActivos[i]);
  }
  intervalosActivos = [];

  listaTareas.innerHTML = ""; // Limpiamos la lista antes de volver a dibujarla

  gestor.obtenerTareas().forEach((tarea) => {
    const li = document.createElement("li");
    if (tarea.estado === "completada") {
      li.className = "tarea-completada";
    }

    const spanTexto = document.createElement("span");
    spanTexto.className = "tarea-texto";
    spanTexto.textContent = tarea.descripcion;

    const btnEliminar = document.createElement("button");
    btnEliminar.className = "btn-eliminar";
    btnEliminar.textContent = "Eliminar";

    spanTexto.addEventListener("click", () => {
      gestor.cambiarEstadoTarea(tarea.id);
      renderizarTareas();
    });

    btnEliminar.addEventListener("click", () => {
      gestor.eliminarTarea(tarea.id);
      renderizarTareas();
    });

    li.addEventListener("mouseover", () => {
      li.classList.add("resaltada");
    });

    li.addEventListener("mouseout", () => {
      li.classList.remove("resaltada");
    });

    li.appendChild(spanTexto);
    li.appendChild(btnEliminar);

    // Si la tarea tiene fecha límite, le agregamos un contador regresivo
    if (tarea.fechaLimite) {
      const spanContador = document.createElement("span");
      spanContador.className = "contador";
      li.appendChild(spanContador);

      iniciarContadorRegresivo(tarea, spanContador);
    }

    listaTareas.appendChild(li);
  });

  renderizarResumen();
}

// Actualiza el contador de Total / Pendientes / Completadas
function renderizarResumen() {
  const { total, pendientes, completadas } = gestor.obtenerResumenPorEstado();
  resumenTareas.textContent = `Total: ${total} | Pendientes: ${pendientes} | Completadas: ${completadas}`;
}


/* ---------- PASO 4: JavaScript Asíncrono ---------- */

// 1) Simula un retardo al agregar una tarea usando setTimeout.
// En vez de agregar la tarea de inmediato, esperamos 1 segundo,
// como si la aplicación estuviera "guardando" la tarea en un servidor.
function agregarTareaConRetardo(descripcion, minutos) {
  btnAgregar.disabled = true;
  resumenTareas.textContent = "Agregando tarea, espera un momento...";

  setTimeout(() => {
    gestor.agregarTarea(descripcion, minutos);
    renderizarTareas();
    mostrarNotificacionConRetardo(`Tarea agregada: ${descripcion}`);
  }, 1000); // 1000 milisegundos = 1 segundo de retardo simulado
}

// 2) Muestra una notificación, pero recién 2 segundos después de ser llamada.
function mostrarNotificacionConRetardo(mensaje) {
  setTimeout(() => {
    notificacionDiv.textContent = "✅ " + mensaje;

    // Hacemos que la notificación desaparezca sola después de un rato
    setTimeout(() => {
      notificacionDiv.textContent = "";
    }, 3000);
  }, 2000); // 2000 milisegundos = 2 segundos, tal como pide la pauta
}

// 3) Crea un contador regresivo para una tarea con fecha límite.
// Se actualiza cada 1 segundo usando setInterval.
function iniciarContadorRegresivo(tarea, spanContador) {
  actualizarTextoContador(tarea, spanContador); // Mostramos el valor inicial de inmediato

  const idIntervalo = setInterval(() => {
    actualizarTextoContador(tarea, spanContador);
  }, 1000);

  intervalosActivos.push(idIntervalo);
}

// Calcula el tiempo restante y lo escribe en el contador.
function actualizarTextoContador(tarea, spanContador) {
  const segundosRestantes = tarea.calcularSegundosRestantes();

  if (segundosRestantes <= 0) {
    spanContador.textContent = " ⏰ ¡Tiempo agotado!";
    return;
  }

  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;

  // Agregamos un "0" delante si el número de segundos es menor a 10 (ej: 05 en vez de 5)
  const segundosTexto = segundos < 10 ? "0" + segundos : segundos;

  spanContador.textContent = ` ⏳ Tiempo restante: ${minutos}:${segundosTexto}`;
}


/* ---------- Eventos del formulario ---------- */

formTarea.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const descripcion = inputDescripcion.value.trim();
  if (!descripcion) return;

  let minutos = null;
  if (inputMinutos.value.trim() !== "") {
    minutos = Number(inputMinutos.value);
  }

  agregarTareaConRetardo(descripcion, minutos);

  inputDescripcion.value = "";
  inputMinutos.value = "";
});

inputDescripcion.addEventListener("keyup", () => {
  btnAgregar.disabled = inputDescripcion.value.trim() === "";
});


/* ---------- Datos de ejemplo iniciales ---------- */
gestor.agregarTarea("Estudiar POO en JavaScript");
gestor.agregarTarea("Conectar eventos del DOM");
gestor.agregarTarea("Practicar consumo de APIs", 2); // Con 2 minutos de fecha límite, de ejemplo

renderizarTareas();