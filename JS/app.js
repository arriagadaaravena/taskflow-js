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
const btnCargarApi = document.getElementById("btn-cargar-api");
const listaTareas = document.getElementById("lista-tareas");
const resumenTareas = document.getElementById("resumen-tareas");
const notificacionDiv = document.getElementById("notificacion");

let intervalosActivos = [];


/* ---------- PASO 3: Eventos y manipulación del DOM ---------- */

function renderizarTareas() {
  for (let i = 0; i < intervalosActivos.length; i++) {
    clearInterval(intervalosActivos[i]);
  }
  intervalosActivos = [];

  listaTareas.innerHTML = "";

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

    if (tarea.fechaLimite) {
      const spanContador = document.createElement("span");
      spanContador.className = "contador";
      li.appendChild(spanContador);

      iniciarContadorRegresivo(tarea, spanContador);
    }

    listaTareas.appendChild(li);
  });

  renderizarResumen();

  // Paso 5: cada vez que la lista cambia, guardamos el estado actual en localStorage
  gestor.guardarEnLocalStorage();
}

function renderizarResumen() {
  const { total, pendientes, completadas } = gestor.obtenerResumenPorEstado();
  resumenTareas.textContent = `Total: ${total} | Pendientes: ${pendientes} | Completadas: ${completadas}`;
}


/* ---------- PASO 4: JavaScript Asíncrono ---------- */

function agregarTareaConRetardo(descripcion, minutos) {
  btnAgregar.disabled = true;
  resumenTareas.textContent = "Agregando tarea, espera un momento...";

  setTimeout(() => {
    const nuevaTarea = gestor.agregarTarea(descripcion, minutos);
    renderizarTareas();
    mostrarNotificacionConRetardo(`Tarea agregada: ${descripcion}`);

    // Paso 5: además de guardar localmente, intentamos guardar en la API
    guardarTareaEnAPI(nuevaTarea);
  }, 1000);
}

function mostrarNotificacionConRetardo(mensaje) {
  setTimeout(() => {
    notificacionDiv.textContent = "✅ " + mensaje;

    setTimeout(() => {
      notificacionDiv.textContent = "";
    }, 3000);
  }, 2000);
}

function iniciarContadorRegresivo(tarea, spanContador) {
  actualizarTextoContador(tarea, spanContador);

  const idIntervalo = setInterval(() => {
    actualizarTextoContador(tarea, spanContador);
  }, 1000);

  intervalosActivos.push(idIntervalo);
}

function actualizarTextoContador(tarea, spanContador) {
  const segundosRestantes = tarea.calcularSegundosRestantes();

  if (segundosRestantes <= 0) {
    spanContador.textContent = " ⏰ ¡Tiempo agotado!";
    return;
  }

  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;
  const segundosTexto = segundos < 10 ? "0" + segundos : segundos;

  spanContador.textContent = ` ⏳ Tiempo restante: ${minutos}:${segundosTexto}`;
}


/* ---------- PASO 5: Consumo de APIs ---------- */

// Función que TRAE tareas de ejemplo desde una API externa usando fetch().
// Usamos async/await junto con try/catch para poder manejar errores
// (por ejemplo, si no hay conexión a internet).
async function cargarTareasDesdeAPI() {
  resumenTareas.textContent = "Cargando tareas desde la API...";

  try {
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");

    if (!respuesta.ok) {
      throw new Error("La API respondió con un error: " + respuesta.status);
    }

    const datosApi = await respuesta.json();

    datosApi.forEach((tareaDeLaApi) => {
      gestor.agregarTarea(tareaDeLaApi.title);
    });

    renderizarTareas();
    mostrarNotificacionConRetardo("Tareas cargadas desde la API");
  } catch (error) {
    console.log("Ocurrió un error al cargar tareas desde la API:", error);
    resumenTareas.textContent = "❌ No se pudieron cargar las tareas desde la API.";
  }
}

// Función que GUARDA una tarea en una API externa usando fetch() con método POST.
// JSONPlaceholder es una API de práctica: no guarda datos realmente,
// pero nos permite practicar cómo se hace una petición POST y manejar su respuesta.
async function guardarTareaEnAPI(tarea) {
  try {
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: tarea.descripcion,
        completed: tarea.estado === "completada",
      }),
    });

    if (!respuesta.ok) {
      throw new Error("Error al guardar la tarea en la API: " + respuesta.status);
    }

    const datosRespuesta = await respuesta.json();
    console.log("Tarea guardada en la API (respuesta simulada):", datosRespuesta);
  } catch (error) {
    console.log("Ocurrió un error al guardar la tarea en la API:", error);
  }
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

btnCargarApi.addEventListener("click", cargarTareasDesdeAPI);


/* ---------- Carga inicial de la aplicación ---------- */

// Primero intentamos recuperar tareas guardadas en localStorage.
// Si no hay nada guardado (primera vez que se abre la app), usamos tareas de ejemplo.
const seEncontraronTareasGuardadas = gestor.cargarDesdeLocalStorage();

if (!seEncontraronTareasGuardadas) {
  gestor.agregarTarea("Estudiar POO en JavaScript");
  gestor.agregarTarea("Conectar eventos del DOM");
  gestor.agregarTarea("Practicar consumo de APIs", 2);
}

renderizarTareas();