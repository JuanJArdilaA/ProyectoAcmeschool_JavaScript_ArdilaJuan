import { obtenerSesion, cerrarSesion } from "../auth.js";

// barra de navegacion reutilizable
class AcmeNavbar extends HTMLElement {
  connectedCallback() {
    const activo = this.getAttribute("activo") || "";
    const sesion = obtenerSesion();

    this.innerHTML = `
      <header class="barra">
        <div class="contenedor barra-contenido">
          <a href="index.html" class="marca">
            <span class="marca-icono">AS</span>
            <span class="marca-texto">Acme School</span>
          </a>
          <button type="button" class="btn-menu" aria-label="Abrir menu">Menu</button>
          <nav class="menu"></nav>
        </div>
      </header>
    `;

    const nav = this.querySelector(".menu");
    const btnMenu = this.querySelector(".btn-menu");

    this.agregarEnlace(nav, "index.html", "Examenes", activo === "inicio");

    if (sesion) {
      this.agregarEnlace(nav, "usuarios.html", "Usuarios", activo === "usuarios");
      this.agregarEnlace(nav, "examenes.html", "Gestionar examenes", activo === "examenes");

      const cajaUsuario = document.createElement("div");
      cajaUsuario.className = "menu-usuario";

      const nombre = document.createElement("span");
      nombre.className = "usuario-nombre";
      nombre.textContent = sesion.nombre + " (" + sesion.rol + ")";

      const btnSalir = document.createElement("button");
      btnSalir.type = "button";
      btnSalir.className = "btn btn-salir";
      btnSalir.textContent = "Salir";
      btnSalir.addEventListener("click", function () {
        cerrarSesion();
      });

      cajaUsuario.appendChild(nombre);
      cajaUsuario.appendChild(btnSalir);
      nav.appendChild(cajaUsuario);
    } else {
      this.agregarEnlace(nav, "login.html", "Ingresar", activo === "login");
    }

    // abrir o cerrar menu en movil
    btnMenu.addEventListener("click", function () {
      nav.classList.toggle("menu-abierto");
    });
  }

  agregarEnlace(contenedor, destino, texto, esActivo) {
    const enlace = document.createElement("a");
    enlace.href = destino;
    enlace.className = esActivo ? "menu-enlace enlace-activo" : "menu-enlace";
    enlace.textContent = texto;
    contenedor.appendChild(enlace);
  }
}

if (!customElements.get("acme-navbar")) {
  customElements.define("acme-navbar", AcmeNavbar);
}
