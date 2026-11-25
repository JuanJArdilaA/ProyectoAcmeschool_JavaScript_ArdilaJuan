import { obtenerUsuarios } from "./datos.js";

const CLAVE_SESION = "acme_sesion";

// leer sesion activa sin romper si el json falla
export function obtenerSesion() {
  const texto = localStorage.getItem(CLAVE_SESION);
  if (!texto) {
    return null;
  }

  try {
    return JSON.parse(texto);
  } catch (error) {
    return null;
  }
}

// validar correo y clave contra usuarios guardados
export function iniciarSesion(correo, clave) {
  const usuarios = obtenerUsuarios();
  const correoLimpio = correo.trim().toLowerCase();

  const usuario = usuarios.find(function (u) {
    return u.correo.toLowerCase() === correoLimpio && u.clave === clave;
  });

  if (!usuario) {
    return {
      ok: false,
      mensaje: "Correo o contrasena incorrectos."
    };
  }

  if (!usuario.activo) {
    return {
      ok: false,
      mensaje: "Este usuario se encuentra inactivo."
    };
  }

  const sesion = {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol
  };

  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  return {
    ok: true,
    usuario: sesion
  };
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  window.location.href = "login.html";
}

// redirigir al login si la vista es privada
export function protegerRuta() {
  const sesion = obtenerSesion();
  if (!sesion) {
    window.location.href = "login.html";
    return null;
  }
  return sesion;
}
