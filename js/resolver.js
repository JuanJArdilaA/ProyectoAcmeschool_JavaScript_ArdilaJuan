import {
  inicializarDatos,
  obtenerExamenes,
  obtenerResultados,
  guardarResultado,
  generarId
} from "./datos.js";
import { obtenerSesion } from "./auth.js";
import "./componentes/navbar.js";
import "./componentes/reloj.js";
import "./componentes/tarjeta.js";

inicializarDatos();

// referencias del dom y estado
const seccionCatalogo = document.getElementById("seccionCatalogo");
const inputBuscar = document.getElementById("inputBuscar");
const filtroMateria = document.getElementById("filtroMateria");
const listaExamenes = document.getElementById("listaExamenes");
const tablaResultados = document.getElementById("tablaResultados");

const seccionExamen = document.getElementById("seccionExamen");
const tituloExamenActivo = document.getElementById("tituloExamenActivo");
const infoExamenActivo = document.getElementById("infoExamenActivo");
const relojExamen = document.getElementById("relojExamen");
const progresoPreguntas = document.getElementById("progresoPreguntas");
const formResolver = document.getElementById("formResolver");
const inputEstudiante = document.getElementById("inputEstudiante");
const contenedorPreguntas = document.getElementById("contenedorPreguntas");
const btnCancelarExamen = document.getElementById("btnCancelarExamen");

const seccionResultado = document.getElementById("seccionResultado");
const resumenEstudiante = document.getElementById("resumenEstudiante");
const avisoResultado = document.getElementById("avisoResultado");
const resumenPuntaje = document.getElementById("resumenPuntaje");
const resumenPorcentaje = document.getElementById("resumenPorcentaje");
const resumenEstado = document.getElementById("resumenEstado");
const detalleRespuestas = document.getElementById("detalleRespuestas");
const btnVolverCatalogo = document.getElementById("btnVolverCatalogo");
const btnRepetirExamen = document.getElementById("btnRepetirExamen");

let examenActual = null;
let examenEnviado = false;

function mostrarVista(vista) {
  seccionCatalogo.classList.add("oculto");
  seccionExamen.classList.add("oculto");
  seccionResultado.classList.add("oculto");

  if (vista === "catalogo") {
    seccionCatalogo.classList.remove("oculto");
  } else if (vista === "examen") {
    seccionExamen.classList.remove("oculto");
  } else if (vista === "resultado") {
    seccionResultado.classList.remove("oculto");
  }
}

function llenarFiltroMaterias() {
  const examenes = obtenerExamenes().filter(function (e) {
    return e.activo;
  });

  const materias = [];
  examenes.forEach(function (examen) {
    if (!materias.includes(examen.materia)) {
      materias.push(examen.materia);
    }
  });

  filtroMateria.innerHTML = "";
  const opcionTodas = document.createElement("option");
  opcionTodas.value = "";
  opcionTodas.textContent = "Todas las materias";
  filtroMateria.appendChild(opcionTodas);

  materias.forEach(function (materia) {
    const opcion = document.createElement("option");
    opcion.value = materia;
    opcion.textContent = materia;
    filtroMateria.appendChild(opcion);
  });
}

function pintarCatalogo() {
  const texto = inputBuscar.value.trim().toLowerCase();
  const materiaElegida = filtroMateria.value;

  const examenes = obtenerExamenes().filter(function (e) {
    if (!e.activo) {
      return false;
    }
    if (materiaElegida && e.materia !== materiaElegida) {
      return false;
    }
    if (!texto) {
      return true;
    }
    return (
      e.titulo.toLowerCase().includes(texto) ||
      e.materia.toLowerCase().includes(texto)
    );
  });

  listaExamenes.innerHTML = "";

  if (examenes.length === 0) {
    const vacio = document.createElement("div");
    vacio.className = "tarjeta tabla-vacia";
    vacio.textContent = "No hay examenes disponibles con ese filtro.";
    listaExamenes.appendChild(vacio);
    return;
  }

  examenes.forEach(function (examen) {
    const tarjeta = document.createElement("acme-tarjeta-examen");
    tarjeta.setAttribute("examen-id", String(examen.id));
    tarjeta.setAttribute("titulo", examen.titulo);
    tarjeta.setAttribute("materia", examen.materia);
    tarjeta.setAttribute("tiempo", String(examen.tiempo));
    tarjeta.setAttribute("cantidad", String((examen.preguntas || []).length));
    tarjeta.setAttribute("descripcion", examen.descripcion);
    listaExamenes.appendChild(tarjeta);
  });
}

function pintarHistorial() {
  const resultados = obtenerResultados();
  tablaResultados.innerHTML = "";

  if (resultados.length === 0) {
    const filaVacia = document.createElement("tr");
    const celda = document.createElement("td");
    celda.colSpan = 6;
    celda.className = "tabla-vacia";
    celda.textContent = "Todavia no hay resultados registrados.";
    filaVacia.appendChild(celda);
    tablaResultados.appendChild(filaVacia);
    return;
  }

  resultados.forEach(function (res) {
    const fila = document.createElement("tr");

    const tdEstudiante = document.createElement("td");
    tdEstudiante.textContent = res.estudiante;

    const tdExamen = document.createElement("td");
    tdExamen.textContent = res.examenTitulo;

    const tdPuntaje = document.createElement("td");
    tdPuntaje.textContent = res.aciertos + " / " + res.total;

    const tdPorcentaje = document.createElement("td");
    tdPorcentaje.textContent = res.porcentaje + "%";

    const tdEstado = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = res.aprobado ? "etiqueta estado-activo" : "etiqueta estado-inactivo";
    badge.textContent = res.aprobado ? "Aprobado" : "No aprobado";
    tdEstado.appendChild(badge);

    const tdFecha = document.createElement("td");
    tdFecha.textContent = res.fecha;

    fila.appendChild(tdEstudiante);
    fila.appendChild(tdExamen);
    fila.appendChild(tdPuntaje);
    fila.appendChild(tdPorcentaje);
    fila.appendChild(tdEstado);
    fila.appendChild(tdFecha);

    tablaResultados.appendChild(fila);
  });
}

function iniciarExamen(idExamen) {
  const examenes = obtenerExamenes();
  const encontrado = examenes.find(function (e) {
    return e.id === idExamen;
  });

  if (!encontrado || !encontrado.preguntas || encontrado.preguntas.length === 0) {
    return;
  }

  examenActual = encontrado;
  examenEnviado = false;

  const sesion = obtenerSesion();
  inputEstudiante.value = sesion ? sesion.nombre : "";

  tituloExamenActivo.textContent = examenActual.titulo;
  infoExamenActivo.textContent =
    examenActual.materia + " - " + examenActual.preguntas.length + " preguntas";

  pintarPreguntasExamen();
  actualizarProgreso();
  mostrarVista("examen");

  relojExamen.iniciar(examenActual.tiempo, function () {
    finalizarExamen(true);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function pintarPreguntasExamen() {
  contenedorPreguntas.innerHTML = "";
  const letras = ["A", "B", "C", "D"];

  examenActual.preguntas.forEach(function (pregunta, indice) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta tarjeta-pregunta";

    const enunciado = document.createElement("h3");
    enunciado.textContent = (indice + 1) + ". " + pregunta.enunciado;

    const listaOpciones = document.createElement("div");
    listaOpciones.className = "lista-opciones";

    pregunta.opciones.forEach(function (textoOpcion, idxOpcion) {
      const etiqueta = document.createElement("label");
      etiqueta.className = "opcion-respuesta";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "pregunta-" + indice;
      radio.value = String(idxOpcion);

      const texto = document.createElement("span");
      texto.textContent = letras[idxOpcion] + ") " + textoOpcion;

      etiqueta.appendChild(radio);
      etiqueta.appendChild(texto);
      listaOpciones.appendChild(etiqueta);
    });

    tarjeta.appendChild(enunciado);
    tarjeta.appendChild(listaOpciones);
    contenedorPreguntas.appendChild(tarjeta);
  });
}

function actualizarProgreso() {
  if (!examenActual) {
    return;
  }

  let respondidas = 0;
  examenActual.preguntas.forEach(function (pregunta, indice) {
    const marcada = formResolver.querySelector('input[name="pregunta-' + indice + '"]:checked');
    if (marcada) {
      respondidas = respondidas + 1;
    }
  });

  progresoPreguntas.textContent =
    "Respondidas: " + respondidas + " de " + examenActual.preguntas.length;
}

function cancelarExamen() {
  const confirmado = confirm("Seguro que deseas salir del examen? Se perdera tu avance.");
  if (!confirmado) {
    return;
  }

  relojExamen.detener();
  examenActual = null;
  examenEnviado = false;
  mostrarVista("catalogo");
}

function formatearFecha() {
  const ahora = new Date();
  const dia = String(ahora.getDate()).padStart(2, "0");
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const anio = ahora.getFullYear();
  const hora = String(ahora.getHours()).padStart(2, "0");
  const min = String(ahora.getMinutes()).padStart(2, "0");
  return dia + "/" + mes + "/" + anio + " " + hora + ":" + min;
}

function finalizarExamen(porTiempo) {
  // evitar doble envio si se acaba el tiempo
  if (examenEnviado || !examenActual) {
    return;
  }

  examenEnviado = true;
  relojExamen.detener();

  const nombreEstudiante = inputEstudiante.value.trim() || "Estudiante invitado";
  let aciertos = 0;
  const respuestas = [];

  examenActual.preguntas.forEach(function (pregunta, indice) {
    const marcada = formResolver.querySelector('input[name="pregunta-' + indice + '"]:checked');
    const seleccion = marcada ? Number(marcada.value) : -1;
    const esCorrecta = seleccion === pregunta.correcta;

    if (esCorrecta) {
      aciertos = aciertos + 1;
    }

    respuestas.push({
      pregunta: pregunta,
      seleccion: seleccion,
      esCorrecta: esCorrecta
    });
  });

  const total = examenActual.preguntas.length;
  const porcentaje = Math.round((aciertos / total) * 100);
  const aprobado = porcentaje >= 60;

  const registro = {
    id: generarId(obtenerResultados()),
    estudiante: nombreEstudiante,
    examenId: examenActual.id,
    examenTitulo: examenActual.titulo,
    aciertos: aciertos,
    total: total,
    porcentaje: porcentaje,
    aprobado: aprobado,
    fecha: formatearFecha()
  };

  guardarResultado(registro);

  resumenEstudiante.textContent =
    nombreEstudiante + " - " + examenActual.titulo;
  resumenPuntaje.textContent = aciertos + " / " + total;
  resumenPorcentaje.textContent = porcentaje + "%";
  resumenEstado.textContent = aprobado ? "Aprobado" : "No aprobado";

  if (porTiempo) {
    avisoResultado.textContent = "Se agoto el tiempo y el examen se envio automaticamente.";
    avisoResultado.classList.remove("oculto");
  } else {
    avisoResultado.classList.add("oculto");
  }

  pintarDetalleResultado(respuestas);
  pintarHistorial();
  mostrarVista("resultado");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function pintarDetalleResultado(respuestas) {
  detalleRespuestas.innerHTML = "";
  const letras = ["A", "B", "C", "D"];

  respuestas.forEach(function (item, indice) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta tarjeta-pregunta";

    const titulo = document.createElement("h3");
    titulo.textContent = (indice + 1) + ". " + item.pregunta.enunciado;

    const respuestaUsuario = document.createElement("p");
    if (item.seleccion === -1) {
      respuestaUsuario.className = "alerta alerta-error";
      respuestaUsuario.textContent = "Tu respuesta: Sin responder";
    } else if (item.esCorrecta) {
      respuestaUsuario.className = "alerta alerta-exito";
      respuestaUsuario.textContent =
        "Tu respuesta: " + letras[item.seleccion] + ") " + item.pregunta.opciones[item.seleccion] + " (Correcta)";
    } else {
      respuestaUsuario.className = "alerta alerta-error";
      respuestaUsuario.textContent =
        "Tu respuesta: " + letras[item.seleccion] + ") " + item.pregunta.opciones[item.seleccion] + " (Incorrecta)";
    }

    tarjeta.appendChild(titulo);
    tarjeta.appendChild(respuestaUsuario);

    if (!item.esCorrecta) {
      const correcta = document.createElement("p");
      correcta.className = "alerta alerta-exito";
      correcta.textContent =
        "Respuesta correcta: " +
        letras[item.pregunta.correcta] +
        ") " +
        item.pregunta.opciones[item.pregunta.correcta];
      tarjeta.appendChild(correcta);
    }

    detalleRespuestas.appendChild(tarjeta);
  });
}

// eventos y arranque
inputBuscar.addEventListener("input", pintarCatalogo);
filtroMateria.addEventListener("change", pintarCatalogo);

listaExamenes.addEventListener("iniciar-examen", function (evento) {
  iniciarExamen(evento.detail.id);
});

contenedorPreguntas.addEventListener("change", actualizarProgreso);

formResolver.addEventListener("submit", function (evento) {
  evento.preventDefault();
  finalizarExamen(false);
});

btnCancelarExamen.addEventListener("click", cancelarExamen);

btnVolverCatalogo.addEventListener("click", function () {
  examenActual = null;
  mostrarVista("catalogo");
});

btnRepetirExamen.addEventListener("click", function () {
  if (examenActual) {
    iniciarExamen(examenActual.id);
  }
});

llenarFiltroMaterias();
pintarCatalogo();
pintarHistorial();
