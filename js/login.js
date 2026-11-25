import { inicializarDatos } from "./datos.js";
import { iniciarSesion, obtenerSesion } from "./auth.js";
import "./componentes/navbar.js";

inicializarDatos();

// referencias del formulario
const formLogin = document.getElementById("formLogin");
const inputCorreo = document.getElementById("inputCorreo");
const inputClave = document.getElementById("inputClave");
const mensajeError = document.getElementById("mensajeError");
const sesionActual = obtenerSesion();

function mostrarError(texto) {
  mensajeError.textContent = texto;
  mensajeError.classList.remove("oculto");
}

function limpiarError() {
  mensajeError.textContent = "";
  mensajeError.classList.add("oculto");
}

// si ya hay sesion activa entrar directo al panel
function verificarSesion() {
  if (sesionActual) {
    window.location.href = "examenes.html";
  }
}

function manejarLogin(evento) {
  evento.preventDefault();
  limpiarError();

  const correo = inputCorreo.value.trim();
  const clave = inputClave.value.trim();

  if (!correo || !clave) {
    mostrarError("Debes completar el correo y la contrasena.");
    return;
  }

  const resultado = iniciarSesion(correo, clave);

  if (!resultado.ok) {
    mostrarError(resultado.mensaje);
    return;
  }

  window.location.href = "examenes.html";
}

// eventos y arranque
formLogin.addEventListener("submit", manejarLogin);
verificarSesion();
