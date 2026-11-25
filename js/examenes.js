import {
  inicializarDatos,
  obtenerExamenes,
  guardarExamenes,
  generarId
} from "./datos.js";
import { protegerRuta } from "./auth.js";
import "./componentes/navbar.js";

inicializarDatos();
const sesion = protegerRuta();

// referencias del dom y estado
const formExamen = document.getElementById("formExamen");
const tituloFormExamen = document.getElementById("tituloFormExamen");
const inputTitulo = document.getElementById("inputTitulo");
const inputMateria = document.getElementById("inputMateria");
const inputTiempo = document.getElementById("inputTiempo");
const inputDescripcion = document.getElementById("inputDescripcion");
const selectEstadoExamen = document.getElementById("selectEstadoExamen");
const btnGuardarExamen = document.getElementById("btnGuardarExamen");
const btnCancelarExamen = document.getElementById("btnCancelarExamen");
const mensajeExamen = document.getElementById("mensajeExamen");
const inputBuscarExamen = document.getElementById("inputBuscarExamen");
const tablaExamenes = document.getElementById("tablaExamenes");

const seccionPreguntas = document.getElementById("seccionPreguntas");
const tituloPreguntas = document.getElementById("tituloPreguntas");
const btnCerrarPreguntas = document.getElementById("btnCerrarPreguntas");
const formPregunta = document.getElementById("formPregunta");
const tituloFormPregunta = document.getElementById("tituloFormPregunta");
const inputEnunciado = document.getElementById("inputEnunciado");
const opcion0 = document.getElementById("opcion0");
const opcion1 = document.getElementById("opcion1");
const opcion2 = document.getElementById("opcion2");
const opcion3 = document.getElementById("opcion3");
const selectCorrecta = document.getElementById("selectCorrecta");
const btnGuardarPregunta = document.getElementById("btnGuardarPregunta");
const btnCancelarPregunta = document.getElementById("btnCancelarPregunta");
const mensajePregunta = document.getElementById("mensajePregunta");
const listaPreguntas = document.getElementById("listaPreguntas");

let idExamenEditando = null;
let idExamenPreguntas = null;
let idPreguntaEditando = null;

function mostrarMensaje(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = "alerta " + (tipo === "error" ? "alerta-error" : "alerta-exito");
}

function ocultarMensaje(elemento) {
  elemento.textContent = "";
  elemento.className = "alerta oculto";
}

function limpiarFormExamen() {
  formExamen.reset();
  inputTiempo.value = 5;
  idExamenEditando = null;
  tituloFormExamen.textContent = "Nuevo examen";
  btnGuardarExamen.textContent = "Guardar examen";
  btnCancelarExamen.classList.add("oculto");
}

function cargarExamen(id) {
  const examenes = obtenerExamenes();
  const examen = examenes.find(function (e) {
    return e.id === id;
  });

  if (!examen) {
    return;
  }

  ocultarMensaje(mensajeExamen);
  idExamenEditando = examen.id;
  inputTitulo.value = examen.titulo;
  inputMateria.value = examen.materia;
  inputTiempo.value = examen.tiempo;
  inputDescripcion.value = examen.descripcion;
  selectEstadoExamen.value = examen.activo ? "activo" : "inactivo";

  tituloFormExamen.textContent = "Editar examen";
  btnGuardarExamen.textContent = "Actualizar examen";
  btnCancelarExamen.classList.remove("oculto");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function eliminarExamen(id) {
  const examenes = obtenerExamenes();
  const examen = examenes.find(function (e) {
    return e.id === id;
  });

  if (!examen) {
    return;
  }

  const confirmado = confirm("Seguro que deseas eliminar el examen \"" + examen.titulo + "\"?");
  if (!confirmado) {
    return;
  }

  const nuevaLista = examenes.filter(function (e) {
    return e.id !== id;
  });

  guardarExamenes(nuevaLista);

  if (idExamenEditando === id) {
    limpiarFormExamen();
  }
  if (idExamenPreguntas === id) {
    cerrarPreguntas();
  }

  mostrarMensaje(mensajeExamen, "Examen eliminado correctamente.", "exito");
  pintarTablaExamenes();
}

function guardarExamen(evento) {
  evento.preventDefault();
  ocultarMensaje(mensajeExamen);

  const titulo = inputTitulo.value.trim();
  const materia = inputMateria.value.trim();
  const tiempo = Number(inputTiempo.value);
  const descripcion = inputDescripcion.value.trim();
  const activo = selectEstadoExamen.value === "activo";

  if (!titulo || !materia || !descripcion) {
    mostrarMensaje(mensajeExamen, "Completa todos los campos del examen.", "error");
    return;
  }

  if (!tiempo || tiempo < 1 || tiempo > 120) {
    mostrarMensaje(mensajeExamen, "El tiempo debe estar entre 1 y 120 minutos.", "error");
    return;
  }

  const examenes = obtenerExamenes();

  if (idExamenEditando !== null) {
    // mantener las preguntas ya guardadas al editar
    const actualizados = examenes.map(function (e) {
      if (e.id === idExamenEditando) {
        return {
          id: e.id,
          titulo: titulo,
          materia: materia,
          tiempo: tiempo,
          descripcion: descripcion,
          activo: activo,
          preguntas: e.preguntas || []
        };
      }
      return e;
    });

    guardarExamenes(actualizados);
    limpiarFormExamen();
    mostrarMensaje(mensajeExamen, "Examen actualizado correctamente.", "exito");
  } else {
    const nuevo = {
      id: generarId(examenes),
      titulo: titulo,
      materia: materia,
      tiempo: tiempo,
      descripcion: descripcion,
      activo: activo,
      preguntas: []
    };

    examenes.push(nuevo);
    guardarExamenes(examenes);
    limpiarFormExamen();
    mostrarMensaje(mensajeExamen, "Examen creado. Ahora puedes agregar preguntas.", "exito");
  }

  pintarTablaExamenes();
  if (idExamenPreguntas !== null) {
    pintarPreguntas();
  }
}

function pintarTablaExamenes() {
  const texto = inputBuscarExamen.value.trim().toLowerCase();
  const examenes = obtenerExamenes();

  const filtrados = examenes.filter(function (e) {
    if (!texto) {
      return true;
    }
    return (
      e.titulo.toLowerCase().includes(texto) ||
      e.materia.toLowerCase().includes(texto)
    );
  });

  tablaExamenes.innerHTML = "";

  if (filtrados.length === 0) {
    const filaVacia = document.createElement("tr");
    const celdaVacia = document.createElement("td");
    celdaVacia.colSpan = 6;
    celdaVacia.className = "tabla-vacia";
    celdaVacia.textContent = "No hay examenes para mostrar.";
    filaVacia.appendChild(celdaVacia);
    tablaExamenes.appendChild(filaVacia);
    return;
  }

  filtrados.forEach(function (examen) {
    const fila = document.createElement("tr");

    const tdTitulo = document.createElement("td");
    tdTitulo.textContent = examen.titulo;

    const tdMateria = document.createElement("td");
    tdMateria.textContent = examen.materia;

    const tdTiempo = document.createElement("td");
    tdTiempo.textContent = examen.tiempo + " min";

    const tdCantidad = document.createElement("td");
    tdCantidad.textContent = String((examen.preguntas || []).length);

    const tdEstado = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = examen.activo ? "etiqueta estado-activo" : "etiqueta estado-inactivo";
    badge.textContent = examen.activo ? "Publicado" : "Oculto";
    tdEstado.appendChild(badge);

    const tdAcciones = document.createElement("td");
    const cajaAcciones = document.createElement("div");
    cajaAcciones.className = "acciones";

    const btnPreguntas = document.createElement("button");
    btnPreguntas.type = "button";
    btnPreguntas.className = "btn btn-primario btn-pequeno";
    btnPreguntas.textContent = "Preguntas";
    btnPreguntas.addEventListener("click", function () {
      abrirPreguntas(examen.id);
    });

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.className = "btn btn-secundario btn-pequeno";
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", function () {
      cargarExamen(examen.id);
    });

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn btn-peligro btn-pequeno";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", function () {
      eliminarExamen(examen.id);
    });

    cajaAcciones.appendChild(btnPreguntas);
    cajaAcciones.appendChild(btnEditar);
    cajaAcciones.appendChild(btnEliminar);
    tdAcciones.appendChild(cajaAcciones);

    fila.appendChild(tdTitulo);
    fila.appendChild(tdMateria);
    fila.appendChild(tdTiempo);
    fila.appendChild(tdCantidad);
    fila.appendChild(tdEstado);
    fila.appendChild(tdAcciones);

    tablaExamenes.appendChild(fila);
  });
}

// gestion de preguntas del examen seleccionado
function abrirPreguntas(idExamen) {
  idExamenPreguntas = idExamen;
  limpiarFormPregunta();
  ocultarMensaje(mensajePregunta);
  seccionPreguntas.classList.remove("oculto");
  pintarPreguntas();
  seccionPreguntas.scrollIntoView({ behavior: "smooth" });
}

function cerrarPreguntas() {
  idExamenPreguntas = null;
  limpiarFormPregunta();
  ocultarMensaje(mensajePregunta);
  seccionPreguntas.classList.add("oculto");
}

function limpiarFormPregunta() {
  formPregunta.reset();
  idPreguntaEditando = null;
  tituloFormPregunta.textContent = "Nueva pregunta";
  btnGuardarPregunta.textContent = "Agregar pregunta";
  btnCancelarPregunta.classList.add("oculto");
}

function obtenerExamenSeleccionado() {
  const examenes = obtenerExamenes();
  return examenes.find(function (e) {
    return e.id === idExamenPreguntas;
  });
}

function cargarPregunta(idPregunta) {
  const examen = obtenerExamenSeleccionado();
  if (!examen) {
    return;
  }

  const pregunta = examen.preguntas.find(function (p) {
    return p.id === idPregunta;
  });

  if (!pregunta) {
    return;
  }

  ocultarMensaje(mensajePregunta);
  idPreguntaEditando = pregunta.id;
  inputEnunciado.value = pregunta.enunciado;
  opcion0.value = pregunta.opciones[0] || "";
  opcion1.value = pregunta.opciones[1] || "";
  opcion2.value = pregunta.opciones[2] || "";
  opcion3.value = pregunta.opciones[3] || "";
  selectCorrecta.value = String(pregunta.correcta);

  tituloFormPregunta.textContent = "Editar pregunta";
  btnGuardarPregunta.textContent = "Actualizar pregunta";
  btnCancelarPregunta.classList.remove("oculto");
}

function eliminarPregunta(idPregunta) {
  const confirmado = confirm("Seguro que deseas eliminar esta pregunta?");
  if (!confirmado) {
    return;
  }

  const examenes = obtenerExamenes();
  const actualizados = examenes.map(function (e) {
    if (e.id === idExamenPreguntas) {
      const restantes = e.preguntas.filter(function (p) {
        return p.id !== idPregunta;
      });
      return {
        id: e.id,
        titulo: e.titulo,
        materia: e.materia,
        tiempo: e.tiempo,
        descripcion: e.descripcion,
        activo: e.activo,
        preguntas: restantes
      };
    }
    return e;
  });

  guardarExamenes(actualizados);

  if (idPreguntaEditando === idPregunta) {
    limpiarFormPregunta();
  }

  mostrarMensaje(mensajePregunta, "Pregunta eliminada correctamente.", "exito");
  pintarPreguntas();
  pintarTablaExamenes();
}

function guardarPregunta(evento) {
  evento.preventDefault();
  ocultarMensaje(mensajePregunta);

  if (idExamenPreguntas === null) {
    return;
  }

  const enunciado = inputEnunciado.value.trim();
  const opciones = [
    opcion0.value.trim(),
    opcion1.value.trim(),
    opcion2.value.trim(),
    opcion3.value.trim()
  ];
  const correcta = Number(selectCorrecta.value);

  const faltaOpcion = opciones.some(function (op) {
    return op === "";
  });

  if (!enunciado || faltaOpcion) {
    mostrarMensaje(mensajePregunta, "Completa el enunciado y las cuatro opciones.", "error");
    return;
  }

  const examenes = obtenerExamenes();
  let fueEdicion = false;

  const actualizados = examenes.map(function (e) {
    if (e.id !== idExamenPreguntas) {
      return e;
    }

    const preguntas = e.preguntas || [];
    let nuevasPreguntas = [];

    if (idPreguntaEditando !== null) {
      fueEdicion = true;
      nuevasPreguntas = preguntas.map(function (p) {
        if (p.id === idPreguntaEditando) {
          return {
            id: p.id,
            enunciado: enunciado,
            opciones: opciones,
            correcta: correcta
          };
        }
        return p;
      });
    } else {
      const nueva = {
        id: generarId(preguntas),
        enunciado: enunciado,
        opciones: opciones,
        correcta: correcta
      };
      nuevasPreguntas = preguntas.concat([nueva]);
    }

    return {
      id: e.id,
      titulo: e.titulo,
      materia: e.materia,
      tiempo: e.tiempo,
      descripcion: e.descripcion,
      activo: e.activo,
      preguntas: nuevasPreguntas
    };
  });

  guardarExamenes(actualizados);
  limpiarFormPregunta();
  mostrarMensaje(
    mensajePregunta,
    fueEdicion ? "Pregunta actualizada correctamente." : "Pregunta agregada correctamente.",
    "exito"
  );
  pintarPreguntas();
  pintarTablaExamenes();
}

function pintarPreguntas() {
  const examen = obtenerExamenSeleccionado();
  if (!examen) {
    cerrarPreguntas();
    return;
  }

  tituloPreguntas.textContent = "Preguntas de: " + examen.titulo;
  listaPreguntas.innerHTML = "";

  const preguntas = examen.preguntas || [];
  if (preguntas.length === 0) {
    const aviso = document.createElement("p");
    aviso.className = "tabla-vacia";
    aviso.textContent = "Este examen aun no tiene preguntas.";
    listaPreguntas.appendChild(aviso);
    return;
  }

  const letras = ["A", "B", "C", "D"];

  preguntas.forEach(function (pregunta, indice) {
    const caja = document.createElement("div");
    caja.className = "pregunta-item";

    const titulo = document.createElement("strong");
    titulo.textContent = (indice + 1) + ". " + pregunta.enunciado;

    const lista = document.createElement("ul");
    lista.className = "pregunta-opciones-lista";

    pregunta.opciones.forEach(function (opcion, idxOpcion) {
      const item = document.createElement("li");
      const esCorrecta = idxOpcion === pregunta.correcta;
      item.textContent = letras[idxOpcion] + ") " + opcion + (esCorrecta ? " (Correcta)" : "");
      if (esCorrecta) {
        item.className = "opcion-correcta";
      }
      lista.appendChild(item);
    });

    const acciones = document.createElement("div");
    acciones.className = "acciones";

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.className = "btn btn-secundario btn-pequeno";
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", function () {
      cargarPregunta(pregunta.id);
    });

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn btn-peligro btn-pequeno";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", function () {
      eliminarPregunta(pregunta.id);
    });

    acciones.appendChild(btnEditar);
    acciones.appendChild(btnEliminar);

    caja.appendChild(titulo);
    caja.appendChild(lista);
    caja.appendChild(acciones);
    listaPreguntas.appendChild(caja);
  });
}

// eventos y arranque
formExamen.addEventListener("submit", guardarExamen);
btnCancelarExamen.addEventListener("click", function () {
  ocultarMensaje(mensajeExamen);
  limpiarFormExamen();
});
inputBuscarExamen.addEventListener("input", pintarTablaExamenes);

btnCerrarPreguntas.addEventListener("click", cerrarPreguntas);
formPregunta.addEventListener("submit", guardarPregunta);
btnCancelarPregunta.addEventListener("click", function () {
  ocultarMensaje(mensajePregunta);
  limpiarFormPregunta();
});

if (sesion) {
  pintarTablaExamenes();
}
