// tarjeta de examen para el catalogo publico
class AcmeTarjetaExamen extends HTMLElement {
  connectedCallback() {
    const id = Number(this.getAttribute("examen-id"));
    const titulo = this.getAttribute("titulo") || "Examen sin titulo";
    const materia = this.getAttribute("materia") || "General";
    const tiempo = Number(this.getAttribute("tiempo")) || 5;
    const cantidad = Number(this.getAttribute("cantidad")) || 0;
    const descripcion = this.getAttribute("descripcion") || "";

    this.innerHTML = "";

    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta tarjeta-examen";

    const etiqueta = document.createElement("span");
    etiqueta.className = "etiqueta";
    etiqueta.textContent = materia;

    const encabezado = document.createElement("h3");
    encabezado.className = "tarjeta-titulo";
    encabezado.textContent = titulo;

    const texto = document.createElement("p");
    texto.className = "tarjeta-descripcion";
    texto.textContent = descripcion;

    const datos = document.createElement("div");
    datos.className = "tarjeta-datos";

    const infoTiempo = document.createElement("span");
    infoTiempo.textContent = "Duracion: " + tiempo + " min";

    const infoPreguntas = document.createElement("span");
    infoPreguntas.textContent = cantidad + (cantidad === 1 ? " pregunta" : " preguntas");

    datos.appendChild(infoTiempo);
    datos.appendChild(infoPreguntas);

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn btn-primario";

    if (cantidad > 0) {
      boton.textContent = "Iniciar examen";
      const componente = this;
      boton.addEventListener("click", function () {
        componente.dispatchEvent(
          new CustomEvent("iniciar-examen", {
            detail: { id: id },
            bubbles: true
          })
        );
      });
    } else {
      boton.textContent = "Sin preguntas";
      boton.disabled = true;
    }

    tarjeta.appendChild(etiqueta);
    tarjeta.appendChild(encabezado);
    tarjeta.appendChild(texto);
    tarjeta.appendChild(datos);
    tarjeta.appendChild(boton);

    this.appendChild(tarjeta);
  }
}

if (!customElements.get("acme-tarjeta-examen")) {
  customElements.define("acme-tarjeta-examen", AcmeTarjetaExamen);
}
