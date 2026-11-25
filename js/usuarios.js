import {
  inicializarDatos,
  obtenerUsuarios,
  guardarUsuarios,
  generarId
} from "./datos.js";
import { protegerRuta } from "./auth.js";
import "./componentes/navbar.js";

inicializarDatos();
const sesion = protegerRuta();

// referencias del dom y estado
const formUsuario = document.getElementById("formUsuario");
const tituloForm = document.getElementById("tituloForm");
const inputNombre = document.getElementById("inputNombre");
const inputCorreo = document.getElementById("inputCorreo");
const inputClave = document.getElementById("inputClave");
const selectRol = document.getElementById("selectRol");
const selectEstado = document.getElementById("selectEstado");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const mensajeUsuario = document.getElementById("mensajeUsuario");
const inputBuscar = document.getElementById("inputBuscar");
const tablaUsuarios = document.getElementById("tablaUsuarios");

let idEditando = null;

function mostrarMensaje(texto, tipo) {
  mensajeUsuario.textContent = texto;
  mensajeUsuario.className = "alerta " + (tipo === "error" ? "alerta-error" : "alerta-exito");
}

function ocultarMensaje() {
  mensajeUsuario.textContent = "";
  mensajeUsuario.className = "alerta oculto";
}

function limpiarFormulario() {
  formUsuario.reset();
  idEditando = null;
  tituloForm.textContent = "Nuevo usuario";
  btnGuardar.textContent = "Guardar usuario";
  btnCancelar.classList.add("oculto");
}

function cargarUsuario(id) {
  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find(function (u) {
    return u.id === id;
  });

  if (!usuario) {
    return;
  }

  ocultarMensaje();
  idEditando = usuario.id;
  inputNombre.value = usuario.nombre;
  inputCorreo.value = usuario.correo;
  inputClave.value = usuario.clave;
  selectRol.value = usuario.rol;
  selectEstado.value = usuario.activo ? "activo" : "inactivo";

  tituloForm.textContent = "Editar usuario";
  btnGuardar.textContent = "Actualizar usuario";
  btnCancelar.classList.remove("oculto");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function eliminarUsuario(id) {
  if (sesion && sesion.id === id) {
    mostrarMensaje("No puedes eliminar el usuario con sesion activa.", "error");
    return;
  }

  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find(function (u) {
    return u.id === id;
  });

  if (!usuario) {
    return;
  }

  const confirmado = confirm("Seguro que deseas eliminar a " + usuario.nombre + "?");
  if (!confirmado) {
    return;
  }

  const nuevaLista = usuarios.filter(function (u) {
    return u.id !== id;
  });

  guardarUsuarios(nuevaLista);
  if (idEditando === id) {
    limpiarFormulario();
  }
  mostrarMensaje("Usuario eliminado correctamente.", "exito");
  pintarTabla();
}

function guardarUsuario(evento) {
  evento.preventDefault();
  ocultarMensaje();

  const nombre = inputNombre.value.trim();
  const correo = inputCorreo.value.trim().toLowerCase();
  const clave = inputClave.value.trim();
  const rol = selectRol.value;
  const activo = selectEstado.value === "activo";

  if (!nombre || !correo || !clave) {
    mostrarMensaje("Todos los campos son obligatorios.", "error");
    return;
  }

  if (!correo.includes("@") || !correo.includes(".")) {
    mostrarMensaje("Ingresa un correo electronico valido.", "error");
    return;
  }

  if (clave.length < 4) {
    mostrarMensaje("La contrasena debe tener al menos 4 caracteres.", "error");
    return;
  }

  const usuarios = obtenerUsuarios();

  // validar que no se repita el correo
  const repetido = usuarios.find(function (u) {
    return u.correo.toLowerCase() === correo && u.id !== idEditando;
  });

  if (repetido) {
    mostrarMensaje("Ya existe un usuario registrado con ese correo.", "error");
    return;
  }

  if (idEditando !== null) {
    const actualizados = usuarios.map(function (u) {
      if (u.id === idEditando) {
        return {
          id: u.id,
          nombre: nombre,
          correo: correo,
          clave: clave,
          rol: rol,
          activo: activo
        };
      }
      return u;
    });

    guardarUsuarios(actualizados);
    limpiarFormulario();
    mostrarMensaje("Usuario actualizado correctamente.", "exito");
  } else {
    const nuevo = {
      id: generarId(usuarios),
      nombre: nombre,
      correo: correo,
      clave: clave,
      rol: rol,
      activo: activo
    };

    usuarios.push(nuevo);
    guardarUsuarios(usuarios);
    limpiarFormulario();
    mostrarMensaje("Usuario creado correctamente.", "exito");
  }

  pintarTabla();
}

function pintarTabla() {
  const texto = inputBuscar.value.trim().toLowerCase();
  const usuarios = obtenerUsuarios();

  const filtrados = usuarios.filter(function (u) {
    if (!texto) {
      return true;
    }
    return (
      u.nombre.toLowerCase().includes(texto) ||
      u.correo.toLowerCase().includes(texto) ||
      u.rol.toLowerCase().includes(texto)
    );
  });

  tablaUsuarios.innerHTML = "";

  if (filtrados.length === 0) {
    const filaVacia = document.createElement("tr");
    const celdaVacia = document.createElement("td");
    celdaVacia.colSpan = 5;
    celdaVacia.className = "tabla-vacia";
    celdaVacia.textContent = "No se encontraron usuarios.";
    filaVacia.appendChild(celdaVacia);
    tablaUsuarios.appendChild(filaVacia);
    return;
  }

  filtrados.forEach(function (usuario) {
    const fila = document.createElement("tr");

    const tdNombre = document.createElement("td");
    tdNombre.textContent = usuario.nombre;

    const tdCorreo = document.createElement("td");
    tdCorreo.textContent = usuario.correo;

    const tdRol = document.createElement("td");
    tdRol.textContent = usuario.rol;

    const tdEstado = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = usuario.activo ? "etiqueta estado-activo" : "etiqueta estado-inactivo";
    badge.textContent = usuario.activo ? "Activo" : "Inactivo";
    tdEstado.appendChild(badge);

    const tdAcciones = document.createElement("td");
    const cajaAcciones = document.createElement("div");
    cajaAcciones.className = "acciones";

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.className = "btn btn-secundario btn-pequeno";
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", function () {
      cargarUsuario(usuario.id);
    });

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn btn-peligro btn-pequeno";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", function () {
      eliminarUsuario(usuario.id);
    });

    cajaAcciones.appendChild(btnEditar);
    cajaAcciones.appendChild(btnEliminar);
    tdAcciones.appendChild(cajaAcciones);

    fila.appendChild(tdNombre);
    fila.appendChild(tdCorreo);
    fila.appendChild(tdRol);
    fila.appendChild(tdEstado);
    fila.appendChild(tdAcciones);

    tablaUsuarios.appendChild(fila);
  });
}

// eventos y arranque
formUsuario.addEventListener("submit", guardarUsuario);
btnCancelar.addEventListener("click", function () {
  ocultarMensaje();
  limpiarFormulario();
});
inputBuscar.addEventListener("input", pintarTabla);

if (sesion) {
  pintarTabla();
}
